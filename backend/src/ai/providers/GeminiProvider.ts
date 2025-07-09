import { GoogleGenAI } from "@google/genai";
import { IAIProvider } from "../interfaces/IAIProvider";

export class GeminiProvider implements IAIProvider {
  private ai: GoogleGenAI;

  constructor(apiKey: string) {
    this.ai = new GoogleGenAI({ apiKey });
  }

  async generateCompletion(prompt: string): Promise<string> {
    try {
      const response = await this.ai.models.generateContent({
        model: "gemini-2.0-flash",
        contents: prompt,
      });

      if (!response || !response.text) {
        throw new Error("No response text received from Gemini API");
      }
      return response.text;
    } catch (error) {
      throw new Error(`Gemini API error: ${error}`);
    }
  }

  isAvailable(): boolean {
    return !!this.ai;
  }
}
