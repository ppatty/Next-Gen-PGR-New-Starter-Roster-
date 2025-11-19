import { GoogleGenAI, Type } from "@google/genai";
import { RosterGenerationParams, ScheduleItem } from "../types";

// Initialize the client
// NOTE: API_KEY is expected to be in the environment variables.
const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });

export const generateRosterWithAI = async (
  params: RosterGenerationParams
): Promise<ScheduleItem[]> => {
  const { starters, mentors, modules, startDate } = params;

  if (starters.length === 0 || mentors.length === 0 || modules.length === 0) {
    throw new Error("Cannot generate roster: Missing starters, mentors, or modules.");
  }

  const model = "gemini-2.5-flash";

  const prompt = `
    You are an expert training coordinator and scheduler.
    
    Task: Create a training roster for new starters.
    Start Date: ${startDate} (Assume a standard work week Mon-Fri).
    
    Work Hours: 09:00 - 17:00.
    Lunch Break: Ensure everyone has a break between 12:00 and 14:00.
    
    Constraints:
    1. Each STARTER must complete EVERY MODULE.
    2. Assign a MENTOR to each session.
    3. Expertise Matching: If a module requires specific expertise, you MUST assign a mentor with that exact expertise.
    4. Conflict Resolution: 
       - A Mentor cannot teach two sessions at the same time.
       - A Starter cannot attend two sessions at the same time.
    5. Optimization: Group sessions logically to avoid 1-hour gaps if possible.
    6. Output: Return a clean JSON array of scheduled sessions.

    Data:
    Starters: ${JSON.stringify(starters)}
    Mentors: ${JSON.stringify(mentors)}
    Modules: ${JSON.stringify(modules)}
  `;

  try {
    const response = await ai.models.generateContent({
      model: model,
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: {
          type: Type.ARRAY,
          items: {
            type: Type.OBJECT,
            properties: {
              day: { type: Type.STRING, description: "Day of the week (e.g., Monday)" },
              time: { type: Type.STRING, description: "Time slot (e.g., 09:00 - 10:00)" },
              starterName: { type: Type.STRING },
              mentorName: { type: Type.STRING },
              moduleName: { type: Type.STRING },
              location: { type: Type.STRING, description: "Suggested location (e.g., Room A, Online, Lab 1)" }
            },
            required: ["day", "time", "starterName", "mentorName", "moduleName"]
          }
        },
        // Using thinking config to ensure better conflict resolution
        thinkingConfig: {
          thinkingBudget: 1024, // Allocate tokens for reasoning about schedule conflicts
        },
        maxOutputTokens: 8192, // Required when using thinkingConfig
      }
    });

    const text = response.text;
    if (!text) {
      throw new Error("No response from AI");
    }

    const rawData = JSON.parse(text);
    
    // Add IDs to the generated items for React keys
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const schedule: ScheduleItem[] = rawData.map((item: any, index: number) => ({
      ...item,
      id: `sched-${Date.now()}-${index}`,
    }));

    return schedule;

  } catch (error) {
    console.error("Error generating roster:", error);
    throw error;
  }
};