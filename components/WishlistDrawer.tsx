"use client";

import React from "react";
import { Drawer, List, Typography, Button, Space, Empty } from "antd";
import {
  HeartFilled,
  ShoppingCartOutlined,
  DeleteOutlined,
} from "@ant-design/icons";
import { Book } from "@/types/book";
import {
  formatAuthorName,
  getBookCoverUrl,
  getBookPrice,
} from "@/utils/helpers";

const { Text } = Typography;

interface WishlistDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  wishlist: Book[];
  onRemoveFromWishlist: (bookId: number) => void;
  onMoveToCart: (book: Book) => void;
}

export default function WishlistDrawer({
  isOpen,
  onClose,
  wishlist,
  onRemoveFromWishlist,
  onMoveToCart,
}: WishlistDrawerProps) {
  return (
    <Drawer
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <HeartFilled style={{ fontSize: 18, color: "#eb2f96" }} />
          <span>My Saved Wishlist ({wishlist.length})</span>
        </div>
      }
      placement="right"
      width={420}
      onClose={onClose}
      open={isOpen}
    >
      {wishlist.length === 0 ? (
        <Empty
          description="Your wishlist is empty. Click the heart icon on any book to save it!"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ marginTop: 60 }}
        >
          <Button type="primary" onClick={onClose}>
            Explore Books
          </Button>
        </Empty>
      ) : (
        <List
          dataSource={wishlist}
          renderItem={(book) => {
            const price = getBookPrice(book.id);
            return (
              <List.Item
                key={book.id}
                style={{ padding: "12px 0" }}
                actions={[
                  <Button
                    key="cart"
                    size="small"
                    type="primary"
                    icon={<ShoppingCartOutlined />}
                    onClick={() => {
                      onMoveToCart(book);
                    }}
                  >
                    Add
                  </Button>,
                  <Button
                    key="remove"
                    size="small"
                    type="text"
                    danger
                    icon={<DeleteOutlined />}
                    onClick={() => onRemoveFromWishlist(book.id)}
                  />,
                ]}
              >
                <List.Item.Meta
                  avatar={
                    <img
                      src={getBookCoverUrl(book)}
                      alt={book.title}
                      style={{
                        width: 48,
                        height: 68,
                        objectFit: "contain",
                        borderRadius: 4,
                        backgroundColor: "#f5f5f5",
                      }}
                    />
                  }
                  title={
                    <Text strong ellipsis style={{ maxWidth: 190, display: "block" }}>
                      {book.title}
                    </Text>
                  }
                  description={
                    <div>
                      <Text type="secondary" style={{ fontSize: 12 }}>
                        {book.authors[0]
                          ? formatAuthorName(book.authors[0].name)
                          : "Unknown"}
                      </Text>
                      <div style={{ marginTop: 4 }}>
                        <Text strong style={{ color: "#1677ff" }}>
                          ${price.toFixed(2)}
                        </Text>
                      </div>
                    </div>
                  }
                />
              </List.Item>
            );
          }}
        />
      )}
    </Drawer>
  );
}
