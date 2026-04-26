from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlsplit

import pytest
from bs4 import BeautifulSoup
from flask.testing import FlaskClient

from app import app as flask_app
from data.tutorial_content_reviews import TUTORIAL_CONTENT_REVIEWS, get_tutorial_content_review
from data.tutorial_chapters import CHAPTER_COURSES, build_chapter_context
from data.tutorials import TUTORIALS_DATA


ROOT_DIR = Path(__file__).resolve().parents[1]
TEMPLATES_DIR = ROOT_DIR / "templates"
TUTORIALS_DIR = TEMPLATES_DIR / "tutorials"
STATIC_DIR = ROOT_DIR / "static"

VALID_DIFFICULTIES = {"beginner", "intermediate", "advanced"}
SUCCESS_OR_REDIRECT_STATUSES = {200, 301, 302, 308}
TEMPLATE_DEPENDENCY_SUFFIXES = {
    ".css",
    ".gif",
    ".jpeg",
    ".jpg",
    ".js",
    ".png",
    ".svg",
    ".webp",
}
TEMPLATE_EXTENDS_PATTERN = re.compile(
    r'{%\s*extends\s+["\']tutorials/shared/chapter\.html["\']\s*%}'
)
TEMPLATE_EXTENDS_VALUE_PATTERN = re.compile(
    r'{%\s*extends\s+["\']([^"\']+)["\']\s*%}'
)
TEMPLATE_BLOCK_PATTERN = re.compile(r"{%\s*block\s+([A-Za-z0-9_]+)\s*%}")
STATIC_URL_FOR_PATTERN = re.compile(
    r"url_for\(\s*['\"]static['\"]\s*,\s*filename\s*=\s*['\"]([^'\"]+)['\"]"
)
LITERAL_STATIC_PATTERN = re.compile(r"""["'](/static/[^"'?#]+)""")
ONCLICK_ROUTE_PATTERN = re.compile(
    r"(?:window\.)?location(?:\.href)?\s*=\s*['\"]([^'\"]+)['\"]"
)
COURSE_INDEX_TEMPLATE = "tutorials/shared/course_index.html"
SINGLE_PAGE_TEMPLATE = "tutorials/shared/single_page.html"
CANONICAL_TUTORIAL_ASSETS = {
    "css/tutorials/chapter-template.css",
    "js/tutorials/chapter-template.js",
    "js/tutorials/shared-quiz.js",
}
REQUIRED_SHARED_COMPONENT_MACROS = {
    "meta_badges",
    "chapter_nav",
    "section_nav",
    "objectives",
    "content_section",
    "formula_card",
    "lab_card",
    "quiz",
    "summary",
    "previous_next",
}
ALLOWED_CHAPTER_BLOCKS = {
    "title",
    "tutorial_before_objectives",
    "tutorial_intro",
    "tutorial_concept",
    "tutorial_formula",
    "tutorial_implementation",
    "tutorial_lab",
    "tutorial_quiz",
    "tutorial_summary",
    "tutorial_extra_css",
    "tutorial_extra_js",
    "legacy_chapter_css",
    "legacy_chapter_content",
    "legacy_chapter_js",
}


@dataclass(frozen=True)
class TutorialCourseSpec:
    slug: str
    template_dir: str
    chapter_count: int

    @property
    def chapter_urls(self) -> list[str]:
        return [f"/tutorials/{self.slug}/chapter{chapter}" for chapter in range(1, self.chapter_count + 1)]

    @property
    def chapter_template_paths(self) -> list[Path]:
        return [
            TUTORIALS_DIR / self.template_dir / f"chapter{chapter}.html"
            for chapter in range(1, self.chapter_count + 1)
        ]


CHAPTERED_TUTORIALS = tuple(
    TutorialCourseSpec(
        config.slug,
        config.template_dir,
        len(config.chapter_titles),
    )
    for config in CHAPTER_COURSES.values()
)


@pytest.fixture()
def client() -> FlaskClient:
    flask_app.config.update(TESTING=True)
    return flask_app.test_client()


def published_tutorials() -> list[dict[str, object]]:
    return [tutorial for tutorial in TUTORIALS_DATA if tutorial.get("published")]


