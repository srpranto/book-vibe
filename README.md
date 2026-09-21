# ☕ Book Vibe — Coffee & Books

> A cozy digital sanctuary for book discovery, classic literature, and coffee lovers.

[![Live Demo](https://img.shields.io/badge/Live_Demo-book--vibe--shahil.vercel.app-8B5A2B?style=for-the-badge&logo=vercel&logoColor=white)](https://book-vibe-shahil.vercel.app/)
[![Next.js 16](https://img.shields.io/badge/Next.js-16.3.5-black?style=for-the-badge&logo=next.js&logoColor=white)](https://nextjs.org/)
[![React 19](https://img.shields.io/badge/React-19.2.8-61DAFB?style=for-the-badge&logo=react&logoColor=black)](https://react.dev/)
[![Tailwind CSS 4](https://img.shields.io/badge/Tailwind_CSS-v4.0-38B2AC?style=for-the-badge&logo=tailwind-css&logoColor=white)](https://tailwindcss.com/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-3178C6?style=for-the-badge&logo=typescript&logoColor=white)](https://www.typescriptlang.org/)

---

## 📖 Overview

**Book Vibe** is an aesthetic, warm-toned book exploration web application inspired by quiet corners in artisanal coffeehouses. It curates **100 timeless literary, philosophical, and Islamic masterworks**—from Franz Kafka, Albert Camus, and Fyodor Dostoevsky to celebrated Bengali literary giants (Rabindranath Tagore, Bibhutibhushan, Sarat Chandra) and monumental Islamic classics and Muslim authors (Imam al-Ghazali, Ibn Khaldun, Rumi, Saadi, Muhammad Iqbal, Naguib Mahfouz, and Orhan Pamuk).

Readers can effortlessly discover masterpieces, inspect rich bibliographic metadata, explore curated coffee pairings, track read lists, and dive into related literature.

---

## ✨ Key Features

### ☕ 1. Warm Coffeehouse Visual Identity

- **Cozy Palette**: Crafted with rich espresso (`#241812`), warm caramel (`#8B5A2B`), soft latte parchment (`#FAF7F2`), and cream accents (`#F5ECE3`).
- **High Readability**: WCAG-compliant contrast across descriptions, author badges, and footer typography.
- **Ambient Lighting**: Subtle organic radial blurs evoking warm coffeehouse lamps.

### 📚 2. Curated Library & Catalog (`/allbooks`)

- **100 Masterworks**: Detailed collection of 100 classic, philosophical, and Islamic literary works with high-res cover art.
- **Instant Search**: Tokenized multi-word search matching titles, author names, publishers, and genre tags in real-time.
- **Aesthetic Genre Dropdown**: Filter seamlessly across 14 literary genres (Classic, Philosophy, Islamic, Historical Fiction, Fiction, Literature, etc.) with book counts, thematic icons, and an active genre clear pill.
- **Custom Styled Sort Dropdown**: Sort books by:
  - Highest Rated (★) / Lowest Rated (☆)
  - Most Pages (📖) / Fewest Pages (📄)
  - Newest Published (📅) / Oldest Published (⏳)
  - Alphabetical Order (A to Z 🔤)
- **Live Counter & Reset**: Real-time counter of matching books with a one-click filter reset.

### 📖 3. Aesthetic Book Details Page (`/books/[id]`)

- **Latte Canvas Showcase**: Elevated cover art presentation with interactive hover depth and realistic drop shadows.
- **Floating Badges**: Real-time rating pill (`★ 4.9 / 5.0`) and estimated reading time calculation (`⏱ ~Xh read`).
- **☕ Reader's Coffee Pairing**: Tailored brew suggestions (pour-overs, cortados, espressos) paired with each book's tone.
- **4-Item Visual Specs Grid**: Quick view for total pages, reader rating, publication year, and publishing house.
- **Interactive Reading State**: One-click toggles for marking books as **Read** or adding to **Wishlist** with toast alerts.
- **One-Click Link Share**: Instantly copy direct book links to clipboard.
- **"More from the Library / You Might Also Enjoy"**: Contextual recommendations presenting 3 related books from the same genre or author.

### 📱 4. Responsive & Adaptive Navigation

- **Tablet, Laptop & Desktop (`md:` and up)**: Full navigation bar with an interactive sliding cream pill that tracks the active route with fluid cubic-bezier animation.
- **Mobile Phone (`< md`)**: Balanced 3-column layout featuring a coffee logo button on the left, centered "Book Vibe" branding, and a hamburger toggle on the right opening a centered dropdown menu.

### ⏳ 5. Warm Coffeehouse Skeleton Loading

- **Pixel-Accurate Layout Parity**: Skeletons match exact component dimensions, typography scale, pill badges, and action buttons.
- **Cozy Latte Color Palette**: Uses soft bone and warm latte pulse tones (`#FAF6F0`, `#F5ECE3`, `#E8D8C8`, `#EADBCE`) instead of generic harsh gray.
- **2 Cards on Mobile**: Book card skeletons maintain the strict 2-column mobile layout (`grid-cols-2 gap-3`), ensuring instant, non-jarring visual transitions.
- **Next.js App Router Streaming**: Native `loading.tsx` implementations for root `/`, `/allbooks`, `/books/[id]`, `/books`, and `/listed-books` provide instant visual feedback before hydration.

---

## 🛠️ Tech Stack & Architecture

| Layer          | Technology                                                                     | Description                                              |
| :------------- | :----------------------------------------------------------------------------- | :------------------------------------------------------- |
| **Framework**  | [Next.js 16.3.5](https://nextjs.org/)                                          | App Router, Server Components & Static Site Generation   |
| **Compiler**   | [Turbopack](https://turbo.build/pack)                                          | High-speed production bundling and instant fast refresh  |
| **Library**    | [React 19.2.8](https://react.dev/)                                             | Latest React features and React Compiler support         |
| **Language**   | [TypeScript 5](https://www.typescriptlang.org/)                                | Strict type-safety across all components and data models |
| **Styling**    | [Tailwind CSS 4](https://tailwindcss.com/) + [daisyUI 5](https://daisyui.com/) | Modern CSS engine with pure utility classes              |
| **Icons**      | Custom Vector SVGs & Favicons                                                  | Scalable, optimized coffeehouse icon pack                |
| **Deployment** | [Vercel](https://vercel.com/)                                                  | Edge-cached global deployment with automatic CI/CD       |

---

## 📁 Project Structure

```text
book-vibe/
├── public/
│   ├── booksData.json        # 100 curated books with metadata & reviews
│   ├── favicon.ico           # Universal root browser favicon
│   └── icons/                # Dedicated web icon asset directory
│       ├── apple-icon.png    # 180×180 iOS touch icon
│       ├── coffee.svg        # Brand coffee logo
│       ├── favicon.ico       # 258-byte standard ICO
│       ├── icon.png          # 32×32 favicon PNG
│       └── icon.svg          # Scalable vector favicon
├── src/
│   ├── app/
│   │   ├── allbooks/         # Main library page with search & sorting
│   │   │   ├── loading.tsx   # AllBooks streaming skeleton fallback
│   │   │   └── page.tsx      # AllBooks server component
│   │   ├── books/            # Route alias & dynamic [id] detail page
│   │   │   └── [id]/         # Book details view with coffee pairings
│   │   │   ├── [id]/         # Book details view with coffee pairings
│   │   │   │   ├── loading.tsx # Book details streaming skeleton fallback
│   │   │   │   └── page.tsx  # Dynamic book details page
│   │   │   ├── loading.tsx   # Books alias loading fallback
│   │   │   └── page.tsx      # Books alias redirect
│   │   ├── listed-books/     # Backward-compatible redirect alias
│   │   │   ├── loading.tsx   # Listed books streaming fallback
│   │   │   └── page.tsx      # Listed books redirect
│   │   ├── favicon.ico       # Next.js App Router root favicon
│   │   ├── globals.css       # Tailwind 4 & typography configuration
│   │   ├── layout.tsx        # Root layout, metadata & coffeehouse footer
│   │   ├── loading.tsx       # Root page streaming skeleton fallback
│   │   └── page.tsx          # Homepage (Hero Banner & Bestsellers Grid)
│   ├── assets/
│   │   └── icons/            # Module-imported UI vector assets
│   │       └── coffee.svg    # Coffee cup vector icon
│   ├── components/
│   │   ├── books/            # AllBooks view, search & client actions
│   │   ├── homepage/
│   │   │   ├── Banner.tsx    # Hero section with coffee ambience & stats
│   │   │   └── Books.tsx     # Top 9 best-selling books showcase
│   │   └── shared/
│   │       ├── BookCard.tsx  # Universal book card with author pill
│   │       └── Navbar.tsx    # Responsive navigation with sliding pill
│   │   ├── shared/
│   │   │   ├── BookCard.tsx  # Universal book card with author pill
│   │   │   └── Navbar.tsx    # Responsive navigation with sliding pill
│   │   └── skeletons/        # Modular skeleton loading components
│   │       ├── AllBooksSkeleton.tsx    # Library catalog skeleton
│   │       ├── BookCardSkeleton.tsx    # Single compact card skeleton
│   │       ├── BookDetailsSkeleton.tsx # Detailed view skeleton
│   │       ├── BookGridSkeleton.tsx    # Configurable responsive grid
│   │       ├── HomePageSkeleton.tsx    # Home banner & bestsellers skeleton
│   │       └── index.ts                # Barrel exports
│   ├── lib/
│   │   └── books.ts          # Server-side data helpers & search algorithms
│   └── types/
│       └── book.type.ts      # TypeScript interfaces for Book entities
├── next.config.ts            # Image domains, rewrites & Turbopack config
├── package.json              # Dependencies & npm scripts
└── tsconfig.json             # TypeScript compiler configuration
```

---

## 🚀 Getting Started

### Prerequisites

- **Node.js**: `v18.18.0` or higher (recommended: Node `20+` or `24+`)
- **Package Manager**: `npm`, `yarn`, `pnpm`, or `bun`

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

4. **Open in browser**:
   Navigate to [http://localhost:3000](http://localhost:3000) to explore Book Vibe.

---

## 📦 Scripts

| Command         | Action                                                         |
| :-------------- | :------------------------------------------------------------- |
| `npm run dev`   | Starts local Next.js Turbopack development server on port 3000 |
| `npm run build` | Compiles optimized production bundle with TypeScript checks    |
| `npm run start` | Serves production build locally                                |
| `npm run lint`  | Runs ESLint 9 checks across the codebase                       |

---

## ☕ Literary Catalog Highlights

Book Vibe hosts **100 masterworks** across major literary movements:

- **Islamic Philosophy & Spirituality**: _Deliverance from Error_ (Al-Ghazali), _The Beginning of Guidance_ (Al-Ghazali), _The Muqaddimah_ (Ibn Khaldun), _The Decisive Treatise_ (Ibn Rushd), _The Canon of Medicine_ (Ibn Sina), _Hayy ibn Yaqdhan_ (Ibn Tufayl), _Patience and Gratitude_ (Ibn Qayyim), _Purification of the Heart_ (Hamza Yusuf), _Reclaim Your Heart_ (Yasmin Mogahed).
- **Prophetic Biography & Sacred Heritage**: _The Sealed Nectar_ (Mubarakpuri), _Muhammad: His Life Based on the Earliest Sources_ (Martin Lings), _The Forty Hadith_ (Al-Nawawi), _Stories of the Prophets_ (Ibn Kathir), _The Message of The Qur'an_ (Muhammad Asad).
- **Classical Sufi Poetry & Wisdom**: _The Masnavi_ (Jalal al-Din Rumi), _The Conference of the Birds_ (Farid ud-Din Attar), _Gulistan_ & _Bustan_ (Saadi Shirazi), _The Divan of Hafez_, _The Secrets of the Self_ (Muhammad Iqbal).
- **Global Muslim & Middle Eastern Literature**: _Palace Walk_, _The Cairo Trilogy_, _Children of Gebelawi_ (Naguib Mahfouz), _My Name is Red_, _Snow_ (Orhan Pamuk), _The Kite Runner_, _A Thousand Splendid Suns_ (Khaled Hosseini), _Season of Migration to the North_ (Tayeb Salih), _Mornings in Jenin_ (Susan Abulhawa), _The Autobiography of Malcolm X_.
- **Existentialist & Absurdist Classics**: _The Trial_, _The Metamorphosis_, _The Stranger_, _The Myth of Sisyphus_, _Nausea_, _No Exit_.
- **Bengali Literary Masterpieces**: _Gitanjali_, _Gora_, _Chokher Bali_, _Pather Panchali_, _Chander Pahar_, _Aranyak_, _Srikanta_, _Padma Nadir Majhi_, _Putul Nacher Itikatha_, _Banalata Sen_, _Diba-Ratrir Kabya_.

---

## 🌐 Deployment

This project is deployed continuously on the [Vercel](https://vercel.com) Edge Network:

- **Live URL**: [https://book-vibe-shahil.vercel.app/](https://book-vibe-shahil.vercel.app/)

---

## 📄 License

This project is open source and available under the [MIT License](LICENSE).

---

_Crafted with ☕ and warm stories._
