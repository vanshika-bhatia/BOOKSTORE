"use client";

import React from "react";
import { Card, Typography, Button, Tag, Space, Tooltip } from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
  DownloadOutlined,
  EyeOutlined,
} from "@ant-design/icons";
import { Book } from "@/types/book";
import {
  formatAuthorName,
  getBookCoverUrl,
  getBookPrice,
} from "@/utils/helpers";

const { Text, Title } = Typography;

interface BookCardProps {
  book: Book;
  isWishlisted: boolean;
  onSelect: (book: Book) => void;
  onAddToCart: (book: Book) => void;
  onToggleWishlist: (book: Book) => void;
}

export default function BookCard({
  book,
  isWishlisted,
  onSelect,
  onAddToCart,
  onToggleWishlist,
}: BookCardProps) {
  const price = getBookPrice(book.id);
  const coverUrl = getBookCoverUrl(book);
  const authorName = book.authors[0]
    ? formatAuthorName(book.authors[0].name)
    : "Unknown Author";

  return (
    <Card
      hoverable
      className="book-card-item"
      style={{
        display: "flex",
        flexDirection: "column",
        height: "100%",
        borderRadius: 8,
        overflow: "hidden",
      }}
      bodyStyle={{
        display: "flex",
        flexDirection: "column",
        flex: 1,
        padding: 14,
      }}
      cover={
        <div
          className="book-cover-wrapper"
          onClick={() => onSelect(book)}
          style={{ cursor: "pointer", position: "relative" }}
        >
          {/* Wishlist toggle button on top right of cover */}
          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleWishlist(book);
            }}
            style={{
              position: "absolute",
              top: 8,
              right: 8,
              border: "none",
              borderRadius: "50%",
              width: 32,
              height: 32,
              backgroundColor: "rgba(255, 255, 255, 0.9)",
              cursor: "pointer",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: 16,
              boxShadow: "0 2px 6px rgba(0,0,0,0.15)",
              zIndex: 2,
            }}
            title={isWishlisted ? "Remove from Wishlist" : "Add to Wishlist"}
          >
            {isWishlisted ? (
              <HeartFilled style={{ color: "#eb2f96" }} />
            ) : (
              <HeartOutlined style={{ color: "#595959" }} />
            )}
          </button>

          {/* Book Cover Image */}
          <img
            src={coverUrl}
            alt={`Cover of ${book.title}`}
            className="book-cover-img"
            loading="lazy"
            onError={(e) => {
              // Fallback image if gutendex cover fails to load
              (e.target as HTMLImageElement).src =
                "https://images.unsplash.com/photo-1544716278-ca5e3f4abd8c?auto=format&fit=crop&w=400&q=80";
            }}
          />
        </div>
      }
    >
      {/* Book Metadata */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column" }}>
        {/* Book Title */}
        <Tooltip title={book.title}>
          <Title
            level={5}
            ellipsis={{ rows: 2 }}
            style={{
              marginBottom: 4,
              fontSize: 15,
              fontWeight: 600,
              cursor: "pointer",
            }}
            onClick={() => onSelect(book)}
          >
            {book.title}
          </Title>
        </Tooltip>

        {/* Author */}
        <Text
          type="secondary"
          ellipsis
          style={{ fontSize: 13, marginBottom: 8, display: "block" }}
        >
          by {authorName}
        </Text>

        {/* Badges: Downloads & Primary Subject */}
        <div style={{ marginBottom: 12 }}>
          <Space size={[4, 4]} wrap>
            <Tag icon={<DownloadOutlined />} color="default">
              {book.download_count.toLocaleString()} reads
            </Tag>
            {book.subjects && book.subjects.length > 0 && (
              <Tag color="blue">
                {book.subjects[0].split("--")[0].trim().slice(0, 18)}
              </Tag>
            )}
          </Space>
        </div>
      </div>

      {/* Price & Action Buttons */}
      <div
        style={{
          borderTop: "1px solid #f0f0f0",
          paddingTop: 10,
          marginTop: "auto",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 8,
        }}
      >
        <span
          style={{
            fontSize: 16,
            fontWeight: 700,
            color: "#1677ff",
          }}
        >
          ${price.toFixed(2)}
        </span>

        <Space size={6}>
          <Button
            size="small"
            icon={<EyeOutlined />}
            onClick={() => onSelect(book)}
          >
            Details
          </Button>
          <Button
            size="small"
            type="primary"
            icon={<ShoppingCartOutlined />}
            onClick={() => onAddToCart(book)}
          >
            Add
          </Button>
        </Space>
      </div>
    </Card>
  );
}
