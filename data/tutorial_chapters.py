from __future__ import annotations

import re
from dataclasses import dataclass
from pathlib import Path
from typing import Any

from data.tutorials import TUTORIALS_DATA


ROOT_DIR = Path(__file__).resolve().parents[1]


@dataclass(frozen=True)
class ChapterCourseConfig:
    slug: str
    template_dir: str
    chapter_titles: tuple[str, ...]


@dataclass(frozen=True)
class ChapterNavItem:
    number: int
    title: str
    url: str


@dataclass(frozen=True)
class CourseContext:
    slug: str
    title: str
    chapters: tuple[ChapterNavItem, ...]


@dataclass(frozen=True)
class ChapterContext:
    number: int
    title: str
    description: str
    difficulty: str
    duration: str
    progress: int
    sections: tuple[dict[str, str], ...]
    objectives: tuple[str, ...]
    previous_url: str | None
    previous_label: str | None
    next_url: str | None
    next_label: str | None


CANONICAL_CHAPTER_SECTIONS: tuple[dict[str, str], ...] = (
    {"id": "learning-objectives", "label": "Objectives"},
    {"id": "chapter-content", "label": "Chapter Content"},
)

CHAPTER_OBJECTIVE_OVERRIDES: dict[tuple[str, int], tuple[str, str, str]] = {
    ("clustering", 14): (
        "Compare internal, external, relative, statistical, and stability-based clustering validation methods.",
        "Interpret major evaluation metrics such as silhouette, Davies-Bouldin, Calinski-Harabasz, ARI, NMI, and Hopkins statistic.",
        "Choose evaluation evidence that fits the available labels, data shape, and practical decision being made.",
    ),
}


COURSE_OBJECTIVE_TEMPLATES: dict[str, tuple[str, str, str]] = {
    "coding-interview-algorithms": (
        "Identify the interview pattern behind {chapter_title} problems.",
        "Implement {chapter_title} solutions with clear time and space complexity.",
        "Choose the right {chapter_title} technique under realistic interview constraints.",
    ),
    "clustering": (
        "Explain the assumptions and data conditions behind {chapter_title}.",
        "Apply {chapter_title} concepts to unsupervised learning examples.",
        "Evaluate when {chapter_title} is appropriate and when it can mislead analysis.",
    ),
    "decision-trees": (
        "Describe the decision-tree concepts behind {chapter_title}.",
        "Apply {chapter_title} to build or evaluate tree-based models.",
        "Recognize the practical trade-offs that shape reliable tree models.",
    ),
    "ml-fundamentals": (
        "Explain the core machine-learning ideas behind {chapter_title}.",
        "Connect {chapter_title} to practical model-building workflows.",
        "Recognize common assumptions, pitfalls, and evaluation choices.",
    ),
    "ml-model-relationships": (
        "Place {chapter_title} within the broader machine-learning model map.",
        "Explain how related model families solve different failure modes.",
        "Choose model strategies based on data shape, constraints, and goals.",
    ),
    "neural-networks": (
        "Explain the neural-network mechanism behind {chapter_title}.",
        "Connect {chapter_title} to training behavior and model performance.",
        "Recognize implementation choices that affect stability and generalization.",
    ),
    "transformers": (
        "Explain the transformer component behind {chapter_title}.",
        "Trace how {chapter_title} contributes to sequence modeling.",
        "Recognize the implementation trade-offs behind transformer architectures.",
    ),
    "llms": (
        "Explain the large-language-model concept behind {chapter_title}.",
        "Connect {chapter_title} to training, adaptation, or application workflows.",
        "Identify practical limitations and responsible usage considerations.",
    ),
    "rag": (
        "Explain how {chapter_title} supports retrieval-augmented generation.",
        "Apply {chapter_title} to design or evaluate a RAG pipeline.",
        "Recognize production risks such as retrieval quality, latency, and grounding.",
    ),
    "building-agentic-ai": (
        "Explain the agentic AI concept behind {chapter_title}.",
        "Apply {chapter_title} to design reliable, production-grade agent systems.",
        "Recognize operational trade-offs in tool use, orchestration, safety, and cost.",
    ),
    "agentic-ai": (
        "Explain the agentic AI concept behind {chapter_title}.",
        "Apply {chapter_title} to design safer, more reliable agent workflows.",
        "Identify operational risks in tool use, orchestration, evaluation, and monitoring.",
    ),
}


