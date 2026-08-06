import express from "express";
import { createServer as createViteServer } from "vite";
import path from "path";
import OpenAI from "openai";
import dotenv from "dotenv";
import { GoogleGenerativeAI } from "@google/generative-ai";
// @ts-ignore
import { Client as NimbaClient } from 'nimbasms';
import admin from 'firebase-admin';
import { getFirestore } from 'firebase-admin/firestore';
import rateLimit from 'express-rate-limit';
import { createProxyMiddleware } from 'http-proxy-middleware';
import fs from 'fs';

dotenv.config();

// Use readFileSync for firebase config to ensure compatibility
const firebaseConfigPath = path.join(process.cwd(), 'firebase-applet-config.json');
const firebaseConfig = JSON.parse(fs.readFileSync(firebaseConfigPath, 'utf8'));

// Global error handlers
process.on('unhandledRejection', (reason, promise) => {
  console.error('CRITICAL: Unhandled Rejection at:', promise, 'reason:', reason);
});

process.on('uncaughtException', (error) => {
  console.error('CRITICAL: Uncaught Exception:', error);
});

// Initialize Firebase Admin safely
if (admin.apps.length === 0) {
  try {
    // Initialisation la plus robuste pour AI Studio
    admin.initializeApp();
    console.log("Firebase Admin initialized with default credentials");
  } catch (e) {
    console.warn("Firebase default initialization failed, using explicit projectId:", e);
    admin.initializeApp({
      projectId: firebaseConfig.projectId,
    });
  }
}

// Initialisation précise de Firestore Admin avec support du databaseId
let db: admin.firestore.Firestore;
try {
  const dbId = firebaseConfig.firestoreDatabaseId;
  // @ts-ignore
  db = getFirestore(admin.app(), (dbId && dbId !== "(default)") ? dbId : undefined);
  console.log(`Firestore linked successfully to database: ${dbId || "(default)"}`);
} catch (error) {
  console.error("Firestore initialization error, using admin.firestore() fallback:", error);
  db = admin.firestore();
}
const dbAdmin = db;

const app = express();
const PORT = 3000;

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", timestamp: new Date().toISOString() });
});

// Proxy definition for Django Backend (New v2.0)
const DJANGO_BACKEND_URL = process.env.DJANGO_BACKEND_URL || 'https://backfinal-xxxl.onrender.com';

app.use('/api/django', createProxyMiddleware({
  target: DJANGO_BACKEND_URL,
  changeOrigin: true,
  pathRewrite: {
    '^/api/django': '/api/v1',
  },
  on: {
    error: (err, req, res) => {
      console.warn('Django backend proxy error:', err.message);
      (res as any).status(502).json({ error: 'Django backend is currently unavailable' });
    }
  }
}));

// Proxy to legacy Flask Backend
app.use('/api/v2', createProxyMiddleware({
  target: 'https://kharandi-backend.onrender.com',
  changeOrigin: true,
  pathRewrite: {
    '^/api/v2': '/api',
  },
  on: {
    error: (err, req, res) => {
      console.warn('Flask backend proxy error:', err.message);
      (res as any).status(502).json({ error: 'Flask backend is currently unavailable' });
    }
  }
}));

// Trust proxy for express-rate-limit
app.set('trust proxy', 1);

app.use(express.json({ limit: '100mb' }));
app.use(express.urlencoded({ limit: '100mb', extended: true }));

// Rate limiter
const limiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // limit each IP to 100 requests per windowMs
  message: { error: "Trop de requêtes, veuillez réessayer plus tard." },
  standardHeaders: true,
  legacyHeaders: false,
});

app.use('/api/', limiter);

// Auth middleware (Keep Firebase for now as identity provider)
const authenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return res.status(401).json({ error: "Unauthorized" });
  }
  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    (req as any).user = decodedToken;
    next();
  } catch (error) {
    console.error("Auth error:", error);
    res.status(401).json({ error: "Unauthorized" });
  }
};

const optionalAuthenticate = async (req: express.Request, res: express.Response, next: express.NextFunction) => {
  const authHeader = req.headers.authorization;
  if (!authHeader || !authHeader.startsWith('Bearer ')) {
    return next();
  }
  const token = authHeader.split('Bearer ')[1];
  try {
    const decodedToken = await admin.auth().verifyIdToken(token);
    (req as any).user = decodedToken;
  } catch (error) {
    console.warn("Optional auth fail:", error instanceof Error ? error.message : "Unknown error");
  }
  next();
};

