// Types for Gutendex API and Bookstore state
// These simple interfaces help TypeScript understand the shape of our data

export interface Author {
  name: string;
  birth_year?: number | null;
  death_year?: number | null;
}

export interface Book {
  id: number;
  title: string;
  authors: Author[];
  subjects: string[];
  bookshelves?: string[];
  languages: string[];
  copyright?: boolean;
  media_type?: string;
  formats: Record<string, string>;
  download_count: number;
  price?: number; // Simulated book price for cart checkout
}

export interface BooksResponse {
  count: number;
  next: string | null;
  previous: string | null;
  results: Book[];
}

export interface CartItem {
  book: Book;
  quantity: number;
  price: number;
}

