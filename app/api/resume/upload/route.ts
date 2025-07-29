import { type NextRequest, NextResponse } from "next/server";
import pdf from "pdf-parse";

export async function POST(request: NextRequest) {
  try {
    const data = await request.formData();
    const file: File | null = data.get("resume") as unknown as File;

    if (!file) {
      return NextResponse.json({ error: "No file uploaded" }, { status: 400 });
    }

    // Check file size (10MB limit)
    if (file.size > 10 * 1024 * 1024) {
      return NextResponse.json(
        { error: "File too large. Maximum size is 10MB." },
        { status: 400 }
      );
    }

    const bytes = await file.arrayBuffer();
    const buffer = Buffer.from(bytes);

    let content = "";
    let title = file.name;

    // Process different file types
    if (file.type === "application/pdf") {
      try {
        const pdfData = await pdf(buffer);
        content = String(pdfData.text || "").trim();
      } catch (error) {
        console.error("PDF parsing error:", error);
        return NextResponse.json(
          { error: "Failed to parse PDF file" },
          { status: 400 }
        );
      }
    } else if (file.type === "text/plain") {
      content = String(buffer.toString("utf-8") || "").trim();
    } else if (
      file.type === "application/msword" ||
      file.type ===
        "application/vnd.openxmlformats-officedocument.wordprocessingml.document"
    ) {
      // For DOC/DOCX files, you might want to use a library like mammoth
      // For now, we'll return an error asking users to convert to PDF or paste content
      return NextResponse.json(
        {
          error:
            "DOC/DOCX files are not supported yet. Please convert to PDF or paste the content directly.",
        },
        { status: 400 }
      );
    } else {
      return NextResponse.json(
        { error: "Unsupported file type" },
        { status: 400 }
      );
    }

    // Clean up the content
    content = String(content || "").trim();

    if (!content) {
      return NextResponse.json(
        { error: "No text content found in the file" },
        { status: 400 }
      );
    }

    // Remove the file extension from title
    title = String(title || "").replace(/\.[^/.]+$/, "");

    return NextResponse.json({
      content: content,
      title: title,
      success: true,
    });
  } catch (error) {
    console.error("Upload error:", error);
    return NextResponse.json(
      { error: "Failed to process file" },
      { status: 500 }
    );
  }
}
