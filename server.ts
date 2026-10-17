import express from 'express';
import dotenv from 'dotenv';
import path from 'path';
import { fileURLToPath } from 'url';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = Number(process.env.PORT) || 3000;

app.use(express.json({ limit: '20mb' }));

// Health and configuration endpoint for the UI and deployment smoke tests.
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    aiConfigured: Boolean(process.env.GEMINI_API_KEY),
    dataMode: 'demo',
    telemetry: 'simulated-in-browser',
    note: 'This prototype is not connected to live factory sensors or a production CMMS.',
  });
});

// Server-side Gemini AI Client with telemetry header
const ai = process.env.GEMINI_API_KEY
  ? new GoogleGenAI({
      apiKey: process.env.GEMINI_API_KEY,
      httpOptions: {
        headers: {
          'User-Agent': 'aistudio-build',
        },
      },
    })
  : null;

// API Routes

// 1. AI Root-Cause Diagnostic Endpoint
app.post('/api/diagnose', async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: 'AI features are unavailable until GEMINI_API_KEY is configured.',
        code: 'AI_NOT_CONFIGURED',
      });
    }

    const { asset, currentSensors, activeFaults, telemetryHistory } = req.body;

    const prompt = `You are an AI assistant in an industrial-maintenance prototype. You are not a certified reliability engineer, and your output is not a validated or safety-critical diagnosis.
Analyze the following asset telemetry and maintenance context:

Asset: ${asset?.name || 'Industrial Machine'} (${asset?.type || 'General Machinery'})
Model: ${asset?.model || 'N/A'}, Location: ${asset?.bay || 'Factory Floor'}
Operating Hours: ${asset?.operatingHours || 0} hrs
Current Health Score: ${asset?.healthScore || 85}% | Predicted RUL: ${asset?.rulHours || 120} operating hours / cycles

Active Sensor Readings:
${JSON.stringify(currentSensors, null, 2)}

Active Anomaly Flags / Injected Faults:
${JSON.stringify(activeFaults, null, 2)}

Recent Telemetry Variance:
${JSON.stringify(telemetryHistory ? telemetryHistory.slice(-5) : [], null, 2)}

Provide a structured, authoritative predictive maintenance diagnosis in JSON format matching this schema:
{
  "severity": "NORMAL" | "MODERATE" | "HIGH" | "CRITICAL",
  "faultType": "string (e.g., Outer Race Bearing Spall (BPFO), Cavitation, Heat Dissipation Failure, Tool Wear Saturation)",
  "confidenceScore": number (0 to 100),
  "rootCauseSummary": "concise 2-sentence explanation of mechanical failure mechanism",
  "failureProbability72h": number (percentage 0-100),
  "standardsCompliance": "e.g. ISO 10816-3 Zone C (Unrestricted long-term operation not permitted)",
  "recommendedAction": "concrete maintenance technician instructions",
  "urgency": "IMMEDIATE_STOP" | "SCHEDULE_24H" | "MONITOR_NEXT_SHIFT" | "NOMINAL",
  "estimatedRepairHours": number,
  "requiredParts": [
    { "partNumber": "string", "description": "string", "inStock": boolean }
  ]
}

Use only the measurements and context supplied by the user. Never invent sensor readings, calibrated probabilities, standards compliance, stock levels, or credentials. If the evidence does not support a reliable prediction, clearly state this in rootCauseSummary and set unsupported numeric predictions to 0. Recommendations are drafts for qualified human review, never automatic shutdown or dispatch instructions. Use only the measurements and context supplied by the user. Never invent sensor readings, calibrated probabilities, standards compliance, stock levels, or credentials. If the evidence does not support a reliable prediction, state the limitation clearly and do not present an unvalidated estimate as measured fact. Recommendations are drafts for qualified human review, never automatic shutdown or dispatch instructions. Return ONLY valid JSON.`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
        temperature: 0.2,
      },
    });

    const text = response.text || '{}';
    res.json(JSON.parse(text));
  } catch (error: unknown) {
    console.error('Diagnosis error:', error instanceof Error ? error.message : error);
    return res.status(503).json({
      error: 'The AI diagnosis could not be generated. No diagnosis or failure probability is available.',
      code: 'AI_SERVICE_UNAVAILABLE',
    });
  }
});

// 2. AI Maintenance Copilot Chat & Manual Q&A
app.post('/api/chat', async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: 'AI features are unavailable until GEMINI_API_KEY is configured.',
        code: 'AI_NOT_CONFIGURED',
      });
    }

    const { messages, contextAsset } = req.body;
    if (
      !Array.isArray(messages) ||
      messages.length === 0 ||
      messages.some((message: any) =>
        !message ||
        !['user', 'assistant'].includes(message.role) ||
        typeof message.content !== 'string'
      )
    ) {
      return res.status(400).json({
        error: 'Send a non-empty messages array with user/assistant roles and string content.',
        code: 'INVALID_CHAT_MESSAGES',
      });
    }

    const systemInstruction = `You are the Daxoriq Industrial Maintenance Copilot in a demo prototype. You are not connected to a live plant, SCADA, CMMS, or external OEM manual unless a source is explicitly supplied in the request.
You assist industrial reliability engineers, plant managers, and field technicians with:
- Troubleshooting machine faults (vibration spectral peaks, thermal runaway, motor current signature analysis MCSA)
- NASA C-MAPSS and UCI AI4I industrial benchmark datasets and RUL prediction techniques
- General maintenance concepts and reviewable draft work orders; do not present unverified procedures as OEM instructions
- ISO 10816 (Mechanical vibration evaluation), ISO 13374 (Condition monitoring and diagnostics of machine systems), and OSHA lock-out tag-out (LOTO) protocols.
- Drafting work order tickets and requisitioning replacement components.

Safety and evidence rules: only use supplied context; never invent measurements, part availability, standards limits, sensor connections, or document citations. Say when evidence is insufficient. Do not instruct a user to perform hazardous maintenance; require site-approved lock-out/tag-out, OEM procedures, and a qualified technician. A work order is a draft for human approval, not an executed action.\n\nCurrent Machine Context:
${contextAsset ? JSON.stringify(contextAsset, null, 2) : 'No specific machine selected.'}

Keep responses concise, cautious, and formatted with markdown. For safety-critical or site-specific decisions, explain the uncertainty and direct the user to site-approved procedures and a qualified maintainer.`;

    const contents = messages.map((m: any) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }));

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents,
      config: {
        systemInstruction,
        temperature: 0.3,
      },
    });

    res.json({ reply: response.text });
  } catch (error: unknown) {
    console.error('Chat error:', error instanceof Error ? error.message : error);
    return res.status(503).json({
      error: 'The AI copilot could not respond. Check the server configuration and try again; no fallback diagnosis was generated.',
      code: 'AI_SERVICE_UNAVAILABLE',
    });
  }
});

