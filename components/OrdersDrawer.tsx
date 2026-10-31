"use client";

import React, { useEffect, useState } from "react";
import {
  Drawer,
  List,
  Typography,
  Tag,
  Button,
  Spin,
  Alert,
  Divider,
  Empty,
  Space,
} from "antd";
import {
  ShoppingOutlined,
  ReloadOutlined,
  DatabaseOutlined,
  CheckCircleOutlined,
} from "@ant-design/icons";

const { Text, Title } = Typography;

interface OrderItem {
  bookId: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
  coverUrl?: string;
}

interface OrderRecord {
  _id: string;
  fullName: string;
  email: string;
  address: string;
  paymentMethod: string;
  items: OrderItem[];
  subtotal: number;
  shipping: number;
  grandTotal: number;
  status: string;
  createdAt: string;
}

interface OrdersDrawerProps {
  isOpen: boolean;
  onClose: () => void;
}

export default function OrdersDrawer({ isOpen, onClose }: OrdersDrawerProps) {
  const [orders, setOrders] = useState<OrderRecord[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Fetch orders from MongoDB via Next.js backend API
  const fetchOrders = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch("/api/orders");
      const data = await res.json();
      if (!res.ok || !data.success) {
        throw new Error(data.error || "Failed to load orders from MongoDB.");
      }
      setOrders(data.orders || []);
    } catch (err: any) {
      setError(err.message || "Could not connect to database.");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (isOpen) {
      void fetchOrders();
    }
  }, [isOpen]);

  return (
    <Drawer
      title={
        <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
          <DatabaseOutlined style={{ fontSize: 20, color: "#52c41a" }} />
          <span>MongoDB Database Orders</span>
        </div>
      }
      placement="right"
      width={500}
      onClose={onClose}
      open={isOpen}
      extra={
        <Button
          size="small"
          icon={<ReloadOutlined />}
          onClick={fetchOrders}
          loading={loading}
        >
          Refresh
        </Button>
      }
    >
      {/* Alert notice if error occurs */}
      {error && (
        <Alert
          type="warning"
          showIcon
          message="MongoDB Connection Status"
          description={
            <div>
              <p style={{ margin: "4px 0" }}>{error}</p>
              <Text type="secondary" style={{ fontSize: 12 }}>
                Make sure your <code>.env</code> file has a valid <code>MONGODB_URI</code>{" "}
                string.
              </Text>
            </div>
          }
          style={{ marginBottom: 16 }}
        />
      )}

      {loading && orders.length === 0 ? (
        <div style={{ textAlign: "center", padding: "60px 0" }}>
          <Spin size="large" />
          <p style={{ marginTop: 12, color: "#8c8c8c" }}>
            Querying orders from MongoDB...
          </p>
        </div>
      ) : orders.length === 0 && !error ? (
        <Empty
          description="No orders saved in MongoDB yet. Place an order through checkout to see it recorded here!"
          image={Empty.PRESENTED_IMAGE_SIMPLE}
          style={{ marginTop: 60 }}
        />
      ) : (
        <List
          dataSource={orders}
          renderItem={(order) => {
            const dateStr = new Date(order.createdAt).toLocaleDateString(undefined, {
              year: "numeric",
              month: "short",
              day: "numeric",
              hour: "2-digit",
              minute: "2-digit",
            });

            return (
              <div
                key={order._id}
                style={{
                  backgroundColor: "#fafafa",
                  border: "1px solid #e8e8e8",
                  borderRadius: 8,
                  padding: 16,
                  marginBottom: 16,
                }}
              >
                {/* Header: Order ID & Status */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: 8,
                  }}
                >
                  <Text strong style={{ fontSize: 13 }}>
                    Order #{order._id.slice(-6).toUpperCase()}
                  </Text>
                  <Tag color="green" icon={<CheckCircleOutlined />}>
                    {order.status}
                  </Tag>
                </div>

                {/* Customer Details */}
                <div style={{ fontSize: 12, color: "#595959", marginBottom: 10 }}>
                  <div>
                    <strong>Customer:</strong> {order.fullName} ({order.email})
                  </div>
                  <div>
                    <strong>Date:</strong> {dateStr}
                  </div>
                  <div>
                    <strong>Shipping to:</strong> {order.address}
                  </div>
                </div>

                <Divider style={{ margin: "8px 0" }} />

                {/* Items in order */}
                <div style={{ marginBottom: 10 }}>
                  <Text strong style={{ fontSize: 12 }}>
                    Items:
                  </Text>
                  {order.items.map((item, idx) => (
                    <div
                      key={idx}
                      style={{
                        display: "flex",
                        justifyContent: "space-between",
                        fontSize: 13,
                        marginTop: 4,
                      }}
                    >
                      <span style={{ maxWidth: 280 }} className="truncate">
                        {item.quantity}x {item.title}
                      </span>
                      <span style={{ color: "#1677ff", fontWeight: 600 }}>
                        ${(item.price * item.quantity).toFixed(2)}
                      </span>
                    </div>
                  ))}
                </div>

                <Divider style={{ margin: "8px 0" }} />

                {/* Total */}
                <div
                  style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                  }}
                >
                  <Text type="secondary" style={{ fontSize: 12 }}>
                    Payment: {order.paymentMethod.toUpperCase()}
                  </Text>
                  <Text strong style={{ fontSize: 15, color: "#1677ff" }}>
                    Total: ${order.grandTotal.toFixed(2)}
                  </Text>
                </div>
              </div>
            );
          }}
        />
      )}
    </Drawer>
  );
}

