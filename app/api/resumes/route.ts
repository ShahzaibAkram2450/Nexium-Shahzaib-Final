// app/api/resumes/route.ts
import { NextRequest, NextResponse } from "next/server";
import { createRouteHandlerClient } from "@supabase/auth-helpers-nextjs";
import { cookies } from "next/headers";
import clientPromise from "@/lib/mongodb";

export async function GET(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies }); // ✅ MISSING IN ORIGINAL

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("❌ Supabase session error:", sessionError.message);
      return NextResponse.json(
        { error: "Failed to validate session" },
        { status: 500 }
      );
    }

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    const client = await clientPromise;
    const db = client.db("resume-tailor");

    const resumes = await db
      .collection("resumes")
      .find({ userId: session.user.id })
      .sort({ updatedAt: -1 })
      .toArray();

    const serializedResumes = resumes.map((resume) => ({
      ...resume,
      _id: resume._id.toString(),
    }));

    return NextResponse.json({ resumes: serializedResumes }, { status: 200 });
  } catch (error) {
    console.error("🔥 Server error fetching resumes:", error);
    return NextResponse.json(
      { error: "Failed to fetch resumes" },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  const supabase = createRouteHandlerClient({ cookies });

  try {
    const {
      data: { session },
      error: sessionError,
    } = await supabase.auth.getSession();

    if (sessionError) {
      console.error("❌ Supabase session error:", sessionError.message);
      return NextResponse.json(
        { error: "Failed to validate session" },
        { status: 500 }
      );
    }

    if (!session || !session.user) {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }

    let body;
    try {
      body = await request.json();
    } catch (parseError) {
      console.error("❌ JSON parse error:", parseError);
      return NextResponse.json(
        { error: "Invalid JSON in request body" },
        { status: 400 }
      );
    }

    const { title, content, originalContent } = body;

    if (!title || !content) {
      return NextResponse.json(
        { error: "Missing required fields: title and content are required" },
        { status: 400 }
      );
    }

    if (typeof content !== "object") {
      return NextResponse.json(
        { error: "Content must be a valid object" },
        { status: 400 }
      );
    }

    const client = await clientPromise;
    const db = client.db("resume-tailor");

    const resume = {
      id: `resume_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
      userId: session.user.id,
      title,
      content,
      originalContent: originalContent || null,
      createdAt: new Date(),
      updatedAt: new Date(),
    };

    const result = await db.collection("resumes").insertOne(resume);

    const createdResume = {
      ...resume,
      _id: result.insertedId.toString(),
    };

    return NextResponse.json({ resume: createdResume }, { status: 201 });
  } catch (error) {
    console.error("🔥 Server error creating resume:", error);

    if (error instanceof Error) {
      return NextResponse.json(
        { error: `Failed to create resume: ${error.message}` },
        { status: 500 }
      );
    }

    return NextResponse.json(
      { error: "Failed to create resume" },
      { status: 500 }
    );
  }
}
