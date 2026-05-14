# ML Software Engineering — Interview Prep Course (Outline)

**Purpose:** Skeleton for a portfolio tutorial that mirrors a structured ML program (Interview Kickstart–style pacing): **aggregates links to full tutorials where they exist**, and **owns complete explanations everywhere else** — without unnecessary extra courses unless depth truly warrants them (see placement policy below).

**Suggested public title:** *ML Software Engineering: Interview Concept Review*  
**Suggested slug:** `ml-swe-interview-prep` (when wired in Flask)

**Links below use site-relative URLs.** Dedicated tutorials resolve to `/tutorials/<slug>/` (first chapter URLs use `/tutorials/<slug>/chapter1` where applicable).

---

## Content placement policy (link vs explain here vs new tutorial)

**Goal:** Readers never hit a vague “TODO” inside the interview prep tutorial. Missing coverage is intentional only when marked as explicitly out of scope.

1. **If a strong onsite tutorial exists** — link prominently (“Go deeper”) and keep the prep section to **motivation → what interviews ask → 2-minute recap → pitfalls → link**.

2. **If no onsite tutorial exists** — **explain the concept properly inside the prep chapter** (definitions, small example, common mistakes). Length is OK; completeness beats brevity for interview-facing gaps.

3. **Create a separate new tutorial only when all are true:**
   - The topic is **substantially deep** (worthy of multiple sections, quizzes, demos, or long-term reuse outside this prep track).
   - Keeping it inline would **bloat or unbalance** the prep course (e.g. a mini-book inside one chapter).
   - It aligns with **other site goals** (not a one-off paragraph topic dressed up as a “course”).
   **Do not** mint new tutorials for thin checklists or material that reasonably fits two to four solid prep sections — **prefer generous inline exposition** instead.

This is deliberately **anti-greedy**: one well-written chapter section usually beats another shallow skeleton tutorial.

---

## Coverage gaps (no dedicated tutorial today → default placement)

Use this when implementing HTML chapters; revisit when adding new onsite courses.

| Topic / theme | Default for prep course | Separate tutorial candidate? |
|---------------|-------------------------|-------------------------------|
| Python tooling stack (venv, notebooks, dtypes, `%timeit`, profiling) | **Explain well in Ch 2** | Only if you later want a full “Python for ML” companion site-wide |
| Data analysis mindset (beyond EDA checklist) | **Inline** + link EDA tutorial | Rarely — EDA tutorial already anchors |
| SVM kernels & margins (IK Supervised II) | **Explain well in Ch 10.B** (~1–2 full sections); link ml-model-relationships for ensemble contrast | Yes **only** if you want an interactive SVM course later |
| k-NN theory + curse of dimensionality | **Inline in Ch 10.A** | No — embed in prep unless you unify with distance-metric clustering narrative |
| **Optimization week** (calculus recap, GD variants, LR schedules) | **Inline Ch 12** + deep link NN training chapters | Optional future “optimization for ML” only if exercises + viz justify it |
| Object detection/YOLO “survey” (IK DL I) | **Interview-level inline** in Ch 13 (diagram + trade-offs); no fabrication of CV lab unless you commit | Dedicated CV course only if interactive |
| Autoencoders / VAE / GAN (survey) | **Inline** in Ch 13 with honesty about training objectives | Dedicated generative-models tutorial if you invest in demos |
| RL / MDP / Q-learning (survey, IK DL II) | **Short inline appendix** in Ch 14 (“vocabulary for recruiters who ask”) | Full RL tutorial only for deep dive goal |
| **Scalable systems** (stream/batch/online IK track) | **Long inline primer** OR future dedicated tutorial — pick one once you draft length | Strong **candidate tutorial** if you write system-design cards + diagrams |
| **ML deployment & observability** (rollout, canary, tracing) | Mostly **inline Ch 15–17** + recycle ideas from [RAG production chapter](/tutorials/rag/), agents courses | Dedicated “MLE ops” tutorial if chapters would duplicate across RAG/agents prep |
| Case-study archetypes (fraud, search, reco, ads) | **Purely prep**: templates + diagrams + “what good answer includes” | No separate tutorial unless you gamify scenarios |
| Career / behavioral (Part XIV) | **Brief appendix or skip** — different contract than technical mastery | Separate site section, not ML tutorial catalogue |

