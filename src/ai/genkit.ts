
import {genkit} from 'genkit';
import {googleAI} from '@genkit-ai/googleai';

let initializedAI;

try {
  // Check for common environment variable names for the API key
  if (!process.env.GOOGLE_API_KEY && !process.env.GEMINI_API_KEY && !process.env.PALM_API_KEY) {
    console.warn(
      "AI PLUGIN WARNING: None of GOOGLE_API_KEY, GEMINI_API_KEY, or PALM_API_KEY are set in the environment. " +
      "The GoogleAI plugin for Genkit may not function correctly or at all without an API key. " +
      "Please ensure one of these environment variables is set with a valid API key."
    );
  }

  initializedAI = genkit({
    plugins: [googleAI()], // Removed model: 'googleai/gemini-2.0-flash'
  });

} catch (error) {
  console.error(
    "FATAL GENKIT ERROR: Failed to initialize Genkit or its plugins. " +
    "AI-powered features will not work. This is likely due to a configuration issue " +
    "such as a missing API key or problems with plugin setup. Please check server logs " +
    "and environment variable configurations.",
    error
  );
  // Do not re-throw the error. This allows the server to start even if AI features are disabled.
}

export const ai = initializedAI;
