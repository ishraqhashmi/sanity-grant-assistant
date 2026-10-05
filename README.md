# AI Grant Writing Assistant with Sanity

A proof-of-concept showing how an NGO's past proposals, concept notes, budgets, and outcomes can be modelled as structured Sanity content and retrieved to ground an AI-assisted grant drafting workflow.

## Prototype status

This repository is designed to run in two modes:

- **Demo mode:** works locally with included fictional NGO sample data; no Sanity or AI credentials are required.
- **Sanity + AI mode:** connects to a Sanity dataset and an OpenAI-compatible chat model through environment variables.

The demo data is fictional and contains no confidential proposal material.

## Flow

1. A user enters a new funding opportunity.
2. The assistant searches the proposal archive for relevant past material.
3. Relevant proposals, concept notes, budgets and outcomes are assembled as context.
4. The AI drafts a grant concept while being instructed not to invent facts.
5. The UI shows the source records used for grounding.

## Sanity architecture

Sanity is the structured content system and retrieval layer. The AI model is the reasoning/drafting layer. Sanity Context can expose the same structured dataset to an MCP-compatible agent in read-only GROQ mode. See `docs/architecture.md`.

## Run locally

```bash
npm install
npm run dev
```

Open http://localhost:3000.

To connect a real Sanity project, copy `.env.example` to `.env.local` and add the project ID and dataset. To enable live AI drafting, add an OpenAI-compatible API key and model.







 
1. Sanity — priority technical project
“Building an AI Grant Writing Assistant with Sanity”
* Continue from npm install 
* Build and test the prototype 
* Prepare the Sanity content model/retrieval explanation 
* Address Jarod Reyes's three questions 
* Prepare the final response before October 9 
2. Green Central Banking — editorial sample project
* Take two of your genuine older articles 
* Edit/rework them for LinkedIn and Medium 
* Make their genuine climate/energy/finance/policy relevance much clearer 
* Preserve factual integrity and original publication history 
* Then use the strongest versions as samples when responding to the editor 
Tomorrow, if you simply say “Let's continue Sanity” or “Let's work on the two articles,” I'll know exactly which task you mean.

