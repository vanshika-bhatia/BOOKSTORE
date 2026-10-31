# 📚 BookStore FrontEnd Application

A modern, responsive, and beginner-friendly Bookstore web application built with **React.js**, **Next.js (App Router)**, **TypeScript**, and **Ant Design (v5)**. 

The application integrates with the **Gutendex Project Gutenberg API** to deliver infinite scrolling pagination through thousands of classic books, complete with live search, category filtering, a shopping cart, and a saved wishlist.

---

## 🌟 Key Features

1. **Infinite Scroll Catalog (Gutendex API)**
   - Automatically loads books in batches as you scroll down using the modern `IntersectionObserver` sentinel technique.
   - Intelligent deduplication using JavaScript `Set` to prevent duplicate books.
   - Overlap protection via `loadingRef` to ensure only one request runs at a time.
   - Built-in error handling with a one-click **"Retry Loading"** button if an API request fails.

2. **Search & Filters**
   - **Live Search**: Debounced search by title, author, or subject.
   - **Quick Category Tags**: Filter instantly by Fiction, Mystery, Philosophy, Science, History, Poetry, and Children's books.
   - **Language Selector**: Filter books written in English, French, German, Spanish, or Italian.

3. **Book Detail Modal**
   - Click any book to view high-resolution covers, full author names, subject tags, Gutenberg ID, and download counts.
   - Free **"Read Online Ebook"** button that opens the original text/HTML version directly.

4. **Shopping Cart & Checkout**
   - Add books to cart with realistic simulated prices.
   - Increase/decrease quantities or remove items.
   - **Undo Feature**: "Pop to undo last removed item" banner allowing you to restore accidentally removed books.
   - **Quick Checkout Modal**: Shipping form with simulated order confirmation.

5. **Wishlist / Favorites**
   - Save your favorite books with one click on the heart icon.
   - Move books directly from wishlist to cart.

6. **State Persistence (`localStorage`)**
   - Both your Shopping Cart and Wishlist automatically persist even after refreshing or closing the browser.

---

## 📁 Project Structure

```text
Book store/
├── app/
│   ├── books/
│   │   └── page.tsx        # Main Bookstore Catalog with Infinite Scroll
│   ├── globals.css         # Clean custom styles & animations
│   ├── layout.tsx          # Root layout with Ant Design Registry & Theme
│   └── page.tsx            # Home route (renders Bookstore page)
├── components/
│   ├── BookCard.tsx        # Ant Design Book Card with Cover & Actions
│   ├── BookDetailModal.tsx # Detailed view modal with read online links
│   ├── CartDrawer.tsx      # Slide-out cart drawer with checkout form
│   ├── Navbar.tsx          # Header with logo, search, and category tags
│   └── WishlistDrawer.tsx  # Saved favorites drawer
├── types/
│   └── book.ts             # TypeScript interfaces for API & Store state
├── utils/
│   └── helpers.ts          # Clean utility functions (formatting, prices, images)
├── package.json            # Project dependencies & scripts
├── tsconfig.json           # TypeScript configuration
├── next.config.js          # Next.js image domain configuration
└── README.md               # Documentation & Deployment guide
```

---

## 🚀 Getting Started (Run Locally)

### Prerequisites
Make sure you have [Node.js](https://nodejs.org/) installed (v18 or v20+ recommended).

### 1. Install Dependencies
Open your terminal in the project directory and run:
```bash
npm install
```

### 2. Run the Development Server
```bash
npm run dev
```

### 3. Open in Browser
Visit [http://localhost:3000](http://localhost:3000) or [http://localhost:3000/books](http://localhost:3000/books) in your browser to explore the Bookstore!

---

## 🧠 How the Infinite Scroll Works (Beginner Guide)

In `app/books/page.tsx`, infinite scroll is implemented cleanly using 3 core concepts:

1. **Next URL Reference (`useRef`)**:
   - `const nextUrlRef = useRef<string | null>("https://gutendex.com/books/");`
   - Gutendex API provides the exact `next` URL in each JSON response. We store this in a ref so it doesn't trigger unnecessary re-renders when it changes.

2. **Deduplicating Books (`Set`)**:
   ```typescript
   setBooks((previous) => {
     const ids = new Set(previous.map((book) => book.id));
     return [...previous, ...data.results.filter((book) => !ids.has(book.id))];
   });
   ```
   This ensures that even if an API page overlaps, every book key in React is strictly unique.

3. **Intersection Observer Sentinel (`sentinelRef`)**:
   ```typescript
   const observer = new IntersectionObserver(
     ([entry]) => {
       if (entry.isIntersecting) void loadMore();
     },
     { rootMargin: "300px" } // Triggers before reaching the bottom
   );
   ```
   A tiny `<div ref={sentinelRef} />` at the bottom of the list triggers the next page 300px before the user hits the bottom, creating a smooth infinite scroll experience.

---

## 🚢 Deployment Guide

This Next.js application is 100% production-ready and can be deployed for free on **Vercel** or **Netlify**.

### Option A: Deploy to Vercel (Recommended for Next.js)

1. **Push your code to GitHub**:
   ```bash
   git init
   git add .
   git commit -m "Initial commit of Bookstore App"
   git branch -M main
   # Create a repository on github.com and link it:
   git remote add origin https://github.com/your-username/bookstore-app.git
   git push -u origin main
   ```

2. **Deploy on Vercel**:
   - Go to [vercel.com](https://vercel.com) and sign in with GitHub.
   - Click **"Add New"** > **"Project"**.
   - Select your `bookstore-app` repository.
   - Vercel automatically detects Next.js. Leave the default settings:
     - **Framework Preset**: Next.js
     - **Build Command**: `next build`
     - **Output Directory**: `.next`
   - Click **"Deploy"**. Within 1 minute, your bookstore will be live at `https://your-project.vercel.app`!

---

### Option B: Deploy to Netlify

1. Push your code to GitHub (as shown above).
2. Go to [netlify.com](https://www.netlify.com/) and sign in.
3. Click **"Add new site"** > **"Import an existing project"** > **GitHub**.
4. Select your repository.
5. Netlify will auto-detect Next.js:
   - **Build command**: `npm run build`
   - **Publish directory**: `.next`
6. Click **"Deploy site"**.

---

### Option C: Build and Run on a VPS / Server
To test or run a production build locally or on any cloud server:
```bash
# 1. Build the production bundle
npm run build

# 2. Start the production server
npm run start
```
The optimized server will start at `http://localhost:3000`.

---

## 🛠️ Built With
- **[Next.js 14](https://nextjs.org/)** - Modern React Framework with App Router
- **[React 18](https://react.dev/)** - UI Component Library
- **[TypeScript](https://www.typescriptlang.org/)** - Type-safe JavaScript
- **[Ant Design 5](https://ant.design/)** - Enterprise-grade UI component design system
- **[Gutendex API](https://gutendex.com/)** - Project Gutenberg Ebook Catalog API