// 3. Automated Work Order Generator
app.post('/api/generate-work-order', async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: 'AI features are unavailable until GEMINI_API_KEY is configured.',
        code: 'AI_NOT_CONFIGURED',
      });
    }

    const { asset, triggerReason, sensorSnapshot } = req.body;

    const prompt = `Generate a non-executing DRAFT industrial maintenance work order for human review. This system does not dispatch tickets. Do not invent part numbers, inventory status, or site-specific safety limits. If the input is insufficient, make the gap explicit in the draft.\n\nContext:
Asset: ${asset.name} (Tag: ${asset.tag}, Category: ${asset.category})
Trigger: ${triggerReason}
Sensor State: ${JSON.stringify(sensorSnapshot)}

Output valid JSON:
{
  "title": "Short descriptive work order title",
  "priority": "P1-CRITICAL" | "P2-HIGH" | "P3-MEDIUM" | "P4-LOW",
  "assignedTeam": "Mechanical / Electrical / Hydraulic / Reliability",
  "estimatedDurationMinutes": number,
  "requiredTooling": ["item 1", "item 2"],
  "safetyPrecautions": ["LOTO step 1", "PPE item 2"],
  "tasks": [
    { "step": 1, "instruction": "Clear instruction", "verified": false }
  ],
  "consumableParts": [
    { "sku": "string", "name": "string", "quantity": number, "unit": "pcs" | "liters" | "sets" }
  ]
}`;

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: prompt,
      config: {
        responseMimeType: 'application/json',
      },
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (error: unknown) {
    console.error('Work-order draft error:', error instanceof Error ? error.message : error);
    return res.status(503).json({
      error: 'The AI work-order draft could not be generated. No parts list or task sequence was fabricated.',
      code: 'AI_SERVICE_UNAVAILABLE',
    });
  }
});

// 4. Multimodal Thermal & Visual Inspection Analysis
app.post('/api/analyze-thermal', async (req, res) => {
  try {
    if (!ai) {
      return res.status(503).json({
        error: 'AI features are unavailable until GEMINI_API_KEY is configured.',
        code: 'AI_NOT_CONFIGURED',
      });
    }

    const { imageBase64, mimeType = 'image/jpeg', inspectionNotes } = req.body;
    if (typeof imageBase64 !== 'string' || imageBase64.trim().length === 0) {
      return res.status(400).json({
        error: 'Upload a thermal/inspection image before requesting analysis.',
        code: 'IMAGE_REQUIRED',
      });
    }

    let parts: any[] = [];
    if (imageBase64) {
      parts.push({
        inlineData: {
          mimeType,
          data: imageBase64.replace(/^data:image\/\w+;base64,/, ''),
        },
      });
    }

    parts.push({
      text: `Review the supplied image for visible thermal patterns only. Do not claim calibrated/radiometric measurements unless the image visibly contains a readable scale. Do not invent temperature values from ordinary RGB images. Any observations are tentative and must be reviewed by a qualified thermography technician. This is not a safety-critical diagnosis.
Inspection context: ${inspectionNotes || 'Routine FLIR radiometric thermography scan'}.
Identify:
1. Max temperature hot spot and ambient baseline temperature.
2. Defect classification (e.g. Bearing race friction, misalignment, loose electrical lug, insulation breakdown).
3. Severity rating (Normal, Advisory, Serious, Critical).
4. Direct technical assessment and immediate corrective action.

Return JSON format:
{
  "maxObservedTempC": number,
  "deltaT": number,
  "severityRating": "CRITICAL" | "SERIOUS" | "ADVISORY" | "NORMAL",
  "primaryAnomaly": "string",
  "identifiedHotspots": [
    { "zone": "string", "tempC": number, "status": "string" }
  ],
  "failureRisk": "string",
  "correctiveAction": "string"
}`,
    });

    const response = await ai.models.generateContent({
      model: 'gemini-3.8-flash',
      contents: { parts },
      config: {
        responseMimeType: 'application/json',
      },
    });

    res.json(JSON.parse(response.text || '{}'));
  } catch (error: unknown) {
    console.error('Thermal analysis error:', error instanceof Error ? error.message : error);
    return res.status(503).json({
      error: 'Image analysis failed. No calibrated temperatures or diagnosis are available.',
      code: 'AI_SERVICE_UNAVAILABLE',
    });
  }
});

// Production build vs Dev Vite mounting
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.join(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.join(__dirname, 'dist', 'index.html'));
    });
  } else {
    const { createServer } = await import('vite');
    const vite = await createServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`Daxoriq Server running on port ${PORT}`);
  });
}

startServer();