Anything marked **explain well inline** still follows the Recommended Tutorial Template in [`tutorial-website-review.md`](/static/docs/tutorial-website-review.md) *inside this prep tutorial’s sections* — objectives first, then body, then pitfalls.

---

## Part classification (groups your calendar into themes)

| Part | Theme | Typical sources in a long ML program |
|------|--------|--------------------------------------|
| **I** | Onboarding & tooling | Orientation, Discord, starter kits, ML maths prereq pointers |
| **II** | Python → ML coding stack | Python fundamentals → NumPy/plotting → “Python for ML” |
| **III** | Data literacy | Data analysis / EDA mindset |
| **IV** | First supervised loop | Intro ML, build first model, workshops |
| **V** | GenAI literacy | Prompting + fundamentals of GenAI |
| **VI** | Classical supervised breadth | Trees, ensembles, evaluation & interpretation |
| **VII** | Unsupervised + optimization | Dimensionality reduction, clustering, gradients/optimizers |
| **VIII** | Case studies & applied bundles | Structured end-to-end problem sets |
| **IX** | Deep learning spine | NN basics → architectures → transformers |
| **X** | Product & frontier ML | App building ML+GenAI, LLMs, GenAI in action, capstone themes |
| **XI** | Algorithms track | Sorting → recursion → trees → graphs → DP (DSA) |
| **XII** | Systems & scalable | Scalable / stream / batch motifs; deployment workshop |
| **XIII** | Masterclass-style consolidation | Supervised I/II, Unsupervised, DL I/II (your `overview.txt` weeks) |
| **XIV** | Career | Resume, behavioral, negotiation (out of scope for deep technical chapters; optional appendix) |

---

## Recommended chapter order (for the new tutorial)

Chapters are ordered so **foundations → classical ML → unsupervised/optimization → deep learning → systems → DSA** matches how many candidates study and how onsite loops often progress.

| # | Chapter title | Part | Notes |
|---|----------------|------|--------|
| 1 | How to use this prep path | I | Goals, pacing, mapping to onsite (ML modeling vs ML system design vs DSA vs behavioral). |
| 2 | Python stack for ML & DS | II | Scripts, notebooks, debugging, profiling at a glance; NumPy/matplotlib mindset. |
| 3 | Data analysis & EDA | III | Distributions, aggregates, pitfalls; tie to leakage later. → [Complete EDA: LeetCode dataset](/tutorials/complete-eda-leetcode/) |
| 4 | ML workflow & your first models | IV | Problem framing, splits, baseline, iterate. → [Machine Learning Fundamentals](/tutorials/ml-fundamentals/) |
| 5 | Workshops: applied checkpoints | IV | Consolidation mini-projects / open-ended reps (content TBD). |
| 6 | Generative AI & prompt engineering | V | Interview vocabulary; when prompting vs retrieval vs fine-tuning. → [Large Language Models (LLMs)](/tutorials/llms/), [RAG](/tutorials/rag/) |
| 7 | Tree-based models | VI | Trees + interpretability hooks. → [Decision Trees Tutorial](/tutorials/decision-trees/) |
| 8 | Ensembles & boosting | VI | Bagging/boosting/stacking mental model. → [ML Model Relationships](/tutorials/ml-model-relationships/) |
| 9 | Metrics, calibration & interpretation | VI | ROC/PR, class imbalance, what “good” means in prod. Extend [ML fundamentals](/tutorials/ml-fundamentals/) + model relationships narrative. |
| **10** | **Supervised learning — interview deep review** | **XIII** | **Merges “Supervised I + II” week topics** (`overview.txt`). See detailed outline below. |
| **11** | **Unsupervised learning — interview deep review** | **XIII** | Dimensionality reduction + clustering + mixtures. See detailed outline below. |
| 12 | Optimization & gradients | VII | Gradient descent variants, convex intuition, NN training jargon. Bridges into deep learning; complements model-optimization-heavy weeks. → [Neural Networks Fundamentals](/tutorials/neural-networks/) (training chapters) |
| **13** | **Deep learning — interview deep review (CV & architectures)** | **IX, XIII** | **DL “week I” themes**: MLP/CNN/detection/autoencoders/GANs; system design motifs (object detection stack). Detailed outline below. |
| **14** | **Deep learning — sequences, NLP & RL overview** | **IX, XIII** | **DL “week II” themes**: embeddings → RNN/LSTM → Transformers → light RL vocab. Detailed outline below. |
| 15 | RAG & retrieval systems | X | Prod patterns. → [RAG](/tutorials/rag/) |
| 16 | Agents & tooling | X | Agents for SWE-facing roles. → [Agentic AI Foundations](/tutorials/agentic-ai/), [Building Agentic AI Systems](/tutorials/building-agentic-ai/) |
| 17 | Building ML / GenAI products | X | UX, latency, observability mindset for apps. |

