import { Address, Book, CartItem, Order, OrderStatus, Review, User } from '@/types';
import type { IBook } from '@/models/Book';
import type { IOrder } from '@/models/Order';
import type { IUser } from '@/models/User';

type BookRecord = Partial<IBook> & Record<string, unknown>;
type ReviewRecord = Partial<Review> & Record<string, unknown>;
type AddressRecord = Partial<Address> & Record<string, unknown>;
type UserRecord = Partial<IUser> & Record<string, unknown>;
type OrderRecord = Partial<IOrder> & Record<string, unknown>;

export function mapBook(book: IBook | BookRecord): Book {
  const data = book as BookRecord;

  return {
    id: String(data.id || data._id || ''),
    isbn: String(data.isbn || ''),
    title: String(data.title || ''),
    author: String(data.author || ''),
    price: Number(data.price) || 0,
    originalPrice:
      data.originalPrice !== undefined && data.originalPrice !== null
        ? Number(data.originalPrice)
        : undefined,
    rating: Number(data.rating) || 4.5,
    reviewCount:
      data.reviewCount !== undefined ? Number(data.reviewCount) : ((Array.isArray(data.reviews) ? data.reviews : []).length || 0),
    reviews: Array.isArray(data.reviews) ? (data.reviews as ReviewRecord[]).map(mapReview) : [],
    genre: (data.genre as Book['genre']) || 'Classic',
    stock: Number(data.stock) || 0,
    coverImage: String(data.coverImage || ''),
    description: String(data.description || ''),
    publishedYear: Number(data.publishedYear) || new Date().getFullYear(),
    language: String(data.language || 'English'),
    pages: data.pages !== undefined && data.pages !== null ? Number(data.pages) : undefined,
    publisher: data.publisher ? String(data.publisher) : undefined,
    badge: data.badge ? String(data.badge) : undefined,
  };
}

function mapReview(review: ReviewRecord): Review {
  return {
    id: String(review.id || review._id || ''),
    user: String(review.user || 'Reader'),
    initials: String(review.initials || (review.user ? String(review.user).slice(0, 2).toUpperCase() : 'R')),
    rating: Number(review.rating) || 5,
    comment: String(review.comment || ''),
    date: String(review.date || ''),
  };
}

function mapAddress(address: AddressRecord): Address {
  return {
    id: String(address.id || address._id || ''),
    type: String(address.type || 'Home'),
    fullName: String(address.fullName || ''),
    mobile: String(address.mobile || ''),
    pincode: address.pincode ? String(address.pincode) : undefined,
    locality: address.locality ? String(address.locality) : undefined,
    address: String(address.address || ''),
    city: String(address.city || ''),
    state: String(address.state || ''),
    landmark: address.landmark ? String(address.landmark) : undefined,
  };
}

export function sanitizeUser(user: IUser | UserRecord): User {
  const data = user as UserRecord;

  return {
    id: data._id ? String(data._id) : String(data.id || ''),
    name: String(data.name || ''),
    email: String(data.email || ''),
    role: data.role === 'admin' ? 'admin' : 'customer',
    isEmailVerified: Boolean(data.isEmailVerified),
    createdAt: data.createdAt instanceof Date ? data.createdAt.toISOString().split('T')[0] : String(data.createdAt || ''),
    mobile: data.mobile ? String(data.mobile) : undefined,
    addresses: Array.isArray(data.addresses) ? (data.addresses as AddressRecord[]).map(mapAddress) : [],
    wishlist: Array.isArray(data.wishlist) ? data.wishlist.map(String) : [],
  };
}

export function mapOrder(order: IOrder | OrderRecord): Order {
  const data = order as OrderRecord;
  const createdAtValue = (data.createdAt ?? new Date()) as string | number | Date;
  let items: CartItem[] = [];

  if (Array.isArray(data.items)) {
    items = data.items as CartItem[];
  } else if (typeof data.itemsJson === 'string') {
    try {
      items = JSON.parse(data.itemsJson as string) as CartItem[];
    } catch {
      items = [];
    }
  }

  return {
    id: String(data.id || data._id || ''),
    customerName: String(data.customerName || ''),
    customerEmail: String(data.customerEmail || ''),
    shippingAddress: String(data.shippingAddress || ''),
    items,
    totalAmount: Number(data.totalAmount) || 0,
    status: (data.status || 'Pending') as OrderStatus,
    createdAt:
      typeof data.createdAt === 'string'
        ? data.createdAt
        : new Date(createdAtValue).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
    orderDate:
      data.orderDate ||
      (data.createdAt ? new Date(createdAtValue).toLocaleDateString('en-US', { month: 'long', day: 'numeric' }) : undefined),
    queuePosition: Number(data.queuePosition) || 1,
    userId: data.userId ? String(data.userId) : undefined,
  };
}
