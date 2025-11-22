import { GoogleGenAI, Type, Schema } from "@google/genai";
import { CharacterData } from "../types";

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
  // 获取 API Key，如果在浏览器环境中未定义，给出一个友好的错误提示
  const apiKey = process.env.API_KEY;
  
  if (!apiKey) {
    console.error("API Key is missing");
    throw new Error("API_KEY 未配置。请在 Vercel 项目设置中添加环境变量 API_KEY。");
  }

  // 关键修复：在函数内部初始化客户端，防止应用在加载时因缺少 Key 而直接崩溃
  const ai = new GoogleGenAI({ apiKey });

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

    const text = response.text;
    if (!text) {
      throw new Error("Gemini 未返回数据");
    }

    // 增强鲁棒性：寻找 JSON 对象的开始和结束位置
    // 这可以防止模型返回 Markdown 代码块标记（如 ```json ... ```）导致解析失败
    const startIndex = text.indexOf('{');
    const endIndex = text.lastIndexOf('}');

    if (startIndex === -1 || endIndex === -1) {
      throw new Error("Gemini 返回的 JSON 格式无效");
    }

    const jsonStr = text.substring(startIndex, endIndex + 1);
    const data = JSON.parse(jsonStr) as CharacterData;
    return data;
  } catch (error) {
    console.error("Gemini API Error:", error);
    throw error;
  }
};