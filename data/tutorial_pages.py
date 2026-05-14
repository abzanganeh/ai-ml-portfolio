from __future__ import annotations

from dataclasses import dataclass
from typing import Any

from data.tutorial_chapters import CHAPTER_COURSES, ChapterCourseConfig
from data.tutorials import TUTORIALS_DATA


@dataclass(frozen=True)
class TutorialSection:
    id: str
    label: str


@dataclass(frozen=True)
class TutorialChapterCard:
    number: int
    title: str
    url: str


@dataclass(frozen=True)
class CourseIndexContext:
    slug: str
    title: str
    description: str
    category: str
    difficulty: str
    duration: str
    chapter_count: int
    chapters: tuple[TutorialChapterCard, ...]
    sections: tuple[TutorialSection, ...]
    objectives: tuple[str, ...]
    prerequisites: tuple[str, ...]


@dataclass(frozen=True)
class SinglePageContext:
    slug: str
    title: str
    description: str
    category: str
    difficulty: str
    duration: str
    sections: tuple[TutorialSection, ...]
    objectives: tuple[str, ...]


DEFAULT_SINGLE_PAGE_SECTIONS: tuple[TutorialSection, ...] = (
    TutorialSection("learning-objectives", "Objectives"),
    TutorialSection("tutorial-content", "Tutorial"),
)

SINGLE_PAGE_SECTIONS: dict[str, tuple[TutorialSection, ...]] = {
    "complete-eda-leetcode": (
        TutorialSection("learning-objectives", "Objectives"),
        TutorialSection("step1", "Dataset Overview"),
        TutorialSection("step2", "Missing Data"),
        TutorialSection("step3", "Data Types"),
        TutorialSection("step4", "Outliers"),
        TutorialSection("step5", "Statistics"),
        TutorialSection("step6", "Visualization"),
        TutorialSection("step7", "Insights"),
        TutorialSection("step8", "Solutions"),
    ),
    "nlp-fundamentals": (
        TutorialSection("learning-objectives", "Objectives"),
        TutorialSection("intro", "Introduction"),
        TutorialSection("workflow", "Workflow"),
        TutorialSection("text-repr", "Text Representation"),
        TutorialSection("embeddings", "Embeddings"),
        TutorialSection("sentiment", "Sentiment"),
        TutorialSection("seq2seq", "Seq2Seq"),
        TutorialSection("transformers", "Transformers"),
        TutorialSection("attention", "Attention"),
        TutorialSection("applications", "Applications"),
    ),
}

SINGLE_PAGE_OBJECTIVES: dict[str, tuple[str, ...]] = {
    "complete-eda-leetcode": (
        "Run a complete exploratory data analysis workflow on a realistic dataset.",
        "Choose defensible strategies for missing values, types, outliers, and summaries.",
        "Translate visual and statistical findings into practical next steps.",
    ),
    "matrix-vector-multiplication": (
        "Explain matrix-vector multiplication as a linear transformation.",
        "Predict how common 2D matrices rotate, scale, shear, or reflect vectors.",
        "Use the interactive controls to connect numeric multiplication with geometry.",
    ),
    "naive-bayes": (
        "Apply Bayes' theorem to classification problems.",
        "Explain the conditional independence assumption behind Naive Bayes.",
        "Implement and evaluate Naive Bayes on small practical examples.",
    ),
    "nlp-fundamentals": (
        "Describe the full NLP workflow from raw text to model predictions.",
        "Compare classical text features, embeddings, and transformer-based approaches.",
        "Use interactive examples to reason about common NLP tasks and trade-offs.",
    ),
}

COURSE_PREREQUISITES: dict[str, tuple[str, ...]] = {
    "coding-interview-algorithms": (
        "Comfort with one programming language.",
        "Basic Big-O notation and data structure terminology.",
    ),
    "ml-fundamentals": (
        "Basic Python programming.",
        "Algebra and introductory statistics.",
    ),
    "clustering": (
        "Basic machine learning vocabulary.",
        "Comfort reading simple formulas and plots.",
    ),
    "decision-trees": (
        "Basic supervised learning concepts.",
        "Familiarity with classification and regression tasks.",
    ),
    "ml-swe-interview-prep": (
        "Comfort describing ML projects aloud (datasets, constraints, failures).",
        "High-level familiarity with Python data tooling and supervised learning terminology.",
        "Exposure to neural networks OR willingness to skim those chapters alongside the NN tutorial.",
    ),
}


def build_course_index_context(slug: str) -> CourseIndexContext | None:
    tutorial = _get_tutorial(slug)
    config = CHAPTER_COURSES.get(slug)
    if tutorial is None or config is None:
        return None

    chapters = _build_chapter_cards(config)
    return CourseIndexContext(
        slug=slug,
        title=str(tutorial["title"]),
        description=str(tutorial["description"]),
        category=str(tutorial["category"]),
        difficulty=str(tutorial["difficulty"]),
        duration=str(tutorial["duration"]),
        chapter_count=len(chapters),
        chapters=chapters,
        sections=(
            TutorialSection("course-overview", "Overview"),
            TutorialSection("course-chapters", "Chapters"),
            TutorialSection("course-prerequisites", "Prerequisites"),
        ),
        objectives=_course_objectives(str(tutorial["title"]), len(chapters)),
        prerequisites=COURSE_PREREQUISITES.get(
            slug,
            (
                "Working knowledge of the course category.",
                "Willingness to work through examples and short checks.",
            ),
        ),
    )


def build_single_page_context(slug: str) -> SinglePageContext | None:
    tutorial = _get_tutorial(slug)
    if tutorial is None:
        return None

    return SinglePageContext(
        slug=slug,
        title=str(tutorial["title"]),
        description=str(tutorial["description"]),
        category=str(tutorial["category"]),
        difficulty=str(tutorial["difficulty"]),
        duration=str(tutorial["duration"]),
        sections=SINGLE_PAGE_SECTIONS.get(slug, DEFAULT_SINGLE_PAGE_SECTIONS),
        objectives=SINGLE_PAGE_OBJECTIVES.get(slug, _single_page_objectives(str(tutorial["title"]))),
    )


def is_chaptered_tutorial(slug: str) -> bool:
    return slug in CHAPTER_COURSES


def _get_tutorial(slug: str) -> dict[str, Any] | None:
    return next(
        (tutorial for tutorial in TUTORIALS_DATA if tutorial.get("slug") == slug),
        None,
    )


def _build_chapter_cards(config: ChapterCourseConfig) -> tuple[TutorialChapterCard, ...]:
    return tuple(
        TutorialChapterCard(
            number=index,
            title=title,
            url=f"/tutorials/{config.slug}/chapter{index}",
        )
        for index, title in enumerate(config.chapter_titles, start=1)
    )


def _course_objectives(title: str, chapter_count: int) -> tuple[str, ...]:
    return (
        f"Navigate the {title} learning path across {chapter_count} chapters.",
        "Choose the right chapter based on your current goal and prerequisites.",
        "Move from overview material into the canonical chapter experience.",
    )


def _single_page_objectives(title: str) -> tuple[str, ...]:
    return (
        f"Explain the core concepts covered in {title}.",
        "Use the interactive examples to connect theory with practice.",
        "Recognize the assumptions and limitations behind the tutorial workflow.",
    )
