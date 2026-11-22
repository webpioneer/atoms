// Runs the on-device language model off the main thread (WebLLM, Apache-2.0).
import { WebWorkerMLCEngineHandler } from './vendor/web-llm.js';
const handler = new WebWorkerMLCEngineHandler();
self.onmessage = msg => handler.onmessage(msg);
