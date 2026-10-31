"use client";

import React, { useState } from "react";
import {
  Drawer,
  List,
  Typography,
  Button,
  Space,
  Divider,
  InputNumber,
  Empty,
  Modal,
  Form,
  Input,
  Radio,
  Result,
  Alert,
} from "antd";
import {
  DeleteOutlined,
  UndoOutlined,
  CheckCircleOutlined,
  ShoppingOutlined,
} from "@ant-design/icons";
import { CartItem } from "@/types/book";
import { formatAuthorName, getBookCoverUrl } from "@/utils/helpers";

const { Text, Title } = Typography;

interface CartDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  cart: CartItem[];
  lastRemovedItem: CartItem | null;
  onUpdateQuantity: (bookId: number, quantity: number) => void;
  onRemoveItem: (bookId: number) => void;
  onUndoRemove: () => void;
  onClearCart: () => void;
}

export default function CartDrawer({
  isOpen,
  onClose,
  cart,
  lastRemovedItem,
  onUpdateQuantity,
  onRemoveItem,
  onUndoRemove,
  onClearCart,
}: CartDrawerProps) {
  const [isCheckoutModalOpen, setIsCheckoutModalOpen] = useState(false);
  const [checkoutSuccess, setCheckoutSuccess] = useState(false);
  const [form] = Form.useForm();

  // Calculate total amount
  const subtotal = cart.reduce(
    (total, item) => total + item.price * item.quantity,
    0
  );
  const shipping = subtotal > 35 || subtotal === 0 ? 0 : 4.99;
  const grandTotal = subtotal + shipping;

  const handleCheckoutSubmit = (values: any) => {
    // Simulated checkout completion
    setCheckoutSuccess(true);
  };

  const handleCloseCheckout = () => {
    setIsCheckoutModalOpen(false);
    if (checkoutSuccess) {
      onClearCart();
      setCheckoutSuccess(false);
      onClose();
    }
  };

  return (
    <>
      <Drawer
        title={
          <div style={{ display: "flex", alignItems: "center", gap: 8 }}>
            <ShoppingOutlined style={{ fontSize: 20, color: "#1677ff" }} />
            <span>Shopping Cart ({cart.length} unique items)</span>
          </div>
        }
        placement="right"
        width={450}
        onClose={onClose}
        open={isOpen}
      >
        {/* Undo banner if an item was recently removed */}
        {lastRemovedItem && (
          <Alert
            message={
              <div
                style={{
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <Text ellipsis style={{ maxWidth: 220 }}>
                  Removed: <strong>{lastRemovedItem.book.title}</strong>
                </Text>
                <Button
                  size="small"
                  type="link"
                  icon={<UndoOutlined />}
                  onClick={onUndoRemove}
                >
                  Undo
                </Button>
              </div>
            }
            type="info"
            showIcon
            style={{ marginBottom: 16 }}
          />
        )}

        {cart.length === 0 ? (
          <Empty
            description="Your cart is empty. Discover and add some books!"
            image={Empty.PRESENTED_IMAGE_SIMPLE}
            style={{ marginTop: 60 }}
          >
            <Button type="primary" onClick={onClose}>
              Browse Books
            </Button>
          </Empty>
        ) : (
          <div
            style={{
              display: "flex",
              flexDirection: "column",
              height: "100%",
            }}
          >
            {/* List of cart items */}
            <div style={{ flex: 1, overflowY: "auto", paddingRight: 4 }}>
              <List
                dataSource={cart}
                renderItem={(item) => (
                  <List.Item
                    key={item.book.id}
                    style={{
                      padding: "12px 0",
                      alignItems: "flex-start",
                    }}
                    actions={[
                      <Button
                        key="delete"
                        type="text"
                        danger
                        icon={<DeleteOutlined />}
                        onClick={() => onRemoveItem(item.book.id)}
                      />,
                    ]}
                  >
                    <List.Item.Meta
                      avatar={
                        <img
                          src={getBookCoverUrl(item.book)}
                          alt={item.book.title}
                          style={{
                            width: 50,
                            height: 70,
                            objectFit: "contain",
                            borderRadius: 4,
                            backgroundColor: "#f5f5f5",
                          }}
                        />
                      }
                      title={
                        <Text strong ellipsis style={{ maxWidth: 220, display: "block" }}>
                          {item.book.title}
                        </Text>
                      }
                      description={
                        <div>
                          <Text type="secondary" style={{ fontSize: 12 }}>
                            {item.book.authors[0]
                              ? formatAuthorName(item.book.authors[0].name)
                              : "Author"}
                          </Text>
                          <div
                            style={{
                              marginTop: 6,
                              display: "flex",
                              alignItems: "center",
                              gap: 12,
                            }}
                          >
                            <InputNumber
                              min={1}
                              max={10}
                              size="small"
                              value={item.quantity}
                              onChange={(val) =>
                                onUpdateQuantity(item.book.id, val || 1)
                              }
                            />
                            <Text strong style={{ color: "#1677ff" }}>
                              ${(item.price * item.quantity).toFixed(2)}
                            </Text>
                          </div>
                        </div>
                      }
                    />
                  </List.Item>
                )}
              />
            </div>

            {/* Cart summary & Checkout footer */}
            <div
              style={{
                borderTop: "1px solid #f0f0f0",
                paddingTop: 16,
                marginTop: "auto",
              }}
            >
              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 6,
                }}
              >
                <Text type="secondary">Subtotal:</Text>
                <Text strong>${subtotal.toFixed(2)}</Text>
              </div>

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 8,
                }}
              >
                <Text type="secondary">Shipping:</Text>
                <Text>
                  {shipping === 0 ? (
                    <span style={{ color: "#52c41a" }}>FREE</span>
                  ) : (
                    `$${shipping.toFixed(2)}`
                  )}
                </Text>
              </div>

              <Divider style={{ margin: "10px 0" }} />

              <div
                style={{
                  display: "flex",
                  justifyContent: "space-between",
                  marginBottom: 16,
                }}
              >
                <Title level={4} style={{ margin: 0 }}>
                  Total:
                </Title>
                <Title level={4} style={{ margin: 0, color: "#1677ff" }}>
                  ${grandTotal.toFixed(2)}
                </Title>
              </div>

              <Button
                type="primary"
                block
                size="large"
                onClick={() => setIsCheckoutModalOpen(true)}
              >
                Proceed to Checkout
              </Button>
            </div>
          </div>
        )}
      </Drawer>

      {/* Checkout Modal */}
      <Modal
        title="Quick Order Checkout"
        open={isCheckoutModalOpen}
        onCancel={handleCloseCheckout}
        footer={null}
        destroyOnClose
      >
        {checkoutSuccess ? (
          <Result
            status="success"
            title="Thank You For Your Order!"
            subTitle="Your books have been processed and confirmed. A confirmation receipt has been simulated."
            extra={[
              <Button type="primary" key="back" onClick={handleCloseCheckout}>
                Continue Shopping
              </Button>,
            ]}
          />
        ) : (
          <Form
            form={form}
            layout="vertical"
            initialValues={{ payment: "card" }}
            onFinish={handleCheckoutSubmit}
          >
            <Form.Item
              name="fullName"
              label="Full Name"
              rules={[{ required: true, message: "Please enter your full name" }]}
            >
              <Input placeholder="e.g. Arpit Kumar" />
            </Form.Item>

            <Form.Item
              name="email"
              label="Email Address"
              rules={[
                { required: true, message: "Please enter your email" },
                { type: "email", message: "Please enter a valid email" },
              ]}
            >
              <Input placeholder="arpit@example.com" />
            </Form.Item>

            <Form.Item
              name="address"
              label="Shipping Address"
              rules={[{ required: true, message: "Please enter delivery address" }]}
            >
              <Input.TextArea rows={2} placeholder="Street address, City, ZIP code" />
            </Form.Item>

            <Form.Item name="payment" label="Payment Method">
              <Radio.Group>
                <Radio value="card">Credit / Debit Card</Radio>
                <Radio value="cod">Cash on Delivery</Radio>
                <Radio value="upi">UPI / Net Banking</Radio>
              </Radio.Group>
            </Form.Item>

            <div
              style={{
                background: "#fafafa",
                padding: "10px 14px",
                borderRadius: 6,
                marginBottom: 16,
              }}
            >
              <Text strong>Order Total: </Text>
              <Text strong style={{ color: "#1677ff", fontSize: 16 }}>
                ${grandTotal.toFixed(2)}
              </Text>
            </div>

            <Button type="primary" htmlType="submit" block size="large">
              Place Order (${grandTotal.toFixed(2)})
            </Button>
          </Form>
        )}
      </Modal>
    </>
  );
}
