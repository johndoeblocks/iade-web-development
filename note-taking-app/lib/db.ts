import { readFile, writeFile } from "fs/promises";
import { join } from "path";

const DATABASE_PATH = join(process.cwd(), "data", "notes.json");

export type Note = {
    id: string;
    title: string;
    content: string;
    createdAt: string;
};

export async function getDb(): Promise<Note[]> {
    try {
        const data = await readFile(DATABASE_PATH, "utf-8");
        return JSON.parse(data);
    } catch (error) {
        return [];
    }
}

export async function saveDb(notes: Note[]) {
    await writeFile(DATABASE_PATH, JSON.stringify(notes, null, 2));
}
