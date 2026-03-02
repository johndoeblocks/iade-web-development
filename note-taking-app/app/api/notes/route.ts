import { NextResponse } from "next/server";
import { getDb, saveDb, Note } from "@/lib/db";

export const runtime = "nodejs";

export async function GET() {
    const notes = await getDb();
    return NextResponse.json(notes);
}

export async function POST(request: Request) {
    const { title, content } = await request.json();

    if (!title || !content) {
        return NextResponse.json({ error: "Title and content are required" }, { status: 400 });
    }

    const notes = await getDb();
    const newNote: Note = {
        id: crypto.randomUUID(),
        title,
        content,
        createdAt: new Date().toISOString(),
    };

    notes.unshift(newNote);
    await saveDb(notes);

    return NextResponse.json(newNote, { status: 201 });
}