def published_template_paths() -> list[Path]:
    paths = {
        TEMPLATES_DIR / str(tutorial["template_path"])
        for tutorial in published_tutorials()
        if tutorial.get("has_dedicated_template") and tutorial.get("template_path")
    }

    for spec in CHAPTERED_TUTORIALS:
        paths.update(spec.chapter_template_paths)

    return sorted(paths)


def normalize_internal_url(raw_url: str) -> str | None:
    if not raw_url or "{{" in raw_url:
        return None

    stripped_url = raw_url.strip()
    if stripped_url.startswith(("#", "mailto:", "tel:", "javascript:")):
        return None

    parsed = urlsplit(stripped_url)
    if parsed.scheme or parsed.netloc or not parsed.path.startswith("/"):
        return None

    if parsed.path.startswith("/static/"):
        return None

    return parsed.path


def extract_internal_links(template_path: Path) -> set[str]:
    html = template_path.read_text(encoding="utf-8")
    soup = BeautifulSoup(html, "html.parser")
    links: set[str] = set()

    for tag in soup.find_all(True):
        for attribute in ("href", "action"):
            normalized_url = normalize_internal_url(str(tag.get(attribute, "")))
            if normalized_url:
                links.add(normalized_url)

        onclick_value = tag.get("onclick")
        if onclick_value:
            for match in ONCLICK_ROUTE_PATTERN.finditer(str(onclick_value)):
                normalized_url = normalize_internal_url(match.group(1))
                if normalized_url:
                    links.add(normalized_url)

    return links


def extract_static_references(template_path: Path) -> set[str]:
    html = template_path.read_text(encoding="utf-8")
    references = set(STATIC_URL_FOR_PATTERN.findall(html))

    for match in LITERAL_STATIC_PATTERN.finditer(html):
        references.add(match.group(1).removeprefix("/static/"))

    return {
        reference
        for reference in references
        if Path(reference).suffix in TEMPLATE_DEPENDENCY_SUFFIXES
    }


def parse_template(template_path: Path) -> BeautifulSoup:
    return BeautifulSoup(template_path.read_text(encoding="utf-8"), "html.parser")


def extract_extends_target(template_path: Path) -> str | None:
    html = template_path.read_text(encoding="utf-8")
    match = TEMPLATE_EXTENDS_VALUE_PATTERN.search(html)
    return match.group(1) if match else None


def assert_route_is_available(client: FlaskClient, url: str) -> None:
    response = client.get(url)
    assert response.status_code in SUCCESS_OR_REDIRECT_STATUSES, (
        f"{url} returned {response.status_code}"
    )


def test_published_tutorial_metadata_is_complete() -> None:
    required_fields = {
        "title",
        "slug",
        "description",
        "category",
        "difficulty",
        "duration",
        "author",
        "excerpt",
        "tags",
    }
    slugs: set[str] = set()

    for tutorial in published_tutorials():
        missing_fields = [
            field for field in required_fields if not str(tutorial.get(field, "")).strip()
        ]
        assert not missing_fields, f"{tutorial.get('slug', tutorial)} is missing {missing_fields}"

        slug = str(tutorial["slug"])
        assert slug not in slugs, f"Duplicate tutorial slug: {slug}"
        assert re.fullmatch(r"[a-z0-9]+(?:-[a-z0-9]+)*", slug), f"Invalid slug: {slug}"
        slugs.add(slug)

        assert tutorial["difficulty"] in VALID_DIFFICULTIES
        assert [tag.strip() for tag in str(tutorial["tags"]).split(",") if tag.strip()]

        if tutorial.get("has_dedicated_template"):
            template_path = TEMPLATES_DIR / str(tutorial["template_path"])
            assert template_path.exists(), f"Missing template for {slug}: {template_path}"


