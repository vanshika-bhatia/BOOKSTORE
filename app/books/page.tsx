"use client";

import React, { useCallback, useEffect, useRef, useState } from "react";
import {
  Layout,
  Row,
  Col,
  Spin,
  Alert,
  Button,
  Typography,
  message,
  FloatButton,
  Select,
  Tag,
  Empty,
} from "antd";
import {
  ReloadOutlined,
  BookOutlined,
} from "@ant-design/icons";

import { Book, BooksResponse, CartItem } from "@/types/book";
import Navbar from "@/components/Navbar";
import BookCard from "@/components/BookCard";
import BookDetailModal from "@/components/BookDetailModal";
import CartDrawer from "@/components/CartDrawer";
import WishlistDrawer from "@/components/WishlistDrawer";
import OrdersDrawer from "@/components/OrdersDrawer";
import { getBookPrice } from "@/utils/helpers";

const { Content, Footer } = Layout;
const { Title, Text } = Typography;

// Gutendex base API URL
const BASE_API = "https://gutendex.com/books/";

export default function BooksPage() {
  // -------------------------------------------------------------
  // 1. STATE MANAGEMENT
  // -------------------------------------------------------------
  const [books, setBooks] = useState<Book[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [hasMore, setHasMore] = useState(true);
  const [totalCount, setTotalCount] = useState<number | null>(null);

  // Search, Topic and Language Filter state
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedTopic, setSelectedTopic] = useState("");
  const [selectedLanguage, setSelectedLanguage] = useState("all");

  // Selected book for details modal
  const [selectedBook, setSelectedBook] = useState<Book | null>(null);
  const [isDetailModalOpen, setIsDetailModalOpen] = useState(false);

  // Shopping Cart & Wishlist state
  const [cart, setCart] = useState<CartItem[]>([]);
  const [wishlist, setWishlist] = useState<Book[]>([]);
  const [lastRemovedItem, setLastRemovedItem] = useState<CartItem | null>(null);

  // Drawers open/close state
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [isWishlistOpen, setIsWishlistOpen] = useState(false);
  const [isOrdersOpen, setIsOrdersOpen] = useState(false);

  // -------------------------------------------------------------
  // 2. REFS FOR INFINITE SCROLL & API PAGINATION
  // -------------------------------------------------------------
  const nextUrlRef = useRef<string | null>(BASE_API);
  const loadingRef = useRef(false);
  const sentinelRef = useRef<HTMLDivElement | null>(null);

  // -------------------------------------------------------------
  // 3. LOCAL STORAGE PERSISTENCE (Runs on client mount)
  // -------------------------------------------------------------
  useEffect(() => {
    try {
      const savedCart = localStorage.getItem("bookstore_cart");
      if (savedCart) setCart(JSON.parse(savedCart));

      const savedWishlist = localStorage.getItem("bookstore_wishlist");
      if (savedWishlist) setWishlist(JSON.parse(savedWishlist));
    } catch (e) {
      console.warn("Could not read from localStorage", e);
    }
  }, []);

  // Save Cart updates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("bookstore_cart", JSON.stringify(cart));
    } catch (e) {
      console.warn("Could not save cart", e);
    }
  }, [cart]);

  // Save Wishlist updates to localStorage
  useEffect(() => {
    try {
      localStorage.setItem("bookstore_wishlist", JSON.stringify(wishlist));
    } catch (e) {
      console.warn("Could not save wishlist", e);
    }
  }, [wishlist]);

  // -------------------------------------------------------------
  // 4. FUNCTION TO LOAD NEXT BATCH OF BOOKS (Gutendex API)
  // -------------------------------------------------------------
  const loadMore = useCallback(async () => {
    const url = nextUrlRef.current;
    if (!url || loadingRef.current) return;

    loadingRef.current = true;
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(url);
      if (!response.ok) {
        throw new Error(`Unable to load books (${response.status}).`);
      }

      const data: BooksResponse = await response.json();

      // Deduplicate books by ID to prevent duplicate React keys
      setBooks((previous) => {
        const ids = new Set(previous.map((book) => book.id));
        return [
          ...previous,
          ...data.results.filter((book) => !ids.has(book.id)),
        ];
      });

      // Update total catalog count if provided
      if (typeof data.count === "number") {
        setTotalCount(data.count);
      }

      // Next URL for infinite scroll
      nextUrlRef.current = data.next;
      setHasMore(data.next !== null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Request failed.");
    } finally {
      loadingRef.current = false;
      setLoading(false);
    }
  }, []);

  // -------------------------------------------------------------
  // 5. HELPER TO BUILD INITIAL API URL BASED ON FILTERS & SEARCH
  // -------------------------------------------------------------
  const resetAndFetch = useCallback(
    (search: string, topic: string, lang: string) => {
      // Build query string params
      const params = new URLSearchParams();
      if (search.trim()) params.append("search", search.trim());
      if (topic.trim()) params.append("topic", topic.trim());
      if (lang && lang !== "all") params.append("languages", lang);

      const queryString = params.toString();
      const initialUrl = queryString ? `${BASE_API}?${queryString}` : BASE_API;

      // Reset books and next pointer
      setBooks([]);
      nextUrlRef.current = initialUrl;
      setHasMore(true);
      setError(null);

      // Trigger first fetch
      void loadMore();
    },
    [loadMore]
  );

  // Debounced search / topic changes
  useEffect(() => {
    const timer = setTimeout(() => {
      resetAndFetch(searchTerm, selectedTopic, selectedLanguage);
    }, 400); // 400ms debounce to avoid rapid API calls while typing

    return () => clearTimeout(timer);
  }, [searchTerm, selectedTopic, selectedLanguage, resetAndFetch]);

  // -------------------------------------------------------------
  // 6. INTERSECTION OBSERVER FOR INFINITE SCROLL
  // -------------------------------------------------------------
  useEffect(() => {
    const sentinel = sentinelRef.current;
    if (!sentinel || !hasMore || error) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          void loadMore();
        }
      },
      { rootMargin: "300px" } // Triggers 300px before reaching the bottom
    );

    observer.observe(sentinel);
    return () => observer.disconnect();
  }, [loadMore, hasMore, error]);

  // -------------------------------------------------------------
  // 7. CART & WISHLIST HANDLERS
  // -------------------------------------------------------------
  const handleAddToCart = (book: Book) => {
    const price = getBookPrice(book.id);

    setCart((prevCart) => {
      const existing = prevCart.find((item) => item.book.id === book.id);
      if (existing) {
        return prevCart.map((item) =>
          item.book.id === book.id
            ? { ...item, quantity: item.quantity + 1 }
            : item
        );
      }
      return [...prevCart, { book, quantity: 1, price }];
    });

    message.success(`"${book.title.slice(0, 30)}..." added to cart!`);
  };

  const handleUpdateQuantity = (bookId: number, quantity: number) => {
    if (quantity <= 0) {
      handleRemoveFromCart(bookId);
      return;
    }
    setCart((prevCart) =>
      prevCart.map((item) =>
        item.book.id === bookId ? { ...item, quantity } : item
      )
    );
  };

  const handleRemoveFromCart = (bookId: number) => {
    const itemToRemove = cart.find((item) => item.book.id === bookId);
    if (itemToRemove) {
      setLastRemovedItem(itemToRemove);
    }
    setCart((prevCart) => prevCart.filter((item) => item.book.id !== bookId));
    message.info("Item removed from cart");
  };

  // "Pop to undo last removed item" feature
  const handleUndoRemove = () => {
    if (!lastRemovedItem) return;
    setCart((prevCart) => [...prevCart, lastRemovedItem]);
    message.success(`Restored "${lastRemovedItem.book.title.slice(0, 25)}..." to cart`);
    setLastRemovedItem(null);
  };

  const handleClearCart = () => {
    setCart([]);
    setLastRemovedItem(null);
  };

  // Wishlist toggle
  const handleToggleWishlist = (book: Book) => {
    const isSaved = wishlist.some((b) => b.id === book.id);
    if (isSaved) {
      setWishlist((prev) => prev.filter((b) => b.id !== book.id));
      message.info("Removed from wishlist");
    } else {
      setWishlist((prev) => [...prev, book]);
      message.success("Saved to your wishlist!");
    }
  };

  const handleRemoveFromWishlist = (bookId: number) => {
    setWishlist((prev) => prev.filter((b) => b.id !== bookId));
  };

  const handleMoveToCart = (book: Book) => {
    handleAddToCart(book);
    handleRemoveFromWishlist(book.id);
  };

  // Open book details modal
  const handleSelectBook = (book: Book) => {
    setSelectedBook(book);
    setIsDetailModalOpen(true);
  };

  // Calculate totals for navbar
  const totalCartCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const totalCartPrice = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  // -------------------------------------------------------------
  // 8. RENDER UI
  // -------------------------------------------------------------
  return (
    <Layout style={{ minHeight: "100vh", backgroundColor: "#f7f9fa" }}>
      {/* Top Navigation */}
      <Navbar
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        selectedTopic={selectedTopic}
        onTopicSelect={setSelectedTopic}
        cartCount={totalCartCount}
        cartTotal={totalCartPrice}
        wishlistCount={wishlist.length}
        onOpenCart={() => setIsCartOpen(true)}
        onOpenWishlist={() => setIsWishlistOpen(true)}
        onOpenOrders={() => setIsOrdersOpen(true)}
      />

      <Content
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "24px 16px",
          width: "100%",
        }}
      >
        {/* Subheader: Catalog stats & Language selector */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 12,
            marginBottom: 20,
            padding: "12px 18px",
            backgroundColor: "#ffffff",
            borderRadius: 8,
            boxShadow: "0 1px 4px rgba(0, 0, 0, 0.04)",
          }}
        >
          <div>
            <Title level={4} style={{ margin: 0, color: "#1f1f1f" }}>
              {searchTerm
                ? `Search results for "${searchTerm}"`
                : selectedTopic
                ? `${selectedTopic.toUpperCase()} Books`
                : "Explore Featured Books"}
            </Title>
            <Text type="secondary" style={{ fontSize: 13 }}>
              Showing {books.length} loaded books
              {totalCount !== null && ` of ${totalCount.toLocaleString()} available`}
            </Text>
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
            <span style={{ fontSize: 13, color: "#595959" }}>Language:</span>
            <Select
              value={selectedLanguage}
              onChange={setSelectedLanguage}
              style={{ width: 130 }}
              options={[
                { value: "all", label: "All Languages" },
                { value: "en", label: "English" },
                { value: "fr", label: "French" },
                { value: "de", label: "German" },
                { value: "es", label: "Spanish" },
                { value: "it", label: "Italian" },
              ]}
            />
          </div>
        </div>

        {/* Books Grid */}
        {books.length > 0 && (
          <Row gutter={[20, 24]}>
            {books.map((book) => {
              const isWishlisted = wishlist.some((b) => b.id === book.id);
              return (
                <Col xs={24} sm={12} md={8} lg={6} xl={6} key={book.id}>
                  <BookCard
                    book={book}
                    isWishlisted={isWishlisted}
                    onSelect={handleSelectBook}
                    onAddToCart={handleAddToCart}
                    onToggleWishlist={handleToggleWishlist}
                  />
                </Col>
              );
            })}
          </Row>
        )}

        {/* Empty state when no books match query */}
        {!loading && books.length === 0 && !error && (
          <div style={{ textAlign: "center", padding: "60px 0" }}>
            <Empty
              description="No books found matching your current search or topic."
              image={Empty.PRESENTED_IMAGE_SIMPLE}
            >
              <Button
                type="primary"
                onClick={() => {
                  setSearchTerm("");
                  setSelectedTopic("");
                  setSelectedLanguage("all");
                }}
              >
                Reset All Filters
              </Button>
            </Empty>
          </div>
        )}

        {/* Error Alert with Retry button */}
        {error && (
          <div style={{ maxWidth: 600, margin: "32px auto", textAlign: "center" }}>
            <Alert
              message="Failed to load books"
              description={error}
              type="error"
              showIcon
              action={
                <Button
                  size="small"
                  type="primary"
                  danger
                  icon={<ReloadOutlined />}
                  onClick={() => void loadMore()}
                  loading={loading}
                >
                  Retry Loading
                </Button>
              }
            />
          </div>
        )}

        {/* Infinite Scroll Sentinel element */}
        <div ref={sentinelRef} style={{ height: 20 }} />

        {/* Bottom Loading Indicator */}
        <div
          aria-live="polite"
          style={{
            textAlign: "center",
            padding: "30px 0 20px 0",
          }}
        >
          {loading && (
            <div style={{ display: "inline-flex", alignItems: "center", gap: 12 }}>
              <Spin size="default" />
              <span style={{ color: "#595959", fontSize: 14 }}>
                Loading more books from Gutenberg catalog...
              </span>
            </div>
          )}

          {!hasMore && books.length > 0 && (
            <Tag color="default" style={{ padding: "6px 16px", fontSize: 13 }}>
              You have reached the end of the catalog.
            </Tag>
          )}
        </div>
      </Content>

      {/* Footer */}
      <Footer
        style={{
          textAlign: "center",
          backgroundColor: "#ffffff",
          borderTop: "1px solid #f0f0f0",
          padding: "24px 16px",
          color: "#8c8c8c",
        }}
      >
        <BookOutlined style={{ marginRight: 6, color: "#1677ff" }} />
        <strong>BookStore Full Stack</strong> — Next.js · React · TypeScript · Ant Design · MongoDB. Powered by Gutendex Project Gutenberg API.
      </Footer>

      {/* Back to top floating button */}
      <FloatButton.BackTop />

      {/* Modals & Drawers */}
      <BookDetailModal
        book={selectedBook}
        isOpen={isDetailModalOpen}
        isWishlisted={
          selectedBook ? wishlist.some((b) => b.id === selectedBook.id) : false
        }
        onClose={() => setIsDetailModalOpen(false)}
        onAddToCart={handleAddToCart}
        onToggleWishlist={handleToggleWishlist}
      />

      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cart={cart}
        lastRemovedItem={lastRemovedItem}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveFromCart}
        onUndoRemove={handleUndoRemove}
        onClearCart={handleClearCart}
      />

      <WishlistDrawer
        isOpen={isWishlistOpen}
        onClose={() => setIsWishlistOpen(false)}
        wishlist={wishlist}
        onRemoveFromWishlist={handleRemoveFromWishlist}
        onMoveToCart={handleMoveToCart}
      />

      {/* MongoDB Orders Drawer — shows all orders saved in database */}
      <OrdersDrawer
        isOpen={isOrdersOpen}
        onClose={() => setIsOrdersOpen(false)}
      />
    </Layout>
  );
}