CHAPTER_COURSES: dict[str, ChapterCourseConfig] = {
    "ml-fundamentals": ChapterCourseConfig(
        slug="ml-fundamentals",
        template_dir="ml_fundamentals",
        chapter_titles=(
            "Introduction to Machine Learning",
            "Regression Analysis",
            "Classification Algorithms",
        ),
    ),
    "ml-model-relationships": ChapterCourseConfig(
        slug="ml-model-relationships",
        template_dir="ml-model-relationships",
        chapter_titles=(
            "The ML Landscape Map",
            "Foundation Models & Problems",
            "Regularization - The Problem Solvers",
            "Ensemble Methods - The Power of Many",
            "Random Forest Deep Dive",
            "Gradient Boosting Mastery",
            "XGBoost - The Champion",
            "Putting It All Together",
        ),
    ),
    "clustering": ChapterCourseConfig(
        slug="clustering",
        template_dir="clustering",
        chapter_titles=(
            "Introduction to Clustering",
            "Distance Metrics Fundamentals",
            "Minkowski Distance and Generalized Formulas",
            "K-means Clustering",
            "K-Means Clustering Theory",
            "K-Means Optimization",
            "Optimal K Selection",
            "Hierarchical Clustering Theory",
            "Linkage Criteria Methods",
            "Dendrogram Construction and Interpretation",
            "DBSCAN - Density-Based Clustering",
            "Gaussian Mixture Models",
            "Mean Shift Clustering",
            "Clustering Evaluation",
            "Advanced Applications and Case Studies",
        ),
    ),
    "decision-trees": ChapterCourseConfig(
        slug="decision-trees",
        template_dir="decision_trees",
        chapter_titles=(
            "Introduction to Decision Trees",
            "Decision Tree Mathematics",
            "Python Implementation",
            "Overfitting and Pruning",
            "Advanced Techniques",
        ),
    ),
    "coding-interview-algorithms": ChapterCourseConfig(
        slug="coding-interview-algorithms",
        template_dir="coding-interview-algorithms",
        chapter_titles=(
            "Arrays & Strings",
            "Linked Lists",
            "Stacks & Queues",
            "Trees & Binary Trees",
            "Graphs",
            "Dynamic Programming",
            "Backtracking",
            "Greedy Algorithms",
            "Binary Search",
            "Bit Manipulation",
        ),
    ),
    "neural-networks": ChapterCourseConfig(
        slug="neural-networks",
        template_dir="neural-networks",
        chapter_titles=(
            "Introduction to Neural Networks",
            "Feedforward Networks & Forward Propagation",
            "Activation Functions",
            "Backpropagation Algorithm",
            "Convolutional Neural Networks (CNNs)",
            "Recurrent Neural Networks (RNNs)",
            "Long Short-Term Memory (LSTM)",
            "Training Tips & Best Practices",
        ),
    ),
    "transformers": ChapterCourseConfig(
        slug="transformers",
        template_dir="transformers",
        chapter_titles=(
            "The Attention Mechanism",
            "Self-Attention Mechanism",
            "Multi-Head Attention",
            "Positional Encoding",
            "Feed-Forward Networks",
            "Residual Connections & Layer Normalization",
            "Encoder Architecture",
            "Decoder Architecture",
            "Complete Transformer Architecture",
            "Transformer Variants & Optimizations",
        ),
    ),
    "llms": ChapterCourseConfig(
        slug="llms",
        template_dir="llms",
        chapter_titles=(
            "Introduction to Large Language Models",
            "Pre-training Strategies",
            "BERT Architecture",
            "GPT Architecture",
            "Fine-tuning Strategies",
            "LoRA & Parameter-Efficient Fine-tuning",
            "Prompt Engineering",
            "LLM Applications & Best Practices",
        ),
    ),
    "rag": ChapterCourseConfig(
        slug="rag",
        template_dir="rag",
        chapter_titles=(
            "Introduction to RAG",
            "Text Embeddings & Vector Representations",
            "Document Processing & Chunking",
            "Vector Databases",
            "Retrieval Strategies",
            "Advanced RAG Techniques",
            "Production RAG Systems",
        ),
    ),
    "building-agentic-ai": ChapterCourseConfig(
        slug="building-agentic-ai",
        template_dir="building-agentic-ai",
        chapter_titles=(
            "What is an Agent?",
            "Anatomy of an Agent",
            "Agent Taxonomy",
            "Reasoning Deep-Dive",
            "Tool Use",
            "Model Context Protocol (MCP)",
            "Memory Systems",
            "Planning",
            "Context Management",
            "Multi-Agent Systems",
            "Orchestration Patterns",
            "Building with LangGraph",
            "CrewAI & OpenAI Agents SDK",
            "Advanced Multi-Agent Patterns",
            "Evaluation",
            "Safety, Security & Guardrails",
            "Observability & Debugging",
            "Deployment & Scaling",
            "CI/CD for Agents",
            "Fine-Tuning for Agentic Behavior",
            "Domain-Specific Agents",
            "The Frontier",
        ),
    ),
    "agentic-ai": ChapterCourseConfig(
        slug="agentic-ai",
        template_dir="agentic-ai",
        chapter_titles=(
            "Introduction to AI Agents",
            "Agent Architecture Components",
            "Tool-Using Agents",
            "ReAct Framework",
            "Multi-Agent Systems",
            "Agent Orchestration",
            "Agent Evaluation & Monitoring",
            "Building Production Agents",
        ),
    ),
}


def get_chapter_course_config(slug: str) -> ChapterCourseConfig | None:
    return CHAPTER_COURSES.get(slug)


