"use client";

import React from "react";
import { Modal, Typography, Button, Tag, Space, Divider, Row, Col } from "antd";
import {
  ShoppingCartOutlined,
  HeartOutlined,
  HeartFilled,
  ReadOutlined,
  DownloadOutlined,
  GlobalOutlined,
} from "@ant-design/icons";
import { Book } from "@/types/book";
import {
  formatAuthorName,
  getBookCoverUrl,
  getBookPrice,
  getBookReadUrl,
} from "@/utils/helpers";

const { Title, Paragraph, Text } = Typography;

interface BookDetailModalProps {
  book: Book | null;
  isOpen: boolean;
  isWishlisted: boolean;
  onClose: () => void;
  onAddToCart: (book: Book) => void;
  onToggleWishlist: (book: Book) => void;
}

export default function BookDetailModal({
  book,
  isOpen,
  isWishlisted,
  onClose,
  onAddToCart,
  onToggleWishlist,
}: BookDetailModalProps) {
  if (!book) return null;

  const price = getBookPrice(book.id);
  const coverUrl = getBookCoverUrl(book);
  const readUrl = getBookReadUrl(book);

  return (
    <Modal
      open={isOpen}
      onCancel={onClose}
      footer={null}
      width={720}
      centered
      title="Book Information"
    >
      <Row gutter={[24, 24]} style={{ marginTop: 12 }}>
        {/* Cover Column */}
        <Col xs={24} sm={9} style={{ textAlign: "center" }}>
          <div
            style={{
              borderRadius: 8,
              overflow: "hidden",
              boxShadow: "0 6px 16px rgba(0, 0, 0, 0.12)",
              backgroundColor: "#f5f5f5",
              display: "inline-block",
              maxHeight: 320,
            }}
          >
            <img
              src={coverUrl}
              alt={book.title}
              style={{
                width: "100%",
                maxWidth: 220,
                height: 300,
                objectFit: "contain",
                display: "block",
              }}
            />
          </div>

          <div style={{ marginTop: 16 }}>
            <span
              style={{
                fontSize: 24,
                fontWeight: 700,
                color: "#1677ff",
                display: "block",
                marginBottom: 10,
              }}
            >
              ${price.toFixed(2)}
            </span>

            <Space direction="vertical" style={{ width: "100%" }}>
              <Button
                type="primary"
                block
                size="large"
                icon={<ShoppingCartOutlined />}
                onClick={() => {
                  onAddToCart(book);
                  onClose();
                }}
              >
                Add to Cart
              </Button>

              <Button
                block
                icon={
                  isWishlisted ? (
                    <HeartFilled style={{ color: "#eb2f96" }} />
                  ) : (
                    <HeartOutlined />
                  )
                }
                onClick={() => onToggleWishlist(book)}
              >
                {isWishlisted ? "In Wishlist" : "Save to Wishlist"}
              </Button>
            </Space>
          </div>
        </Col>

        {/* Details Column */}
        <Col xs={24} sm={15}>
          <Title level={3} style={{ marginBottom: 6 }}>
            {book.title}
          </Title>

          {/* Authors */}
          <Paragraph type="secondary" style={{ fontSize: 15, marginBottom: 16 }}>
            By{" "}
            {book.authors.length > 0
              ? book.authors
                  .map((a) => {
                    const years =
                      a.birth_year || a.death_year
                        ? ` (${a.birth_year || "?"}–${a.death_year || "?"})`
                        : "";
                    return `${formatAuthorName(a.name)}${years}`;
                  })
                  .join(", ")
              : "Unknown Author"}
          </Paragraph>

          <Space size="middle" wrap style={{ marginBottom: 16 }}>
            <Tag icon={<DownloadOutlined />} color="cyan">
              {book.download_count.toLocaleString()} Downloads
            </Tag>
            <Tag icon={<GlobalOutlined />} color="geekblue">
              Language: {book.languages.join(", ").toUpperCase()}
            </Tag>
            <Tag color="purple">Gutenberg ID #{book.id}</Tag>
          </Space>

          <Divider style={{ margin: "12px 0" }} />

          {/* Subjects / Genres */}
          <div style={{ marginBottom: 16 }}>
            <Text strong style={{ display: "block", marginBottom: 6 }}>
              Subjects & Topics:
            </Text>
            <div style={{ maxHeight: 110, overflowY: "auto" }}>
              <Space size={[4, 6]} wrap>
                {book.subjects && book.subjects.length > 0 ? (
                  book.subjects.map((subj, idx) => (
                    <Tag key={idx} color="default">
                      {subj}
                    </Tag>
                  ))
                ) : (
                  <Text type="secondary">General Literature</Text>
                )}
              </Space>
            </div>
          </div>

          {/* Read Online Button if available */}
          {readUrl && (
            <div style={{ marginTop: 20 }}>
              <Button
                type="dashed"
                icon={<ReadOutlined />}
                href={readUrl}
                target="_blank"
                rel="noopener noreferrer"
              >
                Read Free Online Ebook
              </Button>
            </div>
          )}
        </Col>
      </Row>
    </Modal>
  );
}
