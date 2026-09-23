# Book Vibe ☕📖

> **A quiet, tactile digital sanctuary for slow readers, coffee lovers, and thoughtful reflections.**  
> **Live Sanctuary**: [https://book-vibe-shahil.vercel.app/](https://book-vibe-shahil.vercel.app/)

[![Next.js](https://img.shields.io/badge/Next.js-16.3-black?style=flat-square&logo=next.js)](https://nextjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-Strict-blue?style=flat-square&logo=typescript)](https://www.typescriptlang.org/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-CSS%204-38B2AC?style=flat-square&logo=tailwind-css)](https://tailwindcss.com/)
[![Open Library](https://img.shields.io/badge/Catalog-Open%20Library%20API-orange?style=flat-square)](https://openlibrary.org/)

---

## What is Book Vibe?

Modern reading platforms have turned reading into an aggressive productivity sprint—cluttered with intrusive ads, gamified streaks, affiliate popups, and algorithmic noise.

**Book Vibe was built as an antidote.**

It is designed to feel like sitting beside a sunlit cafe window on a rainy afternoon: holding a hot cup of pour-over coffee, listening to the ambient murmur of rain, and browsing through timeless books without hurry. Every interface detail, tactile wood-grain bookshelf, warm coffee palette (`#FAF7F2`, `#8B5A2B`), and hand-written marginalia note was crafted to make reading personal again.

---

## ✨ Key Experiences & Features

### 1. 📚 Real-Time Open Library Catalog & Curated Gems

- **Live Search & Exploration**: Instantly search millions of books via the Open Library API with instant cover art, authors, publication years, and subject tags.
- **Curated Classics**: A pre-seeded collection of 100 deeply resonant works—from existential philosophy and Russian literature to Bengali poetry, Islamic thought, and timeless fiction.

### 2. 🪵 The Tactile Bookshelf (3 Visual Modes)

- **Wood Plank Bookshelf Mode**: Visually presents books standing on tactile wooden shelves with custom aesthetic spine covers, author labels, and quick status pills.
- **Card Grid Mode**: Generous, card-based overview displaying genres, status tags, note previews, and direct review triggers.
- **Compact Index Table Mode**: Minimalist, high-density table view with sortable columns, reading completion dates, and quick status menus.

### 3. 🔖 Granular Shelf Status Tracking

Track any book across distinct reading phases with instant local persistence:

- 📖 **Reading** — Actively reading right now.
- 🔖 **Plan to Read** — Saved for the right quiet evening.
- ✅ **Finished** — Completed and ready for reflection.
- ⏸️ **On Hold** — Temporarily paused.
- 🚫 **Dropped** — Gracefully abandoned without guilt.
- 🔄 **Re-Reading** — Re-visiting an old literary friend.

### 4. ✍️ Marginalia, Reviews & The Coffee-Themed Calendar

- **5-Star Granular Scoring**: Record how deeply a title resonated.
- **Personal Reflections**: An intimate journal entry field for your post-reading takeaways.
- **Memorable Quotes**: Save poetic lines and passages that stayed with you.
- **Custom Popover Calendar**: Pick your finished date using a bespoke, coffee-themed calendar popover with quick presets (_"Today"_, _"Yesterday"_).
- **Journal Filter Tags**: Instantly isolate 5★ Masterpieces, 4★ Greats, entries with quotes, or entries with extended reflections.

### 5. 🧭 Curated Thematic Reading Journeys

Curated literary expeditions that guide you through sequential books connected by a common philosophical thread:

- _Existential Solitude & Meaning_ (Camus, Dostoevsky, Sartre, Kafka)
- _Bengal's Poetic & Cultural Soul_ (Tagore, Nazrul, Bibhutibhushan, Sarat Chandra)
- _The Quest for Wisdom & Spirit_ (Rumi, Al-Ghazali, Marcus Aurelius)
- _Dystopian Futures & Human Nature_ (Orwell, Huxley, Bradbury)
- _The Architecture of Solitude_ (Murakami, Calvino, Hesse)

Each journey step features a designated stage title, progress tracker, and a contemplative reflection inquiry.

### 6. 🎯 Reading Goals & Statistical Insights

- **Annual Challenge**: Set a personalized annual target with real-time percentage progress bars.
- **Reading Distribution**: Visual breakdown of your reading velocity, completed titles, active reads, and genres.
- **Motivational Pacing**: Calculated pacing indicators celebrating your literary milestones without stressful pressure.

### 7. ☕ Coffee & Tea Pairings + Literary Kinship

- Every book features a thoughtfully selected warm drink pairing (e.g. _Cardamom Turkish Coffee_, _Earl Grey with Lavender_, _Dark Roast Pour-Over_).
- **Literary Kinship**: Discover related titles that share tonal, thematic, or philosophical kinship.

### 8. ⚡ Reader Tray Hub & Global Command Palette

- **Floating Quick Shelf Tray**: An unobtrusive floating button (`BookMarked`) that opens a slide-over drawer to view currently reading titles or jump into your shelf from any page.
- **Command Palette (`Cmd + K` / `Ctrl + K`)**: Lightning-fast modal to jump directly to any book, author, genre, or reading journey across the entire application.

---

## 🛠️ Tech Stack & Architecture

- **Framework**: [Next.js 16](https://nextjs.org/) (App Router, Turbopack, React 19)
- **Language**: [TypeScript](https://www.typescriptlang.org/) (Strict mode enabled, complete type safety)
- **Styling**: [Tailwind CSS 4](https://tailwindcss.com/) with a custom coffee sanctuary design system
- **UI & Primitives**: [Radix UI](https://www.radix-ui.com/) / shadcn (Accessible dialogs, dropdowns, popovers, and progress bars)
- **Icons**: [Lucide React](https://lucide.dev/)
- **Data Source**: [Open Library API](https://openlibrary.org/developers/api) + local curated catalog
- **Storage**: Client-side `localStorage` with reactive React Context providers for zero latency and total user privacy

---

## 🔒 Privacy & Local-First Philosophy

Book Vibe respects your reading solitude:

- **Zero Ads & Zero Tracking**: No Google Analytics, no tracking pixels, no telemetry.
- **100% Local Storage**: Your shelves, marginalia, ratings, reading notes, and annual goals are stored directly inside your browser's `localStorage`.
- **Offline Resilience**: Even if the network drops, your saved books and personal reviews remain fully readable.

---

## 🚀 Getting Started Locally

### Prerequisites

- [Node.js](https://nodejs.org/) (v18.18 or higher recommended)
- `npm`, `pnpm`, or `yarn`

### Installation

1. **Clone the repository**:

   ```bash
   git clone https://github.com/srpranto/book-vibe.git
   cd book-vibe
   ```

2. **Install dependencies**:

   ```bash
   npm install
   ```

3. **Start the development server**:

   ```bash
   npm run dev
   ```

4. **Open in your browser**:
   Visit [http://localhost:3000](http://localhost:3000) to enter the reading room.

### Building for Production

```bash
npm run build
npm run start
```

---

## 📂 Project Structure

```text
book-vibe/
├── public/                  # Static assets and icons
├── src/
│   ├── app/                 # Next.js App Router (pages & layouts)
│   │   ├── allbooks/        # Complete catalog search & explore
│   │   ├── books/[id]/      # Dynamic rich book details & sensory pairings
│   │   ├── journeys/        # Curated thematic reading journeys
│   │   ├── plan-to-read/    # Tactile Shelf, Journal & Stats dashboard
│   │   ├── layout.tsx       # Root layout & providers
│   │   └── page.tsx         # Homepage reading room
│   ├── components/
│   │   ├── books/           # Shelf views, book actions, review modal, stats
│   │   ├── homepage/        # Hero banner, featured catalog, coffee ambiance
│   │   ├── journeys/        # Journey pathway cards & step indicators
│   │   ├── layout/          # Navbar, footer, navigation items
│   │   └── ui/              # Radix UI primitives (calendar, popover, dialog, covers)
│   ├── context/             # Reading status, marginalia, custom books state
│   ├── lib/                 # Open Library client, kinship logic, utilities
│   └── types/               # TypeScript interfaces for books, reviews & journeys
├── .gitignore               # Environment and tool ignores
├── package.json             # Scripts & dependencies
└── README.md                # Project documentation
```

---

## ☕ A Closing Note

> _"I have always imagined that Paradise will be a kind of a library."_  
> — **Jorge Luis Borges**

Take a seat, brew something warm, and enjoy your time among the pages.