def build_chapter_template_path(slug: str, chapter_number: int) -> str | None:
    config = get_chapter_course_config(slug)
    if not config or not _is_valid_chapter(config, chapter_number):
        return None

    return f"tutorials/{config.template_dir}/chapter{chapter_number}.html"


def build_chapter_context(slug: str, chapter_number: int) -> dict[str, Any] | None:
    config = get_chapter_course_config(slug)
    if not config or not _is_valid_chapter(config, chapter_number):
        return None

    tutorial = _get_tutorial(slug)
    if tutorial is None:
        return None

    chapter_title = config.chapter_titles[chapter_number - 1]
    course_title = str(tutorial["title"])
    course = CourseContext(
        slug=slug,
        title=course_title,
        chapters=_build_chapter_nav(config),
    )
    chapter = ChapterContext(
        number=chapter_number,
        title=f"Chapter {chapter_number}: {chapter_title}",
        description=f"{chapter_title} in {course_title}.",
        difficulty=str(tutorial["difficulty"]),
        duration=str(tutorial["duration"]),
        progress=round((chapter_number / len(config.chapter_titles)) * 100),
        sections=_extract_chapter_sections(config, chapter_number),
        objectives=_build_objectives(slug, chapter_number, chapter_title),
        previous_url=_chapter_url(slug, chapter_number - 1) if chapter_number > 1 else None,
        previous_label=_chapter_label(config, chapter_number - 1) if chapter_number > 1 else None,
        next_url=_chapter_url(slug, chapter_number + 1)
        if chapter_number < len(config.chapter_titles)
        else None,
        next_label=_chapter_label(config, chapter_number + 1)
        if chapter_number < len(config.chapter_titles)
        else None,
    )

    return {
        "tutorial": tutorial,
        "course": course,
        "chapter": chapter,
        "chapter_template_contract": "canonical",
    }


def _get_tutorial(slug: str) -> dict[str, object] | None:
    return next(
        (tutorial for tutorial in TUTORIALS_DATA if tutorial.get("slug") == slug),
        None,
    )


def _build_chapter_nav(config: ChapterCourseConfig) -> tuple[ChapterNavItem, ...]:
    return tuple(
        ChapterNavItem(
            number=index,
            title=title,
            url=_chapter_url(config.slug, index),
        )
        for index, title in enumerate(config.chapter_titles, start=1)
    )


def _build_objectives(slug: str, chapter_number: int, chapter_title: str) -> tuple[str, ...]:
    if (slug, chapter_number) in CHAPTER_OBJECTIVE_OVERRIDES:
        return CHAPTER_OBJECTIVE_OVERRIDES[(slug, chapter_number)]

    templates = COURSE_OBJECTIVE_TEMPLATES.get(
        slug,
        (
            "Explain the core ideas behind {chapter_title}.",
            "Apply {chapter_title} concepts to practical tutorial examples.",
            "Recognize when {chapter_title} is useful and where its limits appear.",
        ),
    )

    return tuple(template.format(chapter_title=chapter_title) for template in templates)


def _extract_chapter_sections(
    config: ChapterCourseConfig, chapter_number: int
) -> tuple[dict[str, str], ...]:
    template_path = ROOT_DIR / "templates" / "tutorials" / config.template_dir / f"chapter{chapter_number}.html"
    if not template_path.exists():
        return CANONICAL_CHAPTER_SECTIONS

    html = template_path.read_text(encoding="utf-8")
    sections = [{"id": "learning-objectives", "label": "Objectives"}]
    seen_ids = {"learning-objectives"}

    for section_id, label in re.findall(
        r'data-section=["\']([^"\']+)["\'][^>]*>(.*?)</button>',
        html,
        flags=re.IGNORECASE | re.DOTALL,
    ):
        cleaned_label = re.sub(r"<[^>]+>", "", label).strip()
        if section_id not in seen_ids and cleaned_label:
            sections.append({"id": section_id, "label": cleaned_label})
            seen_ids.add(section_id)

    if len(sections) == 1:
        for section_id in re.findall(
            r'id=["\']([^"\']+)["\'][^>]*class=["\'][^"\']*content-section',
            html,
            flags=re.IGNORECASE,
        ):
            if section_id not in seen_ids:
                sections.append({"id": section_id, "label": section_id.replace("-", " ").title()})
                seen_ids.add(section_id)

    return tuple(sections) if len(sections) > 1 else CANONICAL_CHAPTER_SECTIONS


def _chapter_url(slug: str, chapter_number: int) -> str:
    return f"/tutorials/{slug}/chapter{chapter_number}"


def _chapter_label(config: ChapterCourseConfig, chapter_number: int) -> str:
    return f"Chapter {chapter_number}: {config.chapter_titles[chapter_number - 1]}"


def _is_valid_chapter(config: ChapterCourseConfig, chapter_number: int) -> bool:
    return 1 <= chapter_number <= len(config.chapter_titles)
