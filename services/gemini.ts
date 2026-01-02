
import { GoogleGenAI } from "@google/genai";
import { FinMode, ChatMessage, ExpertiseLevel, FinancialGoal, Attachment, ErrorCategory } from "../types";
import { MODE_CONFIGS, EXPERTISE_MODIFIERS, GOAL_MODIFIERS } from "../constants";

export async function askFinIntel(
  prompt: string,
  mode: FinMode,
  expertise: ExpertiseLevel = ExpertiseLevel.INTERMEDIATE,
  goal: FinancialGoal = FinancialGoal.ACCUMULATION,
  history: ChatMessage[] = [],
  attachments: Attachment[] = []
): Promise<{ text: string; sources?: Array<{ title: string; uri: string }> }> {
  
  if (!process.env.API_KEY) {
    throw {
      category: ErrorCategory.AUTH,
      message: "Node authentication failed. Missing API credentials.",
      retryable: false
    };
  }

  if (!navigator.onLine) {
    throw {
      category: ErrorCategory.NETWORK,
      message: "External link severed. Please check your network connectivity.",
      retryable: true
    };
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
  const config = MODE_CONFIGS[mode];
  const expertiseModifier = EXPERTISE_MODIFIERS[expertise];
  const goalModifier = GOAL_MODIFIERS[goal];

  const historyParts = history.slice(-6).map(msg => ({ 
    role: msg.role === 'user' ? 'user' as const : 'model' as const,
    parts: [
      ...(msg.attachments || []).map(a => ({
        inlineData: { data: a.data.split(',')[1] || a.data, mimeType: a.mimeType }
      })),
      { text: msg.content }
    ]
  }));

  const currentParts: any[] = [
    ...attachments.map(a => ({
      inlineData: { data: a.data.split(',')[1] || a.data, mimeType: a.mimeType }
    })),
    { text: prompt }
  ];

  const contents = [
    ...historyParts,
    {
      role: 'user' as const,
      parts: currentParts
    }
  ];

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview",
      contents: contents,
      config: {
        systemInstruction: `${config.systemPrompt}\n\n${expertiseModifier}\n\n${goalModifier}\n\nCRITICAL DIRECTIVE: You have vision and document parsing capabilities. If an image is provided, treat it as a technical chart or financial statement. Analyze it with precision. Use your domain-specific voice. Ensure all advice aligns with their Primary Goal. Use Google Search for live data validation. Use Markdown.`,
        tools: [{ googleSearch: {} }],
        thinkingConfig: { thinkingBudget: 4000 },
        temperature: 0.4,
      },
    });

    if (!response.candidates || response.candidates.length === 0) {
      throw {
        category: ErrorCategory.SAFETY,
        message: "Intelligence stream blocked by internal safety protocol. Sensitive content detected.",
        retryable: false
      };
    }

    const text = response.text;
    if (!text) {
      throw {
        category: ErrorCategory.API,
        message: "Null packet received from intelligence node.",
        retryable: true
      };
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
    
    // Check if it's already an AppError
    if (error.category) throw error;

    const msg = error?.message || "";
    if (msg.includes("429")) {
      throw {
        category: ErrorCategory.API,
        message: "Strategic depth limit reached (Quota Exceeded). Node cooling down.",
        retryable: true
      };
    }

    if (msg.includes("safety") || msg.includes("blocked")) {
      throw {
        category: ErrorCategory.SAFETY,
        message: "Content flagged by security protocols. Adjustment required.",
        retryable: false
      };
    }

    throw {
      category: ErrorCategory.API,
      message: `Critical intelligence node fault: ${msg || "Unknown disconnection."}`,
      retryable: true
    };
  }
}
