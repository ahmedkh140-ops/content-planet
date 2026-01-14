
import { Course } from './types';

export const DEFAULT_COURSES: Course[] = [
  { id: 'content', name: "Content", price: 3200, keywords: ["content"], rounds: [] },
  { id: 'script', name: "Script", price: 3900, keywords: ["script"], rounds: [] },
  { id: 'branding', name: "Branding", price: 3900, keywords: ["branding"], rounds: [] },
  { id: 'media', name: "Media Buying", price: 1600, keywords: ["media"], rounds: [] },
  { id: 'montage', name: "Montage", price: 3600, keywords: ["montage"], rounds: [] },
  { id: 'reels', name: "Reels", price: 3100, keywords: ["reels"], rounds: [] }
];

export const PLATFORMS = ["Facebook", "Instagram", "TikTok", "Other"];

export const GOVERNORATES = [
  "القاهرة", "الجيزة", "الإسكندرية", "القليوبية", "الدقهلية", "الغربية", 
  "الشرقية", "المنوفية", "دمياط", "كفر الشيخ", "البحيرة", "الإسماعيلية", 
  "بورسعيد", "السويس", "الفيوم", "بني سويف", "المنيا", "أسيوط", 
  "سوهاج", "قنا", "الأقصر", "أسوان", "البحر الأحمر", "الوادي الجديد", 
  "مطروح", "شمال سيناء", "جنوب سيناء"
];

export const PAYMENT_METHODS = [
  { id: 'wallet', label: 'محفظة إلكترونية' },
  { id: 'instapay', label: 'InstaPay' },
  { id: 'cod', label: 'COD - تحصيل منزلي' }
];
