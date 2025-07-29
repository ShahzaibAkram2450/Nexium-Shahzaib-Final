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

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return NextResponse.json(
        { error: "Missing Gemini API key" },
        { status: 500 }
      );
    }

    const ai = new GoogleGenAI({ apiKey });

    const prompt = `
Resume: ${JSON.stringify(resumeContent)}
Job Description: ${JSON.stringify(jobDescription)}

Give me a list of 3 tailored resume improvement suggestions as an array of bullet points.
`.trim();

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    let text = result.text?.trim() || "";
    console.log("Gemini raw response:", text);

    // Clean and split into array
    const suggestions = text
      .split(/\n+/) // split by new lines
      .filter((line) => line.trim().match(/^(\d+\.|-|\*)\s+/)) // match bullet-like lines
      .map((line) => line.replace(/^(\d+\.|-|\*)\s+/, "").trim()); // remove numbering/bullets

    if (!suggestions.length) {
      throw new Error("Could not extract suggestions");
    }

    return NextResponse.json({ suggestions });
  } catch (error) {
    console.error("Tailor-resume error:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
