# Note-Taking App: Step-by-Step Implementation Guide

This guide breaks down the creation of a simple note-taking app using **Next.js**, **JSON files** for storage, and **API Routes**. This is designed to help students understand the flow of data from the filesystem to the browser.

---

## 🛠️ Phase 1: Storage & Data Structure
*Goal: Decide what a note is and where it lives.*

1.  **Define the Note Type**: Create a TypeScript interface or type for our data.
    - Fields: `id`, `title`, `content`, `createdAt`.
2.  **Initialize the "Database"**: Create a folder `data/` and a file `notes.json` containing an empty array `[]`.
3.  **The Database Helper (`lib/db.ts`)**:
    - Import `fs/promises`.
    - Create `getDb()`: Reads the file and `JSON.parse` the content.
    - Create `saveDb(notes)`: `JSON.stringify` the array and writes it back.

---

## 🛣️ Phase 2: Building the API (Backend)
*Goal: Create endpoints so the frontend can "talk" to the data.*

1.  **GET & POST (`app/api/notes/route.ts`)**:
    - **GET**: Use `getDb()` and return the notes as a JSON response.
    - **POST**: Receive data from a request, create a new note object (with a random `id` and `timestamp`), add it to the list, and use `saveDb()`.
2.  **DELETE (`app/api/notes/[id]/route.ts`)**:
    - Extract the `id` from the URL parameters.
    - Filter the notes array to remove that ID and save the result.

---

## 🎨 Phase 3: UI Components
*Goal: Create reusable pieces for our interface.*

1.  **NoteForm Component**:
    - Use `useState` to track input fields (title/content).
    - Handle form submission with `fetch('/api/notes', { method: 'POST', ... })`.
    - Accept an `onSuccess` prop to tell the parent page when to refresh.
2.  **NoteCard Component**:
    - A simple box that displays a note's title and content.
    - Add a "Delete" button that calls the delete API.

---

## 🔗 Phase 4: The Main Dashboard (`app/page.tsx`)
*Goal: Coordinate the data and the UI.*

1.  **State Management**:
    - Use `useState` to hold the list of `notes`.
2.  **Fetching Data**:
    - Use `useEffect` to call the GET API when the page first loads.
3.  **The Layout**:
    - Render the `NoteForm` at the top.
    - Map over the `notes` array to render multiple `NoteCard` components in a grid.

---

## ✨ Phase 5: Polish & UX
*Goal: Make it feel like a real application.*

1.  **Loading States**: Show a "Loading..." message while `useEffect` is running.
2.  **Empty States**: Show "No notes found" if the array is empty.
3.  **Responsive Design**: Use Tailwind's `grid-cols-1 md:grid-cols-2 lg:grid-cols-3` to make the grid fit different screen sizes.
