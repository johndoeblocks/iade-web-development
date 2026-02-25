"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Note } from "@/lib/db";
import { ArrowLeft, Edit2, Trash2 } from "lucide-react";
import Link from "next/link";
import NoteForm from "@/components/NoteForm";

export default function NotePage() {
    const params = useParams();
    const router = useRouter();
    const [note, setNote] = useState<Note | null>(null);
    const [isLoading, setIsLoading] = useState(true);
    const [isEditing, setIsEditing] = useState(false);

    const fetchNote = async () => {
        try {
            const res = await fetch(`/api/notes/${params.id}`);
            if (res.ok) {
                const data = await res.json();
                setNote(data);
            } else {
                router.push("/");
            }
        } catch (error) {
            console.error("Failed to fetch note:", error);
            router.push("/");
        } finally {
            setIsLoading(false);
        }
    };

    const deleteNote = async () => {
        if (!confirm("Are you sure you want to delete this note?")) return;

        try {
            const res = await fetch(`/api/notes/${params.id}`, { method: "DELETE" });
            if (res.ok) {
                router.push("/");
            }
        } catch (error) {
            console.error("Failed to delete note:", error);
        }
    };

    useEffect(() => {
        fetchNote();
    }, [params.id]);

    if (isLoading) {
        return (
            <div className="max-w-4xl mx-auto p-8 animate-pulse">
                <div className="h-8 w-32 bg-gray-100 rounded mb-8" />
                <div className="h-12 w-3/4 bg-gray-50 rounded mb-4" />
                <div className="h-4 w-full bg-gray-50 rounded mb-2" />
                <div className="h-4 w-full bg-gray-50 rounded mb-2" />
                <div className="h-4 w-2/3 bg-gray-50 rounded" />
            </div>
        );
    }

    if (!note) return null;

    return (
        <main className="max-w-4xl mx-auto p-4 sm:p-8 min-h-screen">
            <nav className="mb-12">
                <Link
                    href="/"
                    className="inline-flex items-center gap-2 text-sm font-medium text-gray-500 hover:text-black transition-colors"
                >
                    <ArrowLeft size={16} />
                    Back to Library
                </Link>
            </nav>

            {isEditing ? (
                <div className="animate-in fade-in slide-in-from-bottom-4 duration-500">
                    <NoteForm
                        noteId={note.id}
                        initialTitle={note.title}
                        initialContent={note.content}
                        onSuccess={() => {
                            setIsEditing(false);
                            fetchNote();
                        }}
                        onCancel={() => setIsEditing(false)}
                    />
                </div>
            ) : (
                <div className="animate-in fade-in duration-700">
                    <header className="flex justify-between items-start gap-4 mb-8">
                        <h1 className="text-4xl font-bold tracking-tight text-gray-900 leading-tight">
                            {note.title}
                        </h1>
                        <div className="flex gap-2">
                            <button
                                onClick={() => setIsEditing(true)}
                                className="p-2 text-gray-400 hover:text-black hover:bg-gray-100 rounded-full transition-all"
                                title="Edit note"
                            >
                                <Edit2 size={20} />
                            </button>
                            <button
                                onClick={deleteNote}
                                className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-full transition-all"
                                title="Delete note"
                            >
                                <Trash2 size={20} />
                            </button>
                        </div>
                    </header>

                    <p className="text-xl text-gray-600 leading-relaxed whitespace-pre-wrap mb-12">
                        {note.content}
                    </p>

                    <footer className="pt-8 border-t border-gray-100 text-xs font-medium text-gray-400 uppercase tracking-widest">
                        Created on {new Date(note.createdAt).toLocaleDateString(undefined, {
                            year: 'numeric',
                            month: 'long',
                            day: 'numeric'
                        })}
                    </footer>
                </div>
            )}
        </main>
    );
}