@pytest.mark.parametrize("spec", CHAPTERED_TUTORIALS, ids=lambda spec: spec.slug)
def test_chapter_metadata_contract_is_complete(spec: TutorialCourseSpec) -> None:
    for chapter_number in range(1, spec.chapter_count + 1):
        context = build_chapter_context(spec.slug, chapter_number)
        assert context is not None, f"Missing chapter context for {spec.slug} {chapter_number}"

        course = context["course"]
        chapter = context["chapter"]

        assert course.slug == spec.slug
        assert course.title
        assert len(course.chapters) == spec.chapter_count
        assert chapter.number == chapter_number
        assert chapter.title
        assert chapter.description
        assert chapter.difficulty in VALID_DIFFICULTIES
        assert chapter.duration
        assert 0 < chapter.progress <= 100
        assert len(chapter.sections) >= 2
        assert all(section["id"] and section["label"] for section in chapter.sections)
        assert len(chapter.objectives) >= 3
        assert all(objective.strip() for objective in chapter.objectives)

        if chapter_number == 1:
            assert chapter.previous_url is None
            assert chapter.previous_label is None
        else:
            assert chapter.previous_url == f"/tutorials/{spec.slug}/chapter{chapter_number - 1}"
            assert chapter.previous_label

        if chapter_number == spec.chapter_count:
            assert chapter.next_url is None
            assert chapter.next_label is None
        else:
            assert chapter.next_url == f"/tutorials/{spec.slug}/chapter{chapter_number + 1}"
            assert chapter.next_label


def test_published_tutorial_content_reviews_are_complete() -> None:
    published_slugs = {str(tutorial["slug"]) for tutorial in published_tutorials()}

    assert set(TUTORIAL_CONTENT_REVIEWS) == published_slugs

    for slug in sorted(published_slugs):
        review = get_tutorial_content_review(slug)
        assert review is not None
        assert review.slug == slug
        assert review.has_no_blocking_issues
        assert review.conceptual_correctness in {"pass", "watch"}
        assert review.message_quality in {"pass", "watch"}
        assert review.explanation_depth in {"pass", "watch"}
        assert not review.blocking_issues


def test_tutorial_content_reviews_track_quality_followups() -> None:
    reviews_with_followups = [
        review
        for review in TUTORIAL_CONTENT_REVIEWS.values()
        if not review.is_quality_complete
    ]

    assert reviews_with_followups
    assert all(review.follow_ups for review in reviews_with_followups)


def test_shared_component_library_keeps_required_macros() -> None:
    html = (TUTORIALS_DIR / "shared" / "_components.html").read_text(encoding="utf-8")
    declared_macros = set(re.findall(r"{%\s*macro\s+([A-Za-z0-9_]+)\s*\(", html))

    assert REQUIRED_SHARED_COMPONENT_MACROS <= declared_macros


@pytest.mark.parametrize("tutorial", published_tutorials(), ids=lambda tutorial: str(tutorial["slug"]))
def test_published_tutorial_routes_render(
    client: FlaskClient, tutorial: dict[str, object]
) -> None:
    slug = str(tutorial["slug"])
    route = f"/tutorials/{slug}/" if tutorial.get("has_dedicated_template") else f"/tutorial/{slug}/"

    assert_route_is_available(client, route)


@pytest.mark.parametrize("spec", CHAPTERED_TUTORIALS, ids=lambda spec: spec.slug)
def test_chapter_routes_match_template_inventory(
    client: FlaskClient, spec: TutorialCourseSpec
) -> None:
    for template_path in spec.chapter_template_paths:
        assert template_path.exists(), f"Missing chapter template: {template_path}"

    for url in spec.chapter_urls:
        response = client.get(url)
        assert response.status_code == 200, f"{url} returned {response.status_code}"

        soup = BeautifulSoup(response.get_data(as_text=True), "html.parser")
        shell = soup.select_one(".tutorial-template-shell")
        assert shell is not None, f"{url} did not render the canonical chapter shell"
        assert shell.get("data-course-slug") == spec.slug

        chapter_number = int(url.rsplit("chapter", maxsplit=1)[1])
        assert shell.get("data-chapter-number") == str(chapter_number)
        assert soup.select_one(".tutorial-template-meta") is not None
        assert soup.select_one(".tutorial-template-chapter-nav") is not None
        assert soup.select_one(".tutorial-template-section-nav") is not None
        assert soup.select_one(".tutorial-template-objectives") is not None
        assert soup.select_one(".tutorial-template-prev-next") is not None

        section_targets = {tag.get("id") for tag in soup.select("[id]")}
        for link in soup.select(".tutorial-template-section-nav__link"):
            href = str(link.get("href", ""))
            assert href.startswith("#"), f"{url} has non-anchor section link: {href}"
            assert href.removeprefix("#") in section_targets, (
                f"{url} section link {href} does not point to a rendered section"
            )

    missing_chapter_response = client.get(f"/tutorials/{spec.slug}/chapter{spec.chapter_count + 1}")
    assert missing_chapter_response.status_code == 404


