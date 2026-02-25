"use client";

import { useEffect, useState } from "react";
import { Note } from "@/lib/db";
import NoteForm from "@/components/NoteForm";
import NoteCard from "@/components/NoteCard";

export default function Home() {
  const [notes, setNotes] = useState<Note[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchNotes = async () => {
    try {
      const res = await fetch("/api/notes");
      const data = await res.json();
      setNotes(data);
    } catch (error) {
      console.error("Failed to fetch notes:", error);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteNote = async (id: string) => {
    try {
      const res = await fetch(`/api/notes/${id}`, { method: "DELETE" });
      if (res.ok) {
        setNotes((prev) => prev.filter((n) => n.id !== id));
      }
    } catch (error) {
      console.error("Failed to delete note:", error);
    }
  };

  useEffect(() => {
    fetchNotes();
  }, []);

  return (
    <div className="max-w-6xl mx-auto p-4 sm:p-8 space-y-12">
      <header className="flex justify-between items-end">
        <div>
          <h2 className="text-3xl font-bold text-gray-900">Your Library</h2>
          <p className="text-gray-500 text-sm">Organize your thoughts and ideas.</p>
        </div>
        <div className="text-[10px] font-bold text-gray-300 uppercase tracking-widest bg-gray-50 px-3 py-1 rounded-full border border-gray-100">
          {notes.length} Total Notes
        </div>
      </header>

      <section className="flex justify-center">
        <div className="w-full max-w-2xl">
          <NoteForm onSuccess={fetchNotes} />
        </div>
      </section>

      <section>
        {isLoading ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1, 2, 3].map((i) => (
              <div key={i} className="h-32 bg-gray-50 animate-pulse rounded-xl" />
            ))}
          </div>
        ) : notes.length === 0 ? (
          <div className="text-center py-20 bg-gray-50 rounded-2xl border border-dashed border-gray-200">
            <p className="text-sm text-gray-400">Your library is empty. Start by creating a note.</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {notes.map((note) => (
              <NoteCard key={note.id} note={note} onDelete={deleteNote} />
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
