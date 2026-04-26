from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path
from urllib.parse import urlsplit

import pytest
from bs4 import BeautifulSoup
from flask.testing import FlaskClient

from app import app as flask_app
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
    r'{%\s*extends\s+["\'](?:base\.html|tutorials/shared/(?:chapter|legacy_chapter_shell)\.html)["\']\s*%}'
)
STATIC_URL_FOR_PATTERN = re.compile(
    r"url_for\(\s*['\"]static['\"]\s*,\s*filename\s*=\s*['\"]([^'\"]+)['\"]"
)
LITERAL_STATIC_PATTERN = re.compile(r"""["'](/static/[^"'?#]+)""")
ONCLICK_ROUTE_PATTERN = re.compile(
    r"(?:window\.)?location(?:\.href)?\s*=\s*['\"]([^'\"]+)['\"]"
)


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


CHAPTERED_TUTORIALS = (
    TutorialCourseSpec("ml-fundamentals", "ml_fundamentals", 3),
    TutorialCourseSpec("ml-model-relationships", "ml-model-relationships", 8),
    TutorialCourseSpec("clustering", "clustering", 15),
    TutorialCourseSpec("decision-trees", "decision_trees", 5),
    TutorialCourseSpec("coding-interview-algorithms", "coding-interview-algorithms", 10),
    TutorialCourseSpec("neural-networks", "neural-networks", 8),
    TutorialCourseSpec("transformers", "transformers", 10),
    TutorialCourseSpec("llms", "llms", 8),
    TutorialCourseSpec("rag", "rag", 7),
    TutorialCourseSpec("agentic-ai", "agentic-ai", 8),
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
        assert_route_is_available(client, url)

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


@pytest.mark.parametrize(
    "template_path",
    [path for spec in CHAPTERED_TUTORIALS for path in spec.chapter_template_paths],
    ids=lambda path: str(path.relative_to(ROOT_DIR)),
)
def test_routable_chapter_templates_use_shared_shell(template_path: Path) -> None:
    html = template_path.read_text(encoding="utf-8")

    assert TEMPLATE_EXTENDS_PATTERN.search(html), (
        f"{template_path.relative_to(ROOT_DIR)} must extend base.html or a shared tutorial shell"
    )
    assert "<!DOCTYPE html" not in html
    assert "<html" not in html
    assert "<head" not in html
    assert "<body" not in html
