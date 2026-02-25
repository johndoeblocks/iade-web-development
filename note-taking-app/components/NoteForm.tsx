"use client";

import { useState } from "react";
import { Check, Plus } from "lucide-react";

interface NoteFormProps {
    onSuccess: () => void;
    initialTitle?: string;
    initialContent?: string;
    noteId?: string;
    onCancel?: () => void;
}

export default function NoteForm({ onSuccess, initialTitle = "", initialContent = "", noteId, onCancel }: NoteFormProps) {
    const [title, setTitle] = useState(initialTitle);
    const [content, setContent] = useState(initialContent);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (!title || !content) return;

        setIsSubmitting(true);
        try {
            const endpoint = noteId ? `/api/notes/${noteId}` : "/api/notes";
            const method = noteId ? "PATCH" : "POST";

            const res = await fetch(endpoint, {
                method,
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ title, content }),
            });

            if (res.ok) {
                if (!noteId) {
                    setTitle("");
                    setContent("");
                }
                onSuccess();
            }
        } finally {
            setIsSubmitting(false);
        }
    };

    return (
        <form onSubmit={handleSubmit} className={`space-y-4 ${noteId ? "" : "bg-white p-6 rounded-2xl border border-gray-100 shadow-sm"}`}>
            <input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Title"
                className="w-full text-2xl font-bold focus:outline-none placeholder:text-gray-200"
                disabled={isSubmitting}
                autoFocus={!!noteId}
            />
            <textarea
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Start writing..."
                rows={noteId ? 15 : 3}
                className="w-full text-lg text-gray-600 focus:outline-none resize-none placeholder:text-gray-200"
                disabled={isSubmitting}
            />
            <div className="flex justify-end gap-3 pt-4">
                {onCancel && (
                    <button
                        type="button"
                        onClick={onCancel}
                        className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-black transition-colors"
                    >
                        Cancel
                    </button>
                )}
                <button
                    type="submit"
                    disabled={isSubmitting}
                    className="flex items-center gap-2 px-6 py-2 bg-black text-white rounded-full hover:bg-gray-800 disabled:opacity-50 transition-all font-medium"
                >
                    {noteId ? <Check size={18} /> : <Plus size={18} />}
                    <span>{noteId ? "Save Changes" : "Create Note"}</span>
                </button>
            </div>
        </form>
    );
}