**Optional sidecar (Part VIII):** Case study playbook — fraud/anomaly, search relevance, recommendations, chatbot, ad serving, etc., as **ML system design archetypes** (can be an appendix or merged into Ch 17).

---

### Optional late-track chapters (align with IK-style specializations)

| # | Chapter title | Part | Notes |
|---|----------------|------|-------|
| 18 | Algorithms for ML interviews | XI | → [Coding Interview Algorithms](/tutorials/coding-interview-algorithms/) |
| 19 | Scalable systems primer | XII | Streams, batches, partitions, backpressure; tie to feature/serving sketches. |
| 20 | Linear algebra checkpoints | XIII | → [Matrix–Vector Multiplication](/tutorials/matrix-vector-multiplication/) |

**Note:** You asked for **three flagship technical chapters**; here **Supervised = Ch 10**, **Unsupervised = Ch 11**, **Deep learning = split into Ch 13 + 14** so each retains interview depth without a single overstuffed HTML page. If you prefer literally **one** deep-learning chapter, merge 13–14 and use internal sections.

---

## Chapter 10 — Supervised learning (interview deep review)

Consolidates **Supervised Learning I & II** module themes from `static/docs/overview.txt`. Each subsection should briefly re-teach definitions, equations where standard, typical interview follow-ups, and **common mistakes**.

### 10.A — Regression & linear models (Supervised I)

**Topics to cover (from overview)**

- Simple & multiple linear regression; polynomial regression  
- Regularization (L1/L2/elastic intuition; when sparse solutions matter)  
- Logistic regression (why linear outputs are **not** probabilities without a link function)  
- k-NN classifier/regressor framing  
- Classification metrics overview; ROC intuition  

**Portfolio deep dives**

| Topic | On-site tutorial |
|--------|------------------|
| ML intro, regression & classification pacing | [/tutorials/ml-fundamentals/](/tutorials/ml-fundamentals/) |
| Regularization sitting in broader model landscape | [/tutorials/ml-model-relationships/](/tutorials/ml-model-relationships/) |

**Interview question bank** (study cues from `overview.txt`): linear vs logistic, ROC mechanics, linear outputs as probabilities, L1 vs L2, correlated predictors / coefficients, imbalance, bias–variance, overfitting/underfitting examples.

---

### 10.B — Probabilistic & margin models; trees & ensembles (Supervised II)

**Topics to cover**

- Naive Bayes assumptions (conditional independence), failure modes  
- SVM: margin, kernels at high level, vs logistic trade-offs  
- Decision trees → Random Forest → boosting (bias–variance story)  

