import { NextResponse } from "next/server";
import { connectToDatabase } from "@/lib/mongodb";
import Order from "@/models/Order";

// GET /api/orders - Fetch all orders from MongoDB
export async function GET() {
  try {
    await connectToDatabase();
    const orders = await Order.find().sort({ createdAt: -1 }).limit(50).lean();
    return NextResponse.json({ success: true, orders });
  } catch (error: any) {
    console.error("Error fetching orders:", error.message);
    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to fetch orders from MongoDB.",
      },
      { status: 500 }
    );
  }
}

// POST /api/orders - Save a new order to MongoDB
export async function POST(request: Request) {
  try {
    const body = await request.json();
    const { fullName, email, address, paymentMethod, items, subtotal, shipping, grandTotal } =
      body;

    // Basic validation
    if (!fullName || !email || !address || !items || items.length === 0) {
      return NextResponse.json(
        {
          success: false,
          error: "Missing required order fields (name, email, address, or items).",
        },
        { status: 400 }
      );
    }

    // Connect to MongoDB
    await connectToDatabase();

    // Create and save new order
    const newOrder = await Order.create({
      fullName,
      email,
      address,
      paymentMethod: paymentMethod || "card",
      items,
      subtotal,
      shipping: shipping || 0,
      grandTotal,
      status: "Confirmed",
    });

    return NextResponse.json(
      {
        success: true,
        message: "Order placed and saved to MongoDB successfully!",
        order: newOrder,
      },
      { status: 201 }
    );
  } catch (error: any) {
    console.error("Error creating order:", error.message);

    // Provide friendly error if MongoDB credentials are placeholder
    if (error.message && error.message.includes(".env")) {
      return NextResponse.json(
        {
          success: false,
          error:
            "MongoDB is not configured yet. Please open the .env file and paste your MongoDB connection string.",
        },
        { status: 500 }
      );
    }

    return NextResponse.json(
      {
        success: false,
        error: error.message || "Failed to save order to MongoDB.",
      },
      { status: 500 }
    );
  }
}

