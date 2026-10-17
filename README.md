# Daxoriq — Industrial Maintenance Intelligence Demo

Daxoriq is a portfolio prototype exploring how an AI-assisted workflow could help maintenance teams review machine alerts, inspect sample condition-monitoring data, and prepare work-order drafts for a qualified person to review.

It is **not a production predictive-maintenance system**. The included fleet, work orders, telemetry changes, and some charts are demo data. The benchmark explorer embeds a small subset of rows; it does not ship the complete datasets. The current repository does not include a trained or evaluated predictive model, live sensor ingestion, a vector-based manual-search/RAG pipeline, or a connected CMMS. AI functionality requires a server-side Gemini API key.

## Problem framing

Small and mid-sized manufacturers may have equipment signals, inspection notes, manuals, and maintenance history scattered across different tools. This prototype explores an end-to-end workflow for reviewing an alert, inspecting available evidence, asking an AI assistant for a cautious explanation, and drafting a maintenance task without pretending that an external system was updated.

**AI Builder Cup theme fit:** Manufacturing — Intelligent Operations & Industrial Efficiency. This is a proposed theme mapping, not confirmation of an assigned official problem statement. Match the final build against the exact statement assigned to your team before submission.

## Current prototype features

- Responsive React/TypeScript operations UI with fleet overview, asset/telemetry views, work-order management, benchmark sample explorer, image-review page, and chat interfaces.
- Browser-generated simulated telemetry so the interactions work without industrial sensors.
- Embedded example rows structured around public NASA C-MAPSS and UCI AI4I benchmark fields.
- Gemini-backed chat, diagnosis draft, work-order draft, and image-review endpoints when `GEMINI_API_KEY` is configured.
- A `GET /api/health` endpoint which reports server status and whether the Gemini key is configured.
- Explicit error states if AI requests fail. The app does not fabricate a diagnosis/work order response when the model is unavailable.
- Work orders stay local and are presented as drafts. The prototype does not sync to an external CMMS or dispatch a real technician.

## Important data and safety notes

- **UCI AI4I 2020:** the full public dataset contains 10,000 rows and is synthetic. The app embeds selected sample rows only. Source: [UCI Machine Learning Repository](https://archive.ics.uci.edu/dataset/601/ai4i%2B2020%2B).
- **NASA C-MAPSS:** the NASA public benchmark is based on simulated turbofan-engine run-to-failure trajectories. The app embeds selected sample rows only; it is not a copy of the full dataset. Source: [NASA Open Data — C-MAPSS Jet Engine Simulated Data](https://data.nasa.gov/dataset/cmapss-jet-engine-simulated-data).
- Neither dataset represents live measurements from the hypothetical factory shown in the UI. NASA's public data listing does not specify a license; check the source terms before redistributing any downloaded source files.
- The prototype has **no trained or validated Daxoriq RUL/failure model**. It does not claim model accuracy, measured downtime reduction, customer outcomes, or calibrated failure probabilities.
- A regular RGB image is not a calibrated radiometric thermogram. AI image observations are tentative; do not treat generated temperatures or suggestions as calibrated measurements.
- All generated maintenance content is an unverified draft. It must be checked by a qualified technician against OEM documentation and site-approved safety procedures. Do not use this demo to make safety-critical decisions.

## Tech stack

- Frontend: React 19, TypeScript, Vite, Tailwind CSS 4, Lucide icons.
- API: Node.js, Express, TypeScript source bundled to `server.js` with esbuild.
- AI: Google Gemini API via `@google/genai`.
- Deployment target: Google Cloud Run container.
- Data state: in-memory/browser demo state and embedded sample arrays; no persistent database configured.

## Run locally

Requirements: Node.js 22+ and npm.

1. Install dependencies:

   ```bash
   npm install
   ```

2. Create your local environment file:

   ```bash
   cp .env.example .env
   ```

3. Add your own Gemini key to `.env`:

   ```env
   GEMINI_API_KEY=your_key_here
   PORT=3000
   ```

   Never commit `.env` or a real API key. The key is used by the Express server, not the browser.

4. Start the integrated Vite + Express dev server:

   ```bash
   npm run dev
   ```

5. Open the local address Vite prints. The health endpoint is available at `/api/health`.

## Checks

```bash
npm run lint
npm run build
```

- `lint` runs the TypeScript compiler with `--noEmit`.
- `build` builds the frontend and bundles the server for production.

A GitHub Actions workflow also runs these checks on pushes and pull requests.

## Container / Google Cloud Run

The repo includes a Dockerfile for a single-container deployment. The server reads Cloud Run's `PORT` environment variable and serves the built frontend plus API from the same service.

Example (after authenticating the Google Cloud CLI and selecting a project):

```bash
gcloud run deploy daxoriq --source . --region asia-south1 --allow-unauthenticated
```

Configure `GEMINI_API_KEY` as a Cloud Run environment variable or, preferably, mount it from Secret Manager. Do not put secrets in the Dockerfile, frontend environment variables, or GitHub source. If using Secret Manager, create the secret first, grant the Cloud Run runtime service account access to it, and configure the service to expose that secret as `GEMINI_API_KEY`.

The deploy command above is an example and has not been run from this repository during this review. The deployment must succeed, then be smoke-tested at `/api/health` and through the user-facing flows before describing it as deployed.

## FDE portfolio priorities — next iterations

1. **Real discovery:** interview a maintenance technician or workshop manager and document the current alert-to-repair workflow and its pain points.
2. **Full data pipeline:** load public source datasets from their official pages with attribution; record source version, license, transformation, and row counts.
3. **Reproducible ML baseline:** train a simple baseline (e.g. gradient-boosted failure classifier or RUL regression), use leak-free train/test splits, report appropriate metrics, and save the evaluation report. Do not use benchmark sample rows as an evaluation set.
4. **Grounded AI:** ingest permitted manuals/inspection records into a source-cited retrieval pipeline, add retrieval and answer-quality tests, and clearly abstain when sources are missing.
5. **Working integrations:** connect a sandbox ticketing/API workflow and require human approval before creating an external work order.
6. **Persistence and access:** add PostgreSQL, authentication, tenant isolation, role-based permissions, audit events, and rate limiting before any real customer pilot.
7. **Measured pilot:** test with consenting users on a limited scope; measure baseline and outcome (e.g. alert triage time, completeness of work-order drafts, and technician corrections). Separate measured results from estimates.

## License

See [LICENSE](./LICENSE) for the repository license. Dataset licenses and terms may differ; use the linked data-provider records as the source of truth.
