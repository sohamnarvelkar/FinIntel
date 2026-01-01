
import { GoogleGenAI } from "@google/genai";
import { FinMode, ChatMessage } from "../types";
import { MODE_CONFIGS } from "../constants";

export async function askFinIntel(
  prompt: string,
  mode: FinMode,
  history: ChatMessage[] = []
): Promise<{ text: string; sources?: Array<{ title: string; uri: string }> }> {
  // Creating a new instance to ensure we always have the freshest context
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const config = MODE_CONFIGS[mode];

  const contents = [
    ...history.slice(-10).map(msg => ({ // Maintain deep but optimized context
      role: msg.role === 'user' ? 'user' as const : 'model' as const,
      parts: [{ text: msg.content }]
    })),
    {
      role: 'user' as const,
      parts: [{ text: prompt }]
    }
  ];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // Upgraded to Pro for maximum reasoning depth
      contents: contents,
      config: {
        systemInstruction: `${config.systemPrompt}\n\nCRITICAL DIRECTIVE: You are competing against the world's best financial analysts. Your answers must be significantly more insightful, accurate, and structured than ChatGPT or Perplexity. Use the Google Search tool for all market-related queries to ensure real-time accuracy. Use standard Markdown.`,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 4000 }, // Allocate significant tokens for internal reasoning
        temperature: 0.6, // Slightly lower for more factual consistency in finance
      },
    });

    const text = response.text || "Neural connection interrupted. Please re-initiate command.";
    
    const groundingChunks = response.candidates?.[0]?.groundingMetadata?.groundingChunks;
    const sources: Array<{ title: string; uri: string }> = [];
    
    if (groundingChunks) {
      groundingChunks.forEach((chunk: any) => {
        if (chunk.web && chunk.web.uri && chunk.web.title) {
          sources.push({ title: chunk.web.title, uri: chunk.web.uri });
        }
      });
    }

    return { text, sources: sources.length > 0 ? sources : undefined };
  } catch (error) {
    console.error("Gemini Intel Core Error:", error);
    throw new Error("System node failure. Verification of data models failed. Check network link.");
  }
}
