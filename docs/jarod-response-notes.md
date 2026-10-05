# Notes for Jarod Reyes

## Question 1 — prototype

The repository contains a runnable proof of concept. It can run against fictional sample data without credentials and can be configured to retrieve live Sanity content and call an OpenAI-compatible model.

## Question 2 — modelling

The archive is modelled as Proposal, Concept Note, Budget and Outcome document types. The production schema should add references to funding opportunities, organisations and source evidence so that the relationships remain queryable.

## Question 3 — responsibility split

Sanity owns the structured source of truth and retrieval. The AI interprets a new call, selects relevant retrieved material, drafts and flags gaps. Sanity Context is the preferred agent-facing retrieval interface: a scoped, read-only MCP endpoint in GROQ mode can expose the deployed schema and permit the agent to query approved grant records. Knowledge Base mode can be considered later for long, prose-heavy archives.
