import { HfInference } from "@huggingface/inference";
import dotenv from "dotenv";

dotenv.config();

const hf = new HfInference(process.env.HF_TOKEN);

/**
 * visionAnalysis
 * Sends an image buffer to LLaVA for description.
 */
export async function visionAnalysis(imageBuffer, prompt = "Describe this screen and identify any interactable UI elements like buttons or input fields. Be specific about their location.") {
  try {
    const result = await hf.imageToText({
      data: imageBuffer,
      model: "llava-hf/llava-1.5-7b-hf",
      parameters: {
        // LLaVA expects a specific prompt format often: USER: <image>\nPrompt\nASSISTANT:
        prompt: `USER: <image>\n${prompt}\nASSISTANT:`,
      },
    });
    return result.generated_text;
  } catch (error) {
    console.error("HF Vision Error:", error);
    throw error;
  }
}

/**
 * generateReasoning
 * Uses a text LLM to decide on next steps based on user voice and screen description.
 */
export async function generateReasoning(userVoice, screenDescription) {
  try {
    const prompt = `
      Context: User is using an AI voice assistant for screen guidance.
      Screen State: ${screenDescription}
      User Command: "${userVoice}"
      
      Task: Provide a concise, helpful, and beginner-friendly response. 
      If the user asked to do something, explain the step-by-step process based on what's on screen.
      Keep it brief as it will be spoken via Text-to-Speech.
    `;

    const result = await hf.textGeneration({
      model: "meta-llama/Llama-3-8B-Instruct",
      inputs: prompt,
      parameters: {
        max_new_tokens: 150,
        return_full_text: false,
      },
    });

    return result.generated_text.trim();
  } catch (error) {
    console.error("HF Reasoning Error:", error);
    throw error;
  }
}
