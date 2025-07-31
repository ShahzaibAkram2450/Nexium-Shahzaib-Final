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
Based on the resume and job description provided, please generate a new, tailored resume in markdown format. The new resume should be professionally formatted and highlight the candidate's skills and experience that are most relevant to the job description.
---
Resume:
${resumeContent}
---
Job Description:
${jobDescription}
`.trim();

    const result = await ai.models.generateContent({
      model: "gemini-2.5-flash",
      contents: prompt,
    });

    const tailoredResume = result.text?.trim() || "";

    if (!tailoredResume) {
      throw new Error("Could not generate tailored resume");
    }

    return NextResponse.json({ tailoredResume });
  } catch (error) {
    console.error("Tailor-resume error:", error);
    return NextResponse.json(
      { error: "Failed to generate suggestions" },
      { status: 500 }
    );
  }
}