// Initialize Nimba SMS client
const nimbaConfig = {
  SERVICE_ID: process.env.NIMBA_SERVICE_ID || '',
  SECRET_TOKEN: process.env.NIMBA_SECRET_TOKEN || '',
};

const nimbaClient = nimbaConfig.SERVICE_ID && nimbaConfig.SECRET_TOKEN 
  ? new NimbaClient(nimbaConfig) 
  : null;

// Initialize Gemini
const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY || '');

// Initialize OpenAI client for DeepSeek (used in other routes)
const deepseekClient = new OpenAI({
  baseURL: 'https://api.deepseek.com',
  apiKey: process.env.DEEPSEEK_API_KEY || ''
});

import { loadAllExamResults, searchExamResults } from "./src/api/allExamResults.js";

// Load all national exam results (CEE, BEPC EG, BEPC FA, BAC) in background
loadAllExamResults().catch(console.error);

// Unified search endpoint for all national exams 2026
app.get("/api/results/search", async (req, res) => {
  try {
    const query = req.query.q?.toString().trim() || '';
    const exam = req.query.exam?.toString().trim() || 'all'; // 'all', 'cee', 'bepc', 'bepc_fa', 'bac'
    const filter = req.query.filter?.toString() || 'all'; // 'all', 'pv', 'centre', 'noms'
    const limit = parseInt(req.query.limit?.toString() || '50');

    const matched = await searchExamResults(query, exam, filter, limit);
    res.json(matched);
  } catch (error) {
    console.error("Exam search error:", error);
    res.status(500).json({ error: "Erreur lors de la recherche des résultats", details: error instanceof Error ? error.message : String(error) });
  }
});

// Backward compatible CEE endpoint
app.get("/api/results/cee2026", async (req, res) => {
  try {
    const query = req.query.q?.toString().trim() || '';
    const filter = req.query.filter?.toString() || 'all';
    const limit = parseInt(req.query.limit?.toString() || '50');

    const matched = await searchExamResults(query, 'cee', filter, limit);
    res.json(matched);
  } catch (error) {
    console.error("CEE search error:", error);
    res.status(500).json({ error: "Erreur lors de la recherche des résultats", details: error instanceof Error ? error.message : String(error) });
  }
});

// --- BUD-E 1.0 BRIDGE (Connection with Django) ---

app.post("/api/chat", optionalAuthenticate, async (req, res) => {
  try {
    const { messages } = req.body;
    if (!messages || !Array.isArray(messages) || messages.length === 0) {
      return res.status(400).json({ error: "Messages array is required and cannot be empty" });
    }

    const lastMessage = messages[messages.length - 1].content;

    // We delegate the AI work to the Django BUD-E 1.0 Framework
    try {
      const controller = new AbortController();
      const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout for Django (increased for Render)

      const headers: Record<string, string> = {
        'Content-Type': 'application/json',
      };
      if (req.headers.authorization) {
        headers['Authorization'] = req.headers.authorization;
      }

      const djangoRes = await fetch(`${DJANGO_BACKEND_URL}/api/ai/ask/`, {
        method: 'POST',
        headers,
        body: JSON.stringify({
          question: lastMessage,
          history: messages.slice(0, -1)
        }),
        signal: controller.signal
      });

      clearTimeout(timeoutId);

      if (djangoRes.ok) {
        const data = await djangoRes.json();
        return res.json({ reply: data.answer || data.reply || data.content });
      } else {
        console.warn("Django AI failed (Status:", djangoRes.status, "), falling back to Node internal AI");
        console.log("Triggering Local Google AI fallback...");
      }
    } catch (err) {
      console.error("Failed to connect to Django BUD-E or timeout:", err);
      console.log("Triggering Local Google AI fallback due to error...");
    }

    // --- FALLBACK TO LOCAL NODE AI (GEMINI) ---
    const systemPrompt = `Tu es Karamö, professeur virtuel expert du programme guinéen. 
DIRECTIVES ESSENTIELLES :
- CONCISION ABSOLUE : Réponds de manière brève. Pas de blabla inutile.
- PÉDAGOGIE : Guide par des indices, ne donne pas la réponse immédiatement.
- FORMAT : Markdown simple uniquement. Pas de LaTeX.
- ÉCO : Économise les tokens. Va droit au but.`;

    // Token management: Keep only the essential history (last 6 messages / 3 rounds)
    const MAX_HISTORY = 6;
    const historicalMessages = messages.length > MAX_HISTORY 
      ? messages.slice(-MAX_HISTORY) 
      : messages;

    const modelInstance = genAI.getGenerativeModel({ 
      model: "gemini-1.5-flash",
      systemInstruction: systemPrompt 
    });
    
    const result = await modelInstance.generateContent({
      contents: historicalMessages.map((m: any) => ({
        role: m.role === 'user' ? 'user' : 'model',
        parts: [{ text: m.content }]
      })),
      generationConfig: {
        temperature: 0.7, 
        maxOutputTokens: 800
      }
    });

    const reply = result.response.text();
    return res.json({ reply });
  } catch (error) {
    console.error("Chat API error:", error);
    res.status(500).json({ error: "Internal server error" });
  }
});

