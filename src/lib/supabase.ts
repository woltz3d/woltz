import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.SUPABASE_URL;
const supabaseAnonKey = import.meta.env.SUPABASE_ANON_KEY;

if (!supabaseUrl || !supabaseAnonKey) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// Tipos para TypeScript
export type Collection = {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image_url?: string;
  banner_url?: string;
  status: 'draft' | 'published' | 'archived';
  price_brl?: number;
  price_usd?: number;
  created_at: string;
  updated_at: string;
};

export type Product = {
  id: string;
  collection_id?: string;
  name: string;
  slug: string;
  type: 'set' | 'item' | 'pack';
  description?: string;
  thumbnail_url?: string;
  gallery_urls?: string[];
  file_url?: string;
  file_size?: number;
  price_brl?: number;
  price_usd?: number;
  old_price_brl?: number;
  old_price_usd?: number;
  status: 'draft' | 'published' | 'archived';
  sales_count: number;
  metadata?: Record<string, any>;
  created_at: string;
  updated_at: string;
};

export type Order = {
  id: string;
  customer_email: string;
  customer_name?: string;
  total_brl?: number;
  total_usd?: number;
  currency: string;
  status: 'pending' | 'paid' | 'refunded';
  payment_method?: string;
  items: Array<{
    product_id: string;
    name: string;
    price: number;
    qty: number;
  }>;
  created_at: string;
};

export type ThemeSetting = {
  id: string;
  key: string;
  value?: string;
  section?: string;
  updated_at: string;
};
