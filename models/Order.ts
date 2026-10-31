import mongoose, { Schema, Document, Model } from "mongoose";

// Interface describing an ordered book item
export interface IOrderItem {
  bookId: number;
  title: string;
  author: string;
  price: number;
  quantity: number;
  coverUrl?: string;
}

// Interface describing the Order document in MongoDB
export interface IOrder extends Document {
  fullName: string;
  email: string;
  address: string;
  paymentMethod: string;
  items: IOrderItem[];
  subtotal: number;
  shipping: number;
  grandTotal: number;
  status: "Confirmed" | "Processing" | "Shipped" | "Delivered";
  createdAt: Date;
  updatedAt: Date;
}

const OrderItemSchema = new Schema<IOrderItem>(
  {
    bookId: { type: Number, required: true },
    title: { type: String, required: true },
    author: { type: String, default: "Unknown Author" },
    price: { type: Number, required: true },
    quantity: { type: Number, required: true, min: 1 },
    coverUrl: { type: String },
  },
  { _id: false }
);

const OrderSchema = new Schema<IOrder>(
  {
    fullName: { type: String, required: true, trim: true },
    email: { type: String, required: true, trim: true, lowercase: true },
    address: { type: String, required: true },
    paymentMethod: { type: String, default: "card" },
    items: { type: [OrderItemSchema], required: true },
    subtotal: { type: Number, required: true },
    shipping: { type: Number, default: 0 },
    grandTotal: { type: Number, required: true },
    status: {
      type: String,
      enum: ["Confirmed", "Processing", "Shipped", "Delivered"],
      default: "Confirmed",
    },
  },
  {
    timestamps: true, // Automatically manages createdAt and updatedAt
  }
);

// Prevent re-compiling model in Next.js hot reloads
const Order: Model<IOrder> =
  mongoose.models.Order || mongoose.model<IOrder>("Order", OrderSchema);

export default Order;