// --- GOOGLE GENAI QCM GENERATION ---
app.post("/api/generate-qcm", optionalAuthenticate, async (req, res) => {
  try {
    const { exercise } = req.body;
    const { level, topic, difficulty = "MOYEN" } = exercise;

    const prompt = `Génère un QCM éducatif pour un élève de ${level} sur le sujet : "${topic}".
Difficulté: ${difficulty}. 
Format JSON STRICT :
[
  {
    "question": "Texte de la question",
    "options": ["Choix A", "Choix B", "Choix C", "Choix D"],
    "correctIndex": 0,
    "explanation": "Brève explication"
  }
]
Génère EXACTEMENT 5 questions. Soyez bref et précis pour économiser les tokens.`;

    const modelInstance = genAI.getGenerativeModel({ model: "gemini-1.5-flash" });
    const result = await modelInstance.generateContent({
      contents: [{ role: "user", parts: [{ text: prompt }] }],
      generationConfig: { 
        responseMimeType: "application/json",
        maxOutputTokens: 1500 
      }
    });

    const questions = JSON.parse(result.response.text() || '[]');
    res.json(questions);
  } catch (error: any) {
    console.error("QCM Generation Error:", error);
    res.status(500).json({ error: "Impossible de générer l'exercice." });
  }
});

// Nimba SMS route
app.post("/api/sms/send", authenticate, async (req, res) => {
  try {
    const { to, message } = req.body;

    if (!to || !message) {
      return res.status(400).json({ error: "Recipient (to) and message are required" });
    }

    if (nimbaClient) {
      try {
        const body = {
          to: Array.isArray(to) ? to : [to],
          message: message,
          sender_name: "Kharandi"
        };
        
        const result = await nimbaClient.messages.create(body);
        return res.json({ success: true, data: result });
      } catch (nimbaError: any) {
        console.error("Nimba SMS client error:", nimbaError);
        return res.status(500).json({ error: nimbaError.message || "Failed to send SMS via client" });
      }
    }

    // Fallback to fetch if client is not configured
    const authToken = process.env.NIMBA_AUTH_TOKEN;
    if (!authToken) {
      return res.status(500).json({ error: "Nimba SMS configuration missing (Client or Auth Token)" });
    }

    const response = await fetch("https://api.nimbasms.com/v1/messages", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "Authorization": authToken.startsWith('Basic ') ? authToken : `Basic ${authToken}`
      },
      body: JSON.stringify({
        to: Array.isArray(to) ? to : [to],
        sender: "Kharandi",
        message: message
      })
    });

    let data: any = {};
    const text = await response.text();
    try {
      data = text ? JSON.parse(text) : {};
    } catch (e) {
      data = { message: text };
    }

    if (!response.ok) {
      console.error("Nimba SMS fetch error:", data);
      return res.status(response.status).json({ error: data.message || "Failed to send SMS via fetch" });
    }

    res.json({ success: true, data });
  } catch (error) {
    console.error("SMS sending error:", error);
    res.status(500).json({ error: "Internal server error while sending SMS" });
  }
});

