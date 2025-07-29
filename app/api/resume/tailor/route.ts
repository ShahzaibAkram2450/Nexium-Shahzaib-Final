import { NextRequest, NextResponse } from "next/server";
import { GoogleGenAI } from "@google/genai";

export async function POST(request: NextRequest) {
  try {
    const { resumeContent, jobDescription } = await request.json();

    if (!resumeContent || !jobDescription) {
      return NextResponse.json(
        { error: "Missing required data" },
        { status: 400 }
      );
    }

    // Use the Gemini SDK to get a list of suggestions
    const ai = new GoogleGenAI({ apiKey: process.env.GEMINI_API_KEY });
    const prompt = `Resume: ${JSON.stringify(
      resumeContent
    )}\nJob Description: ${JSON.stringify(
      jobDescription
    )}\n\nGive me a list of 3 tailored resume improvement suggestions as an array of strings.`;
    let response, suggestions;
    try {
      response = await ai.models.generateContent({
        model: "gemini-2.5-flash",
        contents: prompt,
      });
      let text = response.text;
      if (!text) throw new Error("No text in Gemini response");
      // Remove markdown code block if present
      text = text.replace(/^```json\s*|```$/g, "").trim();
      suggestions = JSON.parse(text);
      if (!Array.isArray(suggestions))
        throw new Error("Gemini did not return an array");
    } catch (e) {
      console.error("Gemini SDK error or invalid response:", e, response);
      return NextResponse.json(
        { error: "Failed to get or parse suggestions from Gemini" },
        { status: 500 }
      );
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Resume tailoring error:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
