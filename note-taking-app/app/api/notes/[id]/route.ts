import { NextResponse } from "next/server";
import { getDb, saveDb } from "@/lib/db";

export const runtime = "nodejs";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const notes = await getDb();
  const note = notes.find((n) => n.id === id);

  if (note) {
    return NextResponse.json(note);
  }
  return NextResponse.json({ error: "Note not found" }, { status: 404 });
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const notes = await getDb();
  const filteredNotes = notes.filter((note) => note.id !== id);
  await saveDb(filteredNotes);
  return NextResponse.json({ success: true });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> },
) {
  const { id } = await params;
  const { title, content } = await request.json();
  const notes = await getDb();
  const noteIndex = notes.findIndex((note) => note.id === id);

  if (noteIndex !== -1) {
    notes[noteIndex] = {
      ...notes[noteIndex],
      title: title ?? notes[noteIndex].title,
      content: content ?? notes[noteIndex].content,
    };
    await saveDb(notes);
    return NextResponse.json(notes[noteIndex]);
  }

  return NextResponse.json({ error: "Note not found" }, { status: 404 });
}
