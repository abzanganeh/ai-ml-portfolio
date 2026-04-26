from __future__ import annotations

from dataclasses import dataclass
from typing import Literal


ReviewStatus = Literal["pass", "watch"]


@dataclass(frozen=True)
class TutorialContentReview:
    slug: str
    conceptual_correctness: ReviewStatus
    message_quality: ReviewStatus
    explanation_depth: ReviewStatus
    reviewed_scope: tuple[str, ...]
    findings: tuple[str, ...]
    follow_ups: tuple[str, ...] = ()
    blocking_issues: tuple[str, ...] = ()

    @property
    def has_no_blocking_issues(self) -> bool:
        return bool(self.reviewed_scope and self.findings) and not self.blocking_issues

    @property
    def is_quality_complete(self) -> bool:
        return self.has_no_blocking_issues and all(
            status == "pass"
            for status in (
                self.conceptual_correctness,
                self.message_quality,
                self.explanation_depth,
            )
        )


TUTORIAL_CONTENT_REVIEWS: dict[str, TutorialContentReview] = {
    "nlp-fundamentals": TutorialContentReview(
        slug="nlp-fundamentals",
        conceptual_correctness="pass",
        message_quality="pass",
        explanation_depth="pass",
        reviewed_scope=("workflow", "text representations", "embeddings", "attention demos"),
        findings=(
            "The tutorial now frames NLP as broader than machine learning alone and keeps the section count aligned with the page navigation.",
            "Interactive examples give enough learner feedback to support the conceptual explanations.",
        ),
    ),
    "naive-bayes": TutorialContentReview(
        slug="naive-bayes",
        conceptual_correctness="pass",
        message_quality="pass",
        explanation_depth="watch",
        reviewed_scope=("Bayes theorem", "conditional independence", "Laplace-smoothed weather example"),
        findings=(
            "The worked example uses Laplace smoothing and no longer relies on rounded values that obscure the final score.",
            "The main remaining risk is depth, not correctness: the independence assumption should stay visible near practical examples.",
        ),
        follow_ups=("Add a short comparison between Multinomial, Bernoulli, and Gaussian Naive Bayes.",),
    ),
    "ml-fundamentals": TutorialContentReview(
        slug="ml-fundamentals",
        conceptual_correctness="pass",
        message_quality="watch",
        explanation_depth="watch",
        reviewed_scope=("introductory ML framing", "regression", "classification", "evaluation language"),
        findings=(
            "Core supervised-learning claims are sound and appropriate for a beginner course.",
            "Regression and classification chapters would benefit from more explicit assumptions and common mistake notes.",
        ),
        follow_ups=("Add more concrete diagnostics for underfitting, overfitting, leakage, and metric choice.",),
    ),
    "ml-model-relationships": TutorialContentReview(
        slug="ml-model-relationships",
        conceptual_correctness="pass",
        message_quality="pass",
        explanation_depth="pass",
        reviewed_scope=("model family map", "regularization", "ensembles", "boosting comparisons"),
        findings=(
            "The model-family narrative correctly frames regularization and ensembles as responses to common model failure modes.",
            "The course has one of the clearer through-lines in the tutorial set.",
        ),
    ),
    "decision-trees": TutorialContentReview(
        slug="decision-trees",
        conceptual_correctness="pass",
        message_quality="watch",
        explanation_depth="watch",
        reviewed_scope=("tree splits", "entropy", "Gini impurity", "pruning", "advanced methods"),
        findings=(
            "Entropy, Gini, and pruning concepts are directionally correct for an intermediate decision-tree tutorial.",
            "Formula-heavy sections need consistent variable definitions and interpretation near each major equation.",
        ),
        follow_ups=("Convert remaining dense formula blocks into canonical formula cards with assumptions and examples.",),
    ),
    "complete-eda-leetcode": TutorialContentReview(
        slug="complete-eda-leetcode",
        conceptual_correctness="pass",
        message_quality="pass",
        explanation_depth="pass",
        reviewed_scope=("dataset framing", "missing data", "outliers", "summaries", "visual insights"),
        findings=(
            "The EDA workflow is conceptually sound and makes the dataset story clear before introducing transformations.",
            "The tutorial explains why each step matters instead of presenting charting as a checklist.",
        ),
    ),
    "clustering": TutorialContentReview(
        slug="clustering",
        conceptual_correctness="pass",
        message_quality="watch",
        explanation_depth="watch",
        reviewed_scope=("distance metrics", "K-means", "hierarchical clustering", "DBSCAN", "GMMs", "evaluation"),
        findings=(
            "The algorithm descriptions and major metric definitions are broadly correct for the published clustering path.",
            "Many placeholder visual blocks remain; they are a learner-experience issue rather than a blocking conceptual error.",
        ),
        follow_ups=("Replace or clearly label remaining placeholder visualization blocks during the lab-quality pass.",),
    ),
    "matrix-vector-multiplication": TutorialContentReview(
        slug="matrix-vector-multiplication",
        conceptual_correctness="pass",
        message_quality="pass",
        explanation_depth="pass",
        reviewed_scope=("2D matrix-vector multiplication", "geometric transformations", "interactive controls"),
        findings=(
            "The tutorial accurately connects numeric multiplication to geometric transformations without implying every matrix is a single simple transform.",
            "The angle readout is labeled as output direction, avoiding confusion with a matrix-wide rotation angle.",
            "The visual feedback makes the mental model unusually clear for a beginner linear algebra topic.",
        ),
    ),
    "coding-interview-algorithms": TutorialContentReview(
        slug="coding-interview-algorithms",
        conceptual_correctness="pass",
        message_quality="pass",
        explanation_depth="pass",
        reviewed_scope=("data structures", "algorithm patterns", "complexity framing", "interview usage guidance"),
        findings=(
            "Algorithm chapters emphasize when to use a pattern and include practical complexity framing.",
            "The content is suitable for migration without conceptual blockers.",
        ),
    ),
    "neural-networks": TutorialContentReview(
        slug="neural-networks",
        conceptual_correctness="pass",
        message_quality="pass",
        explanation_depth="watch",
        reviewed_scope=("feedforward networks", "activations", "backpropagation", "CNNs", "RNNs", "LSTMs"),
        findings=(
            "The sequence from feedforward networks through specialized architectures is conceptually coherent.",
            "Backpropagation and recurrent-model sections should keep common failure modes close to the formulas.",
        ),
        follow_ups=("Add compact common-mistake notes for gradient flow, activation saturation, and sequence memory limits.",),
    ),
    "transformers": TutorialContentReview(
        slug="transformers",
        conceptual_correctness="pass",
        message_quality="watch",
        explanation_depth="watch",
        reviewed_scope=("attention", "self-attention", "multi-head attention", "positional encoding", "encoder-decoder flow"),
        findings=(
            "Core transformer mechanics are correct and ordered in a useful dependency chain.",
            "Some chapters are still dense; formula cards and worked shapes would make the explanation depth more consistent.",
        ),
        follow_ups=("Add tensor-shape walkthroughs and common mistakes around attention scaling, masking, and positional encodings.",),
    ),
    "llms": TutorialContentReview(
        slug="llms",
        conceptual_correctness="pass",
        message_quality="watch",
        explanation_depth="watch",
        reviewed_scope=("pre-training", "BERT", "GPT", "fine-tuning", "LoRA", "prompt engineering"),
        findings=(
            "The LLM chapters make sound distinctions between pre-training, adaptation, and prompting workflows.",
            "Legacy generic objective blocks were removed so the canonical, chapter-specific objectives carry the learner promise.",
        ),
        follow_ups=("Add more explicit safety and evaluation criteria to application-oriented chapters.",),
    ),
    "rag": TutorialContentReview(
        slug="rag",
        conceptual_correctness="pass",
        message_quality="watch",
        explanation_depth="watch",
        reviewed_scope=("embeddings", "chunking", "vector databases", "retrieval", "advanced RAG", "production RAG"),
        findings=(
            "The prior placeholder generation risk has been corrected; RAG examples no longer imply a complete grounded answer when generation is only sketched.",
            "The introduction now states that RAG can still fail when retrieval quality, source freshness, or prompting is weak.",
            "The retrieval and production sections call out grounding, latency, and monitoring risks.",
        ),
        follow_ups=("Add more hands-on retrieval evaluation and context-grounding checks during the lab pass.",),
    ),
    "agentic-ai": TutorialContentReview(
        slug="agentic-ai",
        conceptual_correctness="pass",
        message_quality="watch",
        explanation_depth="watch",
        reviewed_scope=("agent architecture", "tool use", "ReAct", "multi-agent systems", "orchestration", "evaluation"),
        findings=(
            "The agentic AI course correctly treats tool use, orchestration, and evaluation as reliability concerns, not only feature additions.",
            "Legacy generic objective blocks were removed so production-risk language stays tied to specific chapters.",
        ),
        follow_ups=("Strengthen examples around tool permissions, retries, observability, and human review gates.",),
    ),
}


def get_tutorial_content_review(slug: str) -> TutorialContentReview | None:
    return TUTORIAL_CONTENT_REVIEWS.get(slug)