def test_legacy_clustering_course_routes_redirect(client: FlaskClient) -> None:
    response = client.get("/tutorials/clustering-course/chapter1")

    assert response.status_code == 301
    assert response.headers["Location"].endswith("/tutorials/clustering/chapter1")


@pytest.mark.parametrize("template_path", published_template_paths(), ids=lambda path: str(path.relative_to(ROOT_DIR)))
def test_published_tutorial_links_resolve(
    client: FlaskClient, template_path: Path
) -> None:
    for url in sorted(extract_internal_links(template_path)):
        assert_route_is_available(client, url)


@pytest.mark.parametrize("template_path", published_template_paths(), ids=lambda path: str(path.relative_to(ROOT_DIR)))
def test_published_tutorial_static_assets_exist(template_path: Path) -> None:
    missing_assets = [
        asset_path
        for asset_path in sorted(extract_static_references(template_path))
        if not (STATIC_DIR / asset_path).exists()
    ]

    assert not missing_assets, f"{template_path.relative_to(ROOT_DIR)} references {missing_assets}"


@pytest.mark.parametrize("tutorial", published_tutorials(), ids=lambda tutorial: str(tutorial["slug"]))
def test_dedicated_tutorial_routes_use_shared_visual_system(
    client: FlaskClient, tutorial: dict[str, object]
) -> None:
    if not tutorial.get("has_dedicated_template"):
        pytest.skip("Generic tutorial route does not use a dedicated tutorial template")

    slug = str(tutorial["slug"])
    response = client.get(f"/tutorials/{slug}/")
    assert response.status_code == 200, f"/tutorials/{slug}/ returned {response.status_code}"

    soup = BeautifulSoup(response.get_data(as_text=True), "html.parser")
    shell = soup.select_one(".tutorial-template-shell")
    assert shell is not None, f"{slug} did not render the shared tutorial shell"

    if slug in CHAPTER_COURSES:
        assert soup.select_one(".tutorial-index-shell") is not None
        assert soup.select_one(".tutorial-index-chapters") is not None
    else:
        assert soup.select_one(".tutorial-single-page-shell") is not None
        assert soup.select_one(".tutorial-single-page-content") is not None


@pytest.mark.parametrize("tutorial", published_tutorials(), ids=lambda tutorial: str(tutorial["slug"]))
def test_dedicated_tutorial_templates_extend_expected_shared_layout(
    tutorial: dict[str, object],
) -> None:
    if not tutorial.get("has_dedicated_template"):
        pytest.skip("Generic tutorial route does not use a dedicated tutorial template")

    slug = str(tutorial["slug"])
    template_path = TEMPLATES_DIR / str(tutorial["template_path"])
    expected_layout = COURSE_INDEX_TEMPLATE if slug in CHAPTER_COURSES else SINGLE_PAGE_TEMPLATE

    assert extract_extends_target(template_path) == expected_layout, (
        f"{template_path.relative_to(ROOT_DIR)} must extend {expected_layout}"
    )


@pytest.mark.parametrize(
    "template_path",
    [
        TEMPLATES_DIR / str(tutorial["template_path"])
        for tutorial in published_tutorials()
        if tutorial.get("has_dedicated_template") and tutorial.get("template_path")
    ],
    ids=lambda path: str(path.relative_to(ROOT_DIR)),
)
def test_dedicated_tutorial_templates_are_not_standalone_documents(template_path: Path) -> None:
    html = template_path.read_text(encoding="utf-8")

    assert not re.search(r"<!DOCTYPE\s+html", html, re.IGNORECASE)
    assert not re.search(r"<\s*html(?:\s|>)", html, re.IGNORECASE)
    assert not re.search(r"<\s*head(?:\s|>)", html, re.IGNORECASE)
    assert not re.search(r"<\s*body(?:\s|>)", html, re.IGNORECASE)


@pytest.mark.parametrize(
    "template_path",
    [path for spec in CHAPTERED_TUTORIALS for path in spec.chapter_template_paths],
    ids=lambda path: str(path.relative_to(ROOT_DIR)),
)
def test_routable_chapter_templates_use_shared_shell(template_path: Path) -> None:
    html = template_path.read_text(encoding="utf-8")

    assert TEMPLATE_EXTENDS_PATTERN.search(html), (
        f"{template_path.relative_to(ROOT_DIR)} must extend tutorials/shared/chapter.html"
    )
    assert not re.search(r"<!DOCTYPE\s+html", html, re.IGNORECASE)
    assert not re.search(r"<html(?:\s|>)", html, re.IGNORECASE)
    assert not re.search(r"<head(?:\s|>)", html, re.IGNORECASE)
    assert not re.search(r"<body(?:\s|>)", html, re.IGNORECASE)


