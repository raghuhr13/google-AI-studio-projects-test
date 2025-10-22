import { GoogleGenAI } from "@google/genai";
import type { DriveFile } from '../types';

// 🔴 CONFIGURATION: Replace with your actual Google AI Studio API key
const API_KEY = 'YOUR_API_KEY_HERE';

if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
  console.warn("Gemini API key is not configured. Please set it in services/geminiService.ts");
}

const ai = new GoogleGenAI({ apiKey: API_KEY });

export async function summarizeFileList(files: DriveFile[], query: string): Promise<string> {
  if (!API_KEY || API_KEY === 'YOUR_API_KEY_HERE') {
    return Promise.reject(new Error("Gemini API key is not configured. Please add your key to services/geminiService.ts."));
  }

  if (files.length === 0) {
    return "No documents were found matching your query.";
  }
  
  try {
    const fileNames = files.map(f => `- ${f.name}`).join('\n');
    const prompt = `I have searched a user's Google Drive for the query "${query}" and found the following files:\n\n${fileNames}\n\nBased on these file names, please provide a short, one-paragraph summary of what the user is likely to find.`;

    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });
    
    return response.text;

  } catch (error) {
    console.error("Error calling Gemini API:", error);
    if (error instanceof Error) {
        return Promise.reject(new Error(`Failed to generate summary: ${error.message}`));
    }
    return Promise.reject(new Error("An unknown error occurred while generating the summary."));
  }
}
