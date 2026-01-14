
export type UserRole = 'admin' | 'mod';

export interface User {
  username: string;
  role: UserRole;
  displayName: string;
}

export interface Round {
  id: string;
  name: string;
  startDate: string;
}

export interface Course {
  id: string;
  name: string;
  price: number;
  keywords: string[];
  rounds: Round[];
}

export type Gender = 'male' | 'female';
export type PaymentMethod = 'wallet' | 'instapay' | 'cod';

export interface Sale {
  id: number;
  date: string;
  client: string;
  phone: string;
  email?: string;
  age?: number;
  governorate?: string;
  gender: Gender;
  courseId: string;
  roundId: string;
  paymentMethod: PaymentMethod;
  moderatorName: string;
  platform: string;
  basePrice: number;
  discount: number;
  discountReason?: string;
  finalPrice: number;
  paidAmount: number;
  remainingAmount: number;
  dueDate?: string;
  status: 'paid' | 'partial' | 'withdrawn';
}

export interface AdCampaign {
  id: number;
  date: string;
  campaignName: string;
  courseId: string;
  spend: number;
  leads: number;
  platform: string;
}

export type ViewType = 'landing' | 'settings' | 'moderation' | 'meta' | 'financial' | 'rounds';
export type SubViewType = 'new-sale' | 'database' | 'installments';
