import express from 'express'
import dotenv from 'dotenv'
import {createClient} from '@sanity/client'
import fs from 'node:fs/promises'
import path from 'node:path'
import {fileURLToPath} from 'node:url'

dotenv.config({path: '.env.local'})
const __dirname = path.dirname(fileURLToPath(import.meta.url))
const app = express()
app.use(express.json())

const port = process.env.PORT || 3000
const samplePath = path.join(__dirname, '..', 'data', 'sample.json')

function sanityClient() {
  if (!process.env.SANITY_PROJECT_ID) return null
  return createClient({
    projectId: process.env.SANITY_PROJECT_ID,
    dataset: process.env.SANITY_DATASET || 'production',
    apiVersion: process.env.SANITY_API_VERSION || '2026-09-03',
    token: process.env.SANITY_API_READ_TOKEN || undefined,
    useCdn: !process.env.SANITY_API_READ_TOKEN
  })
}

async function sampleDocs() {
  return JSON.parse(await fs.readFile(samplePath, 'utf8'))
}

function scoreDoc(doc, terms) {
  const haystack = JSON.stringify(doc).toLowerCase()
  return terms.reduce((score, term) => score + (haystack.includes(term) ? 1 : 0), 0)
}

async function retrieve(query) {
  const client = sanityClient()
  if (client) {
    const groq = `*[_type in ["proposal", "conceptNote", "budget", "outcome"] && (title match $q || programmeArea match $q || problemStatement match $q || summary match $q || beneficiaries match $q || outcomes[] match $q)]{_id,_type,title,organisation,programmeArea,region,problemStatement,objectives,activities,beneficiaries,budgetTotal,outcomes,status,summary,targetGroups,estimatedBudget,currency,total,lines,indicator,baseline,target,evidence}[0...12]`
    return await client.fetch(groq, {q: `*${query.trim()}*`})
  }
  const docs = await sampleDocs()
  const terms = query.toLowerCase().split(/\W+/).filter(Boolean)
  return docs
    .map(doc => ({doc, score: scoreDoc(doc, terms)}))
    .filter(x => x.score > 0)
    .sort((a, b) => b.score - a.score)
    .slice(0, 8)
    .map(x => x.doc)
}

function demoDraft(opportunity, sources) {
  const sourceNames = sources.map(s => s.title).join('; ')
  const areas = [...new Set(sources.map(s => s.programmeArea).filter(Boolean))]
  const beneficiaries = sources.find(s => s.beneficiaries)?.beneficiaries || '[confirm target beneficiary figure]'
  return `# Draft concept note\n\n## Working title\n${opportunity}\n\n## Rationale\nThe proposed project should build on relevant experience already documented in the organisation's grant archive. The retrieved material points to work in ${areas.join(', ') || '[programme area to confirm]'}, including community learning, digital skills, climate resilience and local participation.\n\n## Proposed approach\nThe project would adapt the most relevant activities from the retrieved records while checking that the new funder's eligibility rules, geography, budget ceiling and evidence requirements are met. Existing material suggests approaches such as facilitator training, structured learning sessions, community participation and outcome tracking.\n\n## Beneficiaries\nThe archive contains the following prior beneficiary description: ${beneficiaries}. This should be treated as historical source material, not as the proposed project's final target.\n\n## Evidence and outcomes\nRelevant archived outcomes include improved digital skills, participation in community activities and stronger links between youth groups and local institutions. The final indicators should be selected against the new call before submission.\n\n## Source records used\n${sourceNames || '[No matching records found]'}\n\n## Verification note\nThis draft is grounded in retrieved source records. Any new budget, beneficiary number, geographic claim or outcome target must be supplied or verified by the organisation before submission.`
}

async function aiDraft(opportunity, sources) {
  if (!process.env.OPENAI_API_KEY || !process.env.OPENAI_MODEL) return {draft: demoDraft(opportunity, sources), mode: 'demo'}
  const base = process.env.OPENAI_BASE_URL || 'https://api.openai.com/v1'
  const prompt = `You are an NGO grant-writing assistant. Draft a concise concept note for this funding opportunity: ${opportunity}. Use only the retrieved source records below. Do not invent numbers, partners, locations, outcomes or organisational history. Mark missing information as [VERIFY]. Preserve the distinction between historical evidence and proposed targets.\n\nSOURCES:\n${JSON.stringify(sources, null, 2)}`
  const response = await fetch(`${base}/chat/completions`, {
    method: 'POST',
    headers: {'Content-Type': 'application/json', Authorization: `Bearer ${process.env.OPENAI_API_KEY}`},
    body: JSON.stringify({model: process.env.OPENAI_MODEL, temperature: 0.2, messages: [{role: 'system', content: 'You produce source-grounded NGO grant drafts.'}, {role: 'user', content: prompt}]})
  })
  if (!response.ok) throw new Error(`AI request failed: ${response.status}`)
  const json = await response.json()
  return {draft: json.choices?.[0]?.message?.content || '', mode: 'ai'}
}

app.get('/', async (_req, res) => {
  res.send(`<!doctype html><html><head><meta charset="utf-8"><meta name="viewport" content="width=device-width"><title>AI Grant Writing Assistant</title><style>body{font-family:system-ui,sans-serif;max-width:1050px;margin:40px auto;padding:0 20px;line-height:1.5}textarea,input{width:100%;box-sizing:border-box;padding:12px;margin:8px 0 16px}button{padding:10px 18px;cursor:pointer}pre{white-space:pre-wrap;background:#f6f6f6;padding:18px;border-radius:8px}.card{border:1px solid #ddd;padding:14px;margin:10px 0;border-radius:8px}</style></head><body><h1>AI Grant Writing Assistant</h1><p>Proof of concept: structured NGO grant archive → retrieval → grounded draft.</p><label>Funding opportunity / brief</label><textarea id="opportunity" rows="5" placeholder="Example: Fund youth digital literacy and community cohesion in underserved areas."></textarea><button onclick="run()">Retrieve & Draft</button><h2>Retrieved source material</h2><div id="sources"></div><h2>Draft</h2><pre id="draft">Waiting for a request.</pre><script>async function run(){const opportunity=document.getElementById('opportunity').value;const r=await fetch('/api/draft',{method:'POST',headers:{'Content-Type':'application/json'},body:JSON.stringify({opportunity})});const j=await r.json();document.getElementById('sources').innerHTML=(j.sources||[]).map(s=>'<div class="card"><b>'+s.title+'</b><br>'+s._type+' · '+(s.programmeArea||'')+' · '+(s.region||'')+'</div>').join('')||'<p>No sources found.</p>';document.getElementById('draft').textContent=j.draft||j.error||'No draft returned.'}</script></body></html>`)
})

app.post('/api/draft', async (req, res) => {
  try {
    const opportunity = String(req.body?.opportunity || '').trim()
    if (!opportunity) return res.status(400).json({error: 'Please provide a funding opportunity.'})
    const sources = await retrieve(opportunity)
    const result = await aiDraft(opportunity, sources)
    res.json({opportunity, sources, ...result})
  } catch (error) {
    res.status(500).json({error: error.message})
  }
})

app.listen(port, () => console.log(`Grant assistant running at http://localhost:${port}`))