**Portfolio deep dives**

| Topic | On-site tutorial |
|--------|------------------|
| Naive Bayes | [/tutorials/naive-bayes/](/tutorials/naive-bayes/) |
| Decision trees | [/tutorials/decision-trees/](/tutorials/decision-trees/) |
| Ensembles / boosting journey | [/tutorials/ml-model-relationships/](/tutorials/ml-model-relationships/) |

**Interview question bank** (from overview): bias–variance + bagging/boosting; stacking vs bagging/boosting; SVM vs RF; adaboost rationale; RF randomness sources.

---

## Chapter 11 — Unsupervised learning (interview deep review)

Maps **Unsupervised Learning week** foundations from `overview.txt`.

### Topics to cover

- Dimensionality reduction: PCA eigenstructure, covariance intuition, PCA vs LDA/QDA positioning  
- Manifold-ish methods naming: **t-SNE**, **Isomap** (stress use as visualization vs reliable metric space)  
- Clustering taxonomy; **k-means** (+ choosing k); **GMM / EM**; relation k-means ↔ GMM  
- SVD & factor-style thinking (conceptual bridges to reco / matrices)  
- Factorization Machines (conceptual: interactions in sparse CTR-style data — keep short unless you rely on reco interviews)  

**Portfolio deep dives**

| Topic | On-site tutorial |
|--------|------------------|
| Clustering breadth (K-means, GMM, hierarchical, DBSCAN, evaluation) | [/tutorials/clustering/](/tutorials/clustering/) |
| PCA / eigen-thinking support | [/tutorials/matrix-vector-multiplication/](/tutorials/matrix-vector-multiplication/) (linear maps intuition) |

**Interview question bank** (from overview): EM for GMM, k-means vs GMM, PCA steps, orthogonal PCs, covariance meaning, categorical high cardinality tactics, PCA vs t-SNE, silhouette/elbow-style discussion cues.

---

## Chapter 13 — Deep learning review I (vision, architectures, generation)

Maps **Deep Learning I** foundations from `overview.txt`.

### Topics to cover

- Neural network basics → MLP; forward pass mental model  
- Optimization: minibatch GD popularity, saddles/noise, LR schedules (conceptual), hyperparameter knobs  
- Activations & initialization pitfalls (zeros, dying ReLUs, exploding/vanishing)  
- Evaluation for DL (distribution shift hint, calibration at high level)  
- CNN fundamentals; padding (valid vs same); pooling recap  
- Object detection lineage (conceptual buckets: regional proposals vs single-shot intuition) — keep **survey-level**  
- Autoencoders, VAEs, GANs (representation vs generative training signals, failure modes)

**Portfolio deep dives**

| Topic | On-site tutorial |
|--------|------------------|
| Core NN + CNN/RNN foundations | [/tutorials/neural-networks/](/tutorials/neural-networks/) |
| Architectural depth beyond CNNs/RNNs | Next chapter connects to [/tutorials/transformers/](/tutorials/transformers/) |

**Interview question bank** (from overview): convolution uses, training perceptron steps, frameworks, mini-batch rationale, DL limitations, autoencoder taxonomies, GAN popularity, supervised vs unsupervised for image classification (careful wording).

---

## Chapter 14 — Deep learning review II (NLP, sequences, transformers, RL teaser)

Maps **Deep Learning II** foundations from `overview.txt`.

### Topics to cover

- Embeddings (Word2Vec / GloVe at idea level: local vs global co-occurrence)  
- RNN→LSTM gating motivations (forget/input/output roles)  
- **Transformers**: self-attention scaling; why pretrained LLMs reshaped NLP interviews  
- Light sequential modeling interview prompts  
- RL vocabulary: MDP, Q-learning vs policy methods naming; clarify **when SWE-loop interviews expect depth**  

**Portfolio deep dives**

