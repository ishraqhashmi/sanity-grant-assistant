# Prototype architecture

## 1. Content model

The prototype treats the grant archive as structured content rather than a folder of documents.

### Proposal
- title
- organisation
- programme area
- region
- problem statement
- objectives
- activities
- beneficiaries
- budget total
- outcomes
- status

### Concept note
- title
- organisation
- programme area
- region
- summary
- target groups
- estimated budget

### Budget
- title
- programme area
- currency
- total
- line items

### Outcome
- title
- programme area
- indicator
- baseline
- target
- evidence

In a production implementation, references would connect proposals to their funding opportunity, budget, outcomes and source evidence.

## 2. Responsibility split

**Sanity:** authoritative structured content, editorial workflow, relationships, permissions, and retrieval of approved source material.

**AI layer:** interpret a new funding opportunity, select/use retrieved context, draft text, identify gaps and ask for missing information. It should not manufacture beneficiary numbers, budgets, outcomes or organisational history.

## 3. Sanity Context

Sanity Context can expose a scoped Sanity dataset through a hosted read-only MCP endpoint. In GROQ mode the agent can inspect the deployed schema and execute scoped GROQ queries. For this use case, the MCP should be filtered to the grant-archive document types and, where appropriate, to published/approved source material.

A typical agent sequence is:

1. Read the initial schema context.
2. Search proposal/concept/outcome content for the funding opportunity's themes.
3. Inspect relevant records and references.
4. Use the retrieved records as grounding context.
5. Draft the new concept note while preserving source attribution and refusing to invent unsupported facts.

For prose-heavy historical material, a Knowledge Base can be considered later. For structured proposal fields, GROQ mode is the natural first demonstration.
