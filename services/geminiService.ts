
import { GoogleGenAI } from "@google/genai";

const API_KEY = process.env.API_KEY || "";

export const getApsetUpdates = async () => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: "Provide the latest updates for APSET (Andhra Pradesh State Eligibility Test) 2024 and 2025, including exam dates, application status, and official notifications. Keep it concise.",
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.filter(chunk => chunk.web)
    ?.map(chunk => ({
      title: chunk.web?.title || "Reference",
      url: chunk.web?.uri || "#"
    })) || [];

  return {
    text: response.text,
    links
  };
};

export const askApsetQuestion = async (query: string) => {
  const ai = new GoogleGenAI({ apiKey: API_KEY });
  const response = await ai.models.generateContent({
    model: "gemini-3-flash-preview",
    contents: `The user is asking about APSET (Andhra Pradesh State Eligibility Test). Question: ${query}. Provide an accurate, helpful response using search grounding if necessary.`,
    config: {
      tools: [{ googleSearch: {} }],
    },
  });

  const links = response.candidates?.[0]?.groundingMetadata?.groundingChunks
    ?.filter(chunk => chunk.web)
    ?.map(chunk => ({
      title: chunk.web?.title || "Source",
      url: chunk.web?.uri || "#"
    })) || [];

  return {
    text: response.text,
    links
  };
};