// OTP Routes - Trust Flask for verification
app.post('/api/auth/send-otp', async (req, res) => {
  try {
    const { phone } = req.body;

    // Déléguer à Flask
    const flaskRes = await fetch(
      'https://kharandi-backend.onrender.com/api/otp/send',
      {
        method:  'POST',
        headers: { 'Content-Type': 'application/json' },
        body:    JSON.stringify({ phone })
      }
    );

    const data = await flaskRes.json();
    return res.status(flaskRes.status).json(data);

  } catch (err: any) {
    return res.status(500).json({ error: err.message });
  }
});

app.post('/api/auth/verify-otp', async (req, res) => {
  try {
    const { phone, name, email, role } = req.body;

    // Le code a DÉJÀ été vérifié par Flask à l'étape A
    // Si on arrive ici, c'est que Flask a dit OK → on fait confiance

    if (!phone) {
      return res.status(400).json({ error: "Numéro de téléphone manquant" });
    }

    // Normaliser le numéro pour Firebase UID
    let normalizedPhone = phone.trim().replace(/\s|-/g, "");
    if (!normalizedPhone.startsWith("+")) {
      normalizedPhone = "+" + (normalizedPhone.startsWith("224")
        ? normalizedPhone
        : "224" + normalizedPhone);
    }

    // Vérifier si l'utilisateur existe déjà dans Firebase Auth
    let uid: string;
    try {
      const existingUser = await admin.auth().getUserByPhoneNumber(normalizedPhone);
      uid = existingUser.uid;
    } catch {
      // Utilisateur nouveau → on le crée
      const newUser = await admin.auth().createUser({
        phoneNumber:  normalizedPhone,
        displayName:  name  || "",
        email:        email || undefined,
      });
      uid = newUser.uid;

      // Créer son profil dans Firestore
      // On garde les noms de champs existants (camelCase) pour la compatibilité frontend
      await db.collection("users").doc(uid).set({
        uid:        uid,
        phone:      normalizedPhone,
        name:       name  || "Utilisateur",
        email:      email || "",
        role:       role  || "student",
        points:     0,
        onboardingCompleted: false,
        isApproved: true,
        createdAt:  new Date().toISOString(),
        lastActive: new Date().toISOString(),
      });
    }

    // Mettre à jour la date de dernière connexion
    await db.collection("users").doc(uid).update({
      lastActive: new Date().toISOString(),
    });

    // Générer le Custom Token Firebase
    const token = await admin.auth().createCustomToken(uid);

    // ✅ Toujours retourner un JSON valide
    return res.status(200).json({ success: true, token, uid });

  } catch (err: any) {
    console.error("Erreur verify-otp Node:", err);
    // ✅ Même en cas d'erreur, toujours retourner un JSON
    return res.status(500).json({ error: err.message || "Erreur interne" });
  }
});

// --- SUBSCRIPTIONS & PAYMENTS ---

app.get("/api/subscriptions/status", authenticate, async (req, res) => {
  try {
    const user = (req as any).user;
    const userDoc = await db.collection("users").doc(user.uid).get();

    if (!userDoc.exists) {
      return res.status(404).json({ error: "User not found" });
    }

    const data = userDoc.data();
    if (!data) return res.status(404).json({ error: "No data found" });

    const now = new Date();
    const expiresAt = data.subscription_expires_at ? new Date(data.subscription_expires_at) : null;
    const is_premium = !!(expiresAt && expiresAt > now && data.subscription_plan && data.subscription_plan !== 'free');

    res.json({
      subscription_plan: data.subscription_plan || 'free',
      subscription_expires_at: data.subscription_expires_at || null,
      is_premium: is_premium
    });

  } catch (error) {
    console.error("Get subscription status error:", error);
    res.status(500).json({ error: "Erreur interne" });
  }
});

async function startServer() {
  // Vite middleware for development
  if (process.env.NODE_ENV !== "production") {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    const distPath = path.join(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      // Avoid serving index.html for missing static assets
      if (req.path.includes('.') && !req.path.endsWith('.html')) {
        return res.status(404).end();
      }
      res.sendFile(path.join(distPath, 'index.html'));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server running on http://localhost:${PORT}`);
  });
}

startServer().catch(err => {
  console.error("Failed to start server:", err);
  process.exit(1);
});

export default app;
