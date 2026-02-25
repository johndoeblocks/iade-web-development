"use client";

import { Note } from "@/lib/db";
import { Trash2, ExternalLink } from "lucide-react";
import Link from "next/link";

interface NoteCardProps {
    note: Note;
    onDelete: (id: string) => void;
}

export default function NoteCard({ note, onDelete }: NoteCardProps) {
    return (
        <div className="group relative bg-white rounded-xl border border-gray-200 hover:border-black transition-all flex flex-col h-full min-h-[160px] cursor-pointer">
            <Link href={`/notes/${note.id}`} className="p-5 flex-1 flex flex-col justify-between">
                <div>
                    <div className="flex justify-between items-start gap-2 mb-2">
                        <h3 className="font-bold text-gray-900 line-clamp-2">{note.title}</h3>
                    </div>
                    <p className="text-sm text-gray-600 line-clamp-4 whitespace-pre-wrap">{note.content}</p>
                </div>
                <div className="mt-4 pt-4 border-t border-gray-50 flex justify-between items-center">
                    <time className="text-[10px] font-medium text-gray-300 uppercase">
                        {new Date(note.createdAt).toLocaleDateString()}
                    </time>
                    <ExternalLink size={12} className="text-gray-300 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
            </Link>

            <button
                onClick={(e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    onDelete(note.id);
                }}
                className="absolute top-4 right-4 text-gray-300 hover:text-red-500 transition-colors opacity-0 group-hover:opacity-100 shrink-0 p-1"
                title="Delete note"
            >
                <Trash2 size={16} />
            </button>
        </div>
    );
}
