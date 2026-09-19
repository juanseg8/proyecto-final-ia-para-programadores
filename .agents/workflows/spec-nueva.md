---
description: Lean feature-spec workflow.
---

# /spec-nueva

1. Inspect `specs/constitution.md`, `specs/000-index.md` and related domain docs.
2. For a straightforward feature, create a concise draft from `specs/_template/feature-spec.md`.
3. Invoke `spec-autor` only when product decisions are ambiguous, multiple invariants interact, or the human explicitly asks for a full spec workshop.
4. Ask the human only for decisions that materially change behavior.
5. Once approved, mark the feature `especificada`.
6. Do not start implementation automatically unless requested.

Avoid ceremonial questions already answered by existing specs.
