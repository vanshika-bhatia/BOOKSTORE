"use client";

import React from "react";
import { Layout, Input, Badge, Button, Space, Tag } from "antd";
import {
  BookOutlined,
  ShoppingCartOutlined,
  HeartOutlined,
  SearchOutlined,
} from "@ant-design/icons";

const { Header } = Layout;

interface NavbarProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  selectedTopic: string;
  onTopicSelect: (topic: string) => void;
  cartCount: number;
  cartTotal: number;
  wishlistCount: number;
  onOpenCart: () => void;
  onOpenWishlist: () => void;
}

const CATEGORIES = [
  { key: "", label: "All Books" },
  { key: "fiction", label: "Fiction" },
  { key: "mystery", label: "Mystery" },
  { key: "philosophy", label: "Philosophy" },
  { key: "science", label: "Science" },
  { key: "history", label: "History" },
  { key: "poetry", label: "Poetry" },
  { key: "children", label: "Children" },
];

export default function Navbar({
  searchTerm,
  onSearchChange,
  selectedTopic,
  onTopicSelect,
  cartCount,
  cartTotal,
  wishlistCount,
  onOpenCart,
  onOpenWishlist,
}: NavbarProps) {
  return (
    <Header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        backgroundColor: "#ffffff",
        borderBottom: "1px solid #f0f0f0",
        padding: "0 24px",
        height: "auto",
        lineHeight: "normal",
        boxShadow: "0 2px 8px rgba(0, 0, 0, 0.05)",
      }}
    >
      <div
        style={{
          maxWidth: 1280,
          margin: "0 auto",
          padding: "12px 0",
        }}
      >
        {/* Top Bar: Brand, Search, Action Buttons */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            flexWrap: "wrap",
            gap: 16,
          }}
        >
          {/* Logo & Brand */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
            }}
            onClick={() => {
              onSearchChange("");
              onTopicSelect("");
            }}
          >
            <div
              style={{
                width: 38,
                height: 38,
                borderRadius: 8,
                backgroundColor: "#1677ff",
                color: "#fff",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 20,
              }}
            >
              <BookOutlined />
            </div>
            <div>
              <div
                style={{
                  fontSize: 20,
                  fontWeight: 700,
                  color: "#1f1f1f",
                  lineHeight: 1.2,
                }}
              >
                BookStore
              </div>
              <div style={{ fontSize: 11, color: "#8c8c8c" }}>
                Infinite Gutenberg Catalog
              </div>
            </div>
          </div>

          {/* Search Box */}
          <div style={{ flex: 1, maxWidth: 500, minWidth: 260 }}>
            <Input.Search
              placeholder="Search title, author, or subject..."
              allowClear
              enterButton={<SearchOutlined />}
              size="middle"
              value={searchTerm}
              onChange={(e) => onSearchChange(e.target.value)}
              onSearch={(value) => onSearchChange(value)}
              style={{ width: "100%" }}
            />
          </div>

          {/* User actions: Wishlist & Cart */}
          <Space size="middle">
            <Badge count={wishlistCount} offset={[-2, 5]} color="#eb2f96">
              <Button
                icon={<HeartOutlined style={{ color: "#eb2f96" }} />}
                onClick={onOpenWishlist}
              >
                Wishlist
              </Button>
            </Badge>

            <Badge count={cartCount} offset={[-2, 5]} color="#1677ff">
              <Button
                type="primary"
                icon={<ShoppingCartOutlined />}
                onClick={onOpenCart}
              >
                Cart ({`$${cartTotal.toFixed(2)}`})
              </Button>
            </Badge>
          </Space>
        </div>

        {/* Category Filter Chips */}
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 8,
            overflowX: "auto",
            paddingTop: 10,
            paddingBottom: 2,
            scrollbarWidth: "none",
          }}
        >
          <span
            style={{
              fontSize: 13,
              fontWeight: 600,
              color: "#595959",
              marginRight: 4,
            }}
          >
            Filter:
          </span>
          {CATEGORIES.map((cat) => {
            const isSelected = selectedTopic === cat.key;
            return (
              <Tag.CheckableTag
                key={cat.key || "all"}
                checked={isSelected}
                onChange={() => onTopicSelect(cat.key)}
                style={{
                  fontSize: 13,
                  padding: "4px 12px",
                  borderRadius: 16,
                  cursor: "pointer",
                  border: isSelected
                    ? "1px solid #1677ff"
                    : "1px solid #d9d9d9",
                  background: isSelected ? "#e6f4ff" : "#fafafa",
                  color: isSelected ? "#1677ff" : "#595959",
                }}
              >
                {cat.label}
              </Tag.CheckableTag>
            );
          })}
        </div>
      </div>
    </Header>
  );
}
