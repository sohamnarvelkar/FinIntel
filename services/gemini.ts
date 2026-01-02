
import { GoogleGenAI } from "@google/genai";
import { FinMode, ChatMessage, ExpertiseLevel, FinancialGoal } from "../types";
import { MODE_CONFIGS, EXPERTISE_MODIFIERS, GOAL_MODIFIERS } from "../constants";

export async function askFinIntel(
  prompt: string,
  mode: FinMode,
  expertise: ExpertiseLevel = ExpertiseLevel.INTERMEDIATE,
  goal: FinancialGoal = FinancialGoal.ACCUMULATION,
  history: ChatMessage[] = []
): Promise<{ text: string; sources?: Array<{ title: string; uri: string }> }> {
  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const config = MODE_CONFIGS[mode];
  const expertiseModifier = EXPERTISE_MODIFIERS[expertise];
  const goalModifier = GOAL_MODIFIERS[goal];

  const contents = [
    ...history.slice(-10).map(msg => ({ 
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
      model: "gemini-3-pro-preview",
      contents: contents,
      config: {
        systemInstruction: `${config.systemPrompt}\n\n${expertiseModifier}\n\n${goalModifier}\n\nCRITICAL DIRECTIVE: Use your domain-specific voice. Ensure all advice aligns with their Primary Goal. Accuracy is non-negotiable. Use Google Search for live data. Use Markdown.`,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 4000 },
        temperature: 0.6,
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw new Error("Intelligence stream interrupted.");
    }

    const text = response.text;
    if (!text) {
      throw new Error("Received empty intelligence packet.");
    }
    
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
  } catch (error: any) {
    console.error("Gemini Intel Core Error:", error);
    const errorMessage = error?.message || "";
    if (errorMessage.includes("429")) throw new Error("Strategic depth limit reached. Node cooldown in progress.");
    throw new Error(`SYSTEM_FAULT: ${errorMessage || "Connection lost. Re-establishing link..."}`);
  }
}
