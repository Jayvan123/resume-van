/**
 * Shared between the AI Assist frontend tab and the api/ai-assist backend
 * function, so the client-side character cap and the server-side guard can't
 * drift apart. NOTE: api/ai-assist.ts imports this via a relative path
 * (../src/constants/aiAssist), not the `@/` alias — that alias only resolves
 * inside the Vite-bundled app, not the standalone serverless function.
 */
export const MAX_CHARS = 4000;
