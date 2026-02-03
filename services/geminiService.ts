import { GoogleGenAI, Type, Schema } from "@google/genai";
import { ProjectManifest, INITIAL_DESIGN_SYSTEM } from "../types";

// We define a partial schema for structure validation, but rely on the prompt for deep nesting to avoid token limits
const manifestSchema: Schema = {
  type: Type.OBJECT,
  properties: {
    specVersion: { type: Type.STRING },
    auditStatus: { type: Type.STRING },
    branding: { type: Type.STRING },
    comment: { type: Type.STRING },
    project: {
      type: Type.OBJECT,
      properties: {
        id: { type: Type.STRING },
        name: { type: Type.STRING },
        tagline: { type: Type.STRING },
        description: { type: Type.STRING },
        version: { type: Type.STRING },
        domain: { type: Type.STRING },
      },
      required: ["name", "description"]
    },
    // We keep specific schemas for the visual part to ensure the preview works
    designSystem: {
      type: Type.OBJECT,
      properties: {
        theme: { type: Type.STRING },
        description: { type: Type.STRING },
        colors: {
           type: Type.OBJECT,
           properties: {
             light: { type: Type.OBJECT, properties: { primary: { type: Type.STRING }, background: { type: Type.STRING }, text: { type: Type.STRING } } },
             dark: { type: Type.OBJECT, properties: { primary: { type: Type.STRING }, background: { type: Type.STRING }, text: { type: Type.STRING } } }
           }
        },
        typography: { type: Type.OBJECT, properties: { fontFamily: { type: Type.STRING } } },
        // ... (We trust the model to fill the rest based on the one-shot example)
      }
    },
    tech: { type: Type.OBJECT },
    seo: { type: Type.OBJECT },
    growth: { type: Type.OBJECT },
    landing: { type: Type.OBJECT },
    auth: { type: Type.OBJECT },
    app: { type: Type.OBJECT },
  },
  required: ["specVersion", "project", "designSystem", "landing"]
};

export const generateProjectManifest = async (prompt: string, referenceImageBase64?: string): Promise<ProjectManifest> => {
  if (!process.env.API_KEY) {
    throw new Error("API Key is missing");
  }

  const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

  try {
    const contents: any[] = [];
    
    // Add reference image if available
    if (referenceImageBase64) {
      const cleanBase64 = referenceImageBase64.split(',')[1] || referenceImageBase64;
      contents.push({
        inlineData: {
          mimeType: "image/png",
          data: cleanBase64
        }
      });
      contents.push({
        text: `Analyze this image as the visual foundation (Assimilation Mode). Extract style, mood, and structural inspiration.`
      });
    }

    const systemPrompt = `
      You are the 'Fractal Engine', an elite AI Software Architect and Product Genius.
      Your goal is to generate a comprehensive "Project Manifest" (JSON) for a new software project based on the user's idea.
      
      You must replicate the exact structure and depth of the following JSON format (The "Singularity Edition" format):
      
      {
        "specVersion": "7.0",
        "edition": "Singularity",
        "branding": "Powered by Google Gemini",
        "project": { "name": "...", "tagline": "...", "description": "..." },
        "tech": { "stackPreset": "...", "persistence": { ... }, "quality": { ... } },
        "seo": { "enabled": true, "indexing": { ... }, "social": { ... } },
        "growth": { "viralLoop": { ... }, "onboarding": { ... } },
        "designSystem": { 
           "theme": "light",
           "colors": { "light": { ...all 13 tokens... }, "dark": { ...all 13 tokens... } },
           "components": { "buttons": {...}, "cards": {...}, "inputs": {...}, "badges": {...} },
           ... 
        },
        "landing": { "structure": [...], "sections": { "hero": {...}, "features": {...}, ... } },
        "auth": { ... },
        "app": { "dashboard": { "modules": [...] } }
      }

      CRITICAL INSTRUCTIONS:
      1. **Creativity**: Be bold. If the user says "Yoga App", invent a unique hook (e.g., "AI-corrected posture via webcam").
      2. **Completeness**: Do not leave empty objects. Fill the 'tech', 'growth', and 'landing' sections with realistic, high-level strategies.
      3. **Design System**: Ensure the 'designSystem' object is fully populated so it can be rendered visually.
      4. **Tone**: The JSON content should feel professional, scalable (SaaS/Enterprise grade), and ready for production.

      User Input: "${prompt}"
      
      Output ONLY valid JSON.
    `;

    contents.push({ text: systemPrompt });

    // 1. Generate the JSON Manifest
    const response = await ai.models.generateContent({
      model: "gemini-3-pro-preview", // upgraded model for better reasoning on huge JSON
      contents: contents,
      config: {
        responseMimeType: "application/json",
        // We use a looser schema validation here to allow the model to fully expand the creative sections
      },
    });

    if (!response.text) throw new Error("No response from AI");

    const manifest = JSON.parse(response.text) as ProjectManifest;

    // 2. Generate UI Image Visualization (optional but nice)
    try {
      const imagePrompt = `UI Mockup for ${manifest.project.name}. ${manifest.project.tagline}. 
      Style: ${manifest.designSystem.theme}, Primary Color: ${manifest.designSystem.colors.light.primary}.
      High fidelity, Dribbble style.`;

      const imageResponse = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ text: imagePrompt }] },
        config: { imageConfig: { aspectRatio: "16:9" } }
      });

      if (imageResponse.candidates?.[0]?.content?.parts) {
        for (const part of imageResponse.candidates[0].content.parts) {
          if (part.inlineData && part.inlineData.mimeType.startsWith('image/')) {
            manifest.designSystem.uiImage = `data:${part.inlineData.mimeType};base64,${part.inlineData.data}`;
            break;
          }
        }
      }
    } catch (e) {
      console.warn("Image gen failed", e);
    }

    return manifest;

  } catch (error) {
    console.error("Fractal Engine Error:", error);
    throw error;
  }
};