@pytest.mark.parametrize(
    "template_path",
    [path for spec in CHAPTERED_TUTORIALS for path in spec.chapter_template_paths],
    ids=lambda path: str(path.relative_to(ROOT_DIR)),
)
def test_routable_chapter_templates_use_supported_blocks(template_path: Path) -> None:
    html = template_path.read_text(encoding="utf-8")
    unsupported_blocks = sorted(
        set(TEMPLATE_BLOCK_PATTERN.findall(html)) - ALLOWED_CHAPTER_BLOCKS
    )

    assert not unsupported_blocks, (
        f"{template_path.relative_to(ROOT_DIR)} defines unsupported blocks "
        f"{unsupported_blocks}; use tutorials/shared/chapter.html blocks"
    )


@pytest.mark.parametrize(
    "template_path",
    [path for spec in CHAPTERED_TUTORIALS for path in spec.chapter_template_paths],
    ids=lambda path: str(path.relative_to(ROOT_DIR)),
)
def test_routable_chapters_use_canonical_objectives_only(template_path: Path) -> None:
    html = template_path.read_text(encoding="utf-8")

    assert "learning-objectives-box" not in html, (
        f"{template_path.relative_to(ROOT_DIR)} should rely on canonical objectives"
    )


@pytest.mark.parametrize("template_path", published_template_paths(), ids=lambda path: str(path.relative_to(ROOT_DIR)))
def test_published_templates_use_canonical_content_quality_classes(template_path: Path) -> None:
    html = template_path.read_text(encoding="utf-8")
    legacy_classes = {
        "formula-box",
        "formula-display",
        "example-box",
        "visualization-placeholder",
    }

    for legacy_class in legacy_classes:
        assert legacy_class not in html, (
            f"{template_path.relative_to(ROOT_DIR)} should not use legacy {legacy_class}"
        )


@pytest.mark.parametrize("template_path", published_template_paths(), ids=lambda path: str(path.relative_to(ROOT_DIR)))
def test_published_templates_do_not_inline_shared_tutorial_assets(template_path: Path) -> None:
    duplicated_assets = sorted(
        CANONICAL_TUTORIAL_ASSETS & extract_static_references(template_path)
    )

    assert not duplicated_assets, (
        f"{template_path.relative_to(ROOT_DIR)} should inherit shared tutorial assets "
        f"from the shared layout, not include {duplicated_assets}"
    )


def test_retired_tutorial_template_names_do_not_return() -> None:
    retired_templates = sorted(
        path.relative_to(ROOT_DIR)
        for path in TUTORIALS_DIR.rglob("*.html")
        if path.name.startswith("old_")
        or path.name.endswith("_old.html")
        or path.name == "legacy_chapter_shell.html"
    )

    assert not retired_templates, f"Retired tutorial templates should be removed: {retired_templates}"


@pytest.mark.parametrize("template_path", published_template_paths(), ids=lambda path: str(path.relative_to(ROOT_DIR)))
def test_shared_quiz_options_have_answer_contract(template_path: Path) -> None:
    soup = parse_template(template_path)

    for option in soup.select(".enhanced-quiz-option, .quiz-option"):
        data_correct = option.get("data-correct")
        has_radio_input = option.select_one('input[type="radio"]') is not None

        assert data_correct in {"true", "false"} or has_radio_input, (
            f"{template_path.relative_to(ROOT_DIR)} has a quiz option without "
            "data-correct or a radio input"
        )


@pytest.mark.parametrize(
    "template_path",
    [path for spec in CHAPTERED_TUTORIALS for path in spec.chapter_template_paths],
    ids=lambda path: str(path.relative_to(ROOT_DIR)),
)
def test_routable_chapters_use_shared_quiz_handler(template_path: Path) -> None:
    html = template_path.read_text(encoding="utf-8")

    assert not re.search(r"\bfunction\s+checkAnswer\s*\(", html), (
        f"{template_path.relative_to(ROOT_DIR)} should use static/js/tutorials/shared-quiz.js"
    )
