import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CharacterData } from "../types";

const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

const characterSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    character: { type: Type.STRING, description: "The Chinese character being analyzed" },
    pinyin: { type: Type.STRING, description: "Pinyin pronunciation with tone marks" },
    definition: { type: Type.STRING, description: "English definition of the character" },
    radical: { type: Type.STRING, description: "The radical (部首) of the character" },
    strokeCount: { type: Type.NUMBER, description: "Total number of strokes" },
    etymology: { type: Type.STRING, description: "A brief explanation of the character's origin or etymology (approx 1-2 sentences)" },
    examples: {
      type: Type.ARRAY,
      items: {
        type: Type.OBJECT,
        properties: {
          chinese: { type: Type.STRING },
          pinyin: { type: Type.STRING },
          meaning: { type: Type.STRING },
        },
        required: ["chinese", "pinyin", "meaning"],
      },
      description: "Two common example sentences or phrases using this character",
    },
  },
  required: ["character", "pinyin", "definition", "radical", "strokeCount", "etymology", "examples"],
};

export const fetchCharacterData = async (char: string): Promise<CharacterData> => {
  try {
    const response = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: `Analyze the Chinese character: ${char}. Provide a detailed breakdown suitable for a student learning Chinese.`,
      config: {
        responseMimeType: "application/json",
        responseSchema: characterSchema,
        systemInstruction: "You are Tim, a helpful Chinese language tutor. Provide accurate linguistic data.",
      },
    });

    if (!response.text) {
      throw new Error("No data returned from Gemini");
    }

    const data = JSON.parse(response.text) as CharacterData;
    return data;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};