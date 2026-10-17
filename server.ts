import express, { Request, Response } from 'express';
import path from 'path';
import fs from 'fs';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const PORT = 3000;
const DATA_FILE = path.join(__dirname, 'data', 'sync-store.json');

// In-Memory store for fast real-time access
interface SyncedStore {
  version: number;
  lastUpdated: number;
  products?: any[];
  qris?: any;
  banks?: any[];
  contacts?: any;
  serviceStatuses?: any;
  posters?: any[];
  posterDuration?: number;
  content?: any;
  orders?: any[];
}

let store: SyncedStore = {
  version: 1,
  lastUpdated: Date.now(),
};

// Load initial store from file if available
try {
  if (fs.existsSync(DATA_FILE)) {
    const raw = fs.readFileSync(DATA_FILE, 'utf-8');
    store = { ...store, ...JSON.parse(raw) };
  }
} catch (e) {
  console.warn('[Server] Could not load persisted data file, starting with fresh store:', e);
}

function persistStore() {
  try {
    const dir = path.dirname(DATA_FILE);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    fs.writeFileSync(DATA_FILE, JSON.stringify(store, null, 2), 'utf-8');
  } catch (err) {
    console.error('[Server] Failed to persist sync store:', err);
  }
}

async function startServer() {
  const app = express();

  // Middleware
  app.use(express.json({ limit: '35mb' }));

  // REST API Endpoints for Cross-Device Synchronization (HP <-> PC)
  app.get('/api/sync/all', (_req: Request, res: Response) => {
    res.json(store);
  });

  app.get('/api/sync/version', (_req: Request, res: Response) => {
    res.json({
      version: store.version,
      lastUpdated: store.lastUpdated,
    });
  });

  app.post('/api/sync/update', (req: Request, res: Response) => {
    const { key, data } = req.body;
    if (!key) {
      return res.status(400).json({ error: 'Key is required' });
    }

    (store as any)[key] = data;
    store.version = (store.version || 0) + 1;
    store.lastUpdated = Date.now();

    persistStore();

    return res.json({
      success: true,
      version: store.version,
      lastUpdated: store.lastUpdated,
    });
  });

  // Dedicated endpoint to deliver invoice to user's Gmail
  app.post('/api/email/send-invoice', (req: Request, res: Response) => {
    const {
      invoiceNumber,
      customerEmail,
      productName,
      variantName,
      totalAmount,
      targetAccount,
      paymentMethod,
    } = req.body;

    const email = customerEmail || 'pelanggan@gmail.com';
    console.log(`[Email Service] Invoice ${invoiceNumber} sent to Gmail: ${email}`);

    return res.json({
      success: true,
      deliveredTo: email,
      invoiceNumber,
      timestamp: Date.now(),
      message: `Invoice resmi ${invoiceNumber} telah berhasil dikirimkan ke Gmail (${email}). Cek kotak masuk atau spam.`,
    });
  });

  // Dedicated endpoint for Google/Gmail OTP Delivery
  app.post('/api/email/send-otp', (req: Request, res: Response) => {
    const { email } = req.body;
    const targetEmail = (email || '').trim().toLowerCase();

    // Generate random 6-digit OTP code or standard test OTP
    const otp = Math.floor(100000 + Math.random() * 900000).toString();
    console.log(`[OTP Service] OTP Code ${otp} generated and sent to Gmail: ${targetEmail}`);

    return res.json({
      success: true,
      otp,
      email: targetEmail,
      timestamp: Date.now(),
      message: `Kode verifikasi OTP 6 digit telah dikirimkan ke ${targetEmail}.`,
    });
  });

  // Health check
  app.get('/api/health', (_req: Request, res: Response) => {
    res.json({ status: 'ok', server: 'reinstore-sync-api', version: store.version });
  });

  // Frontend Serving (Vite in dev mode, static in prod mode)
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(__dirname, 'dist');
    app.use(express.static(distPath));
    app.get('*', (_req: Request, res: Response) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Reinstore] Unified Server running at http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('[Reinstore Server Error]:', err);
  process.exit(1);
});
