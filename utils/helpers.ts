import { Book } from "@/types/book";

// Helper function to format author names from "LastName, FirstName" to "FirstName LastName"
export function formatAuthorName(name: string): string {
  if (!name) return "Unknown Author";
  if (name.includes(",")) {
    const parts = name.split(",");
    return `${parts[1].trim()} ${parts[0].trim()}`;
  }
  return name;
}

// Generates a consistent, realistic bookstore price based on book id
export function getBookPrice(bookId: number): number {
  const prices = [7.99, 9.99, 12.99, 14.50, 16.99, 19.99, 21.00, 24.50];
  const index = Math.abs(bookId) % prices.length;
  return prices[index];
}

// Safely get cover image URL or return a placeholder
export function getBookCoverUrl(book: Book): string {
  if (book.formats && book.formats["image/jpeg"]) {
    return book.formats["image/jpeg"];
  }
  return "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80";
}

// Get direct link to read the book online if available
export function getBookReadUrl(book: Book): string | null {
  if (!book.formats) return null;
  return (
    book.formats["text/html"] ||
    book.formats["text/html; charset=utf-8"] ||
    book.formats["text/plain; charset=utf-8"] ||
    book.formats["application/epub+zip"] ||
    null
  );
}
