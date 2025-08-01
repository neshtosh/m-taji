// Core Types for Enhanced M-TAJI System

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'user';
  avatar?: string;
  createdAt: Date;
  lastLogin?: Date;
}

export interface Project {
  id: string;
  title: string;
  description: string;
  category: 'education' | 'healthcare' | 'water' | 'food' | 'infrastructure' | 'emergency';
  location: string;
  targetAmount: number;
  raisedAmount: number;
  status: 'draft' | 'ongoing' | 'completed' | 'paused';
  media: {
    images: string[];
    videos: string[];
  };
  progress: number; // Calculated field
  startDate: Date;
  endDate?: Date;
  createdAt: Date;
  updatedAt: Date;
  updates: ProjectUpdate[];
  expenditures: Expenditure[];
  donations: Donation[];
}

export interface ProjectUpdate {
  id: string;
  projectId: string;
  title: string;
  content: string;
  media?: {
    images: string[];
    videos: string[];
  };
  createdAt: Date;
  authorId: string;
}

export interface Donation {
  id: string;
  amount: number;
  type: 'project' | 'general';
  projectId?: string; // For project-specific donations
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  paymentMethod: 'stripe' | 'paypal' | 'mpesa';
  paymentStatus: 'pending' | 'completed' | 'failed' | 'refunded';
  transactionId?: string;
  message?: string;
  isAnonymous: boolean;
  createdAt: Date;
  expenditures: Expenditure[]; // Linked expenditures
}

export interface Expenditure {
  id: string;
  projectId: string;
  donationId?: string; // Optional link to specific donation
  title: string;
  amount: number;
  date: Date;
  description: string;
  receipt?: string; // URL to receipt image
  category: 'materials' | 'labor' | 'transport' | 'equipment' | 'other';
  createdAt: Date;
  createdBy: string;
}

export interface MicroPost {
  id: string;
  title: string;
  content: string;
  category: 'job' | 'event' | 'news' | 'announcement';
  media?: {
    images: string[];
    videos: string[];
  };
  authorId: string;
  authorName: string;
  isPublished: boolean;
  createdAt: Date;
  updatedAt: Date;
  likes: number;
  shares: number;
}

export interface BlogPost {
  id: string;
  title: string;
  slug: string;
  body: string; // Rich text content
  excerpt: string;
  coverImage: string;
  authorId: string;
  authorName: string;
  tags: string[];
  isPublished: boolean;
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
  readTime: number; // Estimated reading time in minutes
  views: number;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  price: number;
  originalPrice?: number;
  images: string[];
  category: 'clothing' | 'accessories' | 'books' | 'art' | 'other';
  stockQuantity: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface CartItem {
  productId: string;
  quantity: number;
  price: number;
}

export interface Cart {
  id: string;
  userId?: string;
  items: CartItem[];
  total: number;
  createdAt: Date;
  updatedAt: Date;
}

export interface Order {
  id: string;
  userId?: string;
  customerName: string;
  customerEmail: string;
  customerPhone?: string;
  items: CartItem[];
  total: number;
  status: 'pending' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    postalCode: string;
    country: string;
  };
  createdAt: Date;
  updatedAt: Date;
}

export interface Analytics {
  totalFundsRaised: number;
  totalFundsSpent: number;
  totalProjects: number;
  activeProjects: number;
  completedProjects: number;
  totalDonors: number;
  monthlyGrowth: {
    month: string;
    raised: number;
    spent: number;
  }[];
  topProjects: {
    projectId: string;
    title: string;
    raised: number;
    progress: number;
  }[];
  donationMethods: {
    method: string;
    count: number;
    amount: number;
  }[];
}

export interface PaymentConfig {
  stripe: {
    publishableKey: string;
    secretKey: string;
  };
  paypal: {
    clientId: string;
    clientSecret: string;
  };
  mpesa: {
    consumerKey: string;
    consumerSecret: string;
    passkey: string;
    environment: 'sandbox' | 'live';
  };
}

export interface FileUpload {
  id: string;
  filename: string;
  originalName: string;
  url: string;
  size: number;
  mimeType: string;
  uploadedBy: string;
  createdAt: Date;
}

// API Response Types
export interface ApiResponse<T> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Form Types
export interface ProjectFormData {
  title: string;
  description: string;
  category: Project['category'];
  location: string;
  targetAmount: number;
  media: File[];
}

export interface DonationFormData {
  amount: number;
  type: 'project' | 'general';
  projectId?: string;
  donorName: string;
  donorEmail: string;
  donorPhone?: string;
  paymentMethod: Donation['paymentMethod'];
  message?: string;
  isAnonymous: boolean;
}

export interface ExpenditureFormData {
  projectId: string;
  donationId?: string;
  title: string;
  amount: number;
  date: string;
  description: string;
  category: Expenditure['category'];
  receipt?: File;
} 