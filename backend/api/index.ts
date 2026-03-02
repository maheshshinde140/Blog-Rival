import 'reflect-metadata';
import express from 'express';
import { ExpressAdapter } from '@nestjs/platform-express';
import { createApp } from '../src/main';

const server = express();
let isInitialized = false;
let initPromise: Promise<void> | null = null;

async function ensureApp() {
  if (isInitialized) return;
  if (!initPromise) {
    initPromise = (async () => {
      const app = await createApp(new ExpressAdapter(server));
      await app.init();
      isInitialized = true;
    })();
  }
  await initPromise;
}

export default async function handler(req: any, res: any) {
  await ensureApp();
  return server(req, res);
}