| Topic | On-site tutorial |
|--------|------------------|
| NLP coursework-style foundations | [/tutorials/nlp-fundamentals/](/tutorials/nlp-fundamentals/) |
| RNN/LSTM lanes | [/tutorials/neural-networks/](/tutorials/neural-networks/) (RNN/LSTM chapters) |
| Transformer architecture | [/tutorials/transformers/](/tutorials/transformers/) |
| LLM training & adaptation | [/tutorials/llms/](/tutorials/llms/) |
| Retrieval patterns | [/tutorials/rag/](/tutorials/rag/) |

**Interview question bank** (from overview): NLP applications, stemming/lemmatization, NER, TF–IDF vs dense retrieval, MDP/reward narratives, tic-tac-toe minimax mention if you keep RL appendix.

---

## Quick link index (all published dedicated tutorials)

| Slug | URL | Use in prep course for… |
|------|-----|-------------------------|
| `ml-fundamentals` | [/tutorials/ml-fundamentals/](/tutorials/ml-fundamentals/) | Supervised loop, regression/classification refresher |
| `ml-model-relationships` | [/tutorials/ml-model-relationships/](/tutorials/ml-model-relationships/) | Ensembles, regularization roadmap |
| `naive-bayes` | [/tutorials/naive-bayes/](/tutorials/naive-bayes/) | Supervised II probabilistic classifier |
| `decision-trees` | [/tutorials/decision-trees/](/tutorials/decision-trees/) | Trees + splits + pruning narratives |
| `clustering` | [/tutorials/clustering/](/tutorials/clustering/) | Unsupervised heavy coverage |
| `complete-eda-leetcode` | [/tutorials/complete-eda-leetcode/](/tutorials/complete-eda-leetcode/) | EDA / analysis habits |
| `matrix-vector-multiplication` | [/tutorials/matrix-vector-multiplication/](/tutorials/matrix-vector-multiplication/) | Linear intuition for PCA / matrices |
| `neural-networks` | [/tutorials/neural-networks/](/tutorials/neural-networks/) | DL spine through CNN/RNN/LSTM |
| `transformers` | [/tutorials/transformers/](/tutorials/transformers/) | Attention architecture depth |
| `nlp-fundamentals` | [/tutorials/nlp-fundamentals/](/tutorials/nlp-fundamentals/) | Classical NLP scaffolding |
| `llms` | [/tutorials/llms/](/tutorials/llms/) | Pretrain/finetune/prompt narratives |
| `rag` | [/tutorials/rag/](/tutorials/rag/) | Retrieval + augmentation production angle |
| `agentic-ai` | [/tutorials/agentic-ai/](/tutorials/agentic-ai/) | Agent foundations |
| `building-agentic-ai` | [/tutorials/building-agentic-ai/](/tutorials/building-agentic-ai/) | Production agents |
| `coding-interview-algorithms` | [/tutorials/coding-interview-algorithms/](/tutorials/coding-interview-algorithms/) | DSA companion track |

Chaptered tutorials (link to **`/chapter1`** for linear reading): neural-networks, transformers, llms, rag, decision-trees, clustering, coding-interview-algorithms, building-agentic-ai, agentic-ai, ml-model-relationships, ml-fundamentals, etc.

---

## Implementation reminders (when you add HTML chapters)

- Each flagship chapter opens with **measurable objectives**, then sections matching this outline; add **“Go deeper”** callouts **only where a URL exists**.  
- Reuse terminology from [`tutorial-website-review.md`](/static/docs/tutorial-website-review.md): problem → intuition → formal bit → pitfalls → recap.  
- **No orphan bullets:** topics without links get **full inline treatment** per the placement policy above; no empty “Coming soon” unless you intentionally schedule work.  
- External links optional; prefer **never** leaking readers if you can own the explanation in-repo for interview scope.

---

## Source alignment

Interview-style **module inventories and question banks** for Supervised / Unsupervised / Deep Learning weeks are summarized from `static/docs/overview.txt` (your consolidated notes).
