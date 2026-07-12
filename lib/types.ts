export interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
}

export interface Brand {
  id: string;
  name: string;
  description: string | null;
  logo_url: string | null;
  color: string;
  bg_color: string;
  text_color: string;
  visible_en_web?: boolean;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category_id?: string | null;
  brand_id?: string | null;
  image_url: string;
  precio_venta: number | null;
  tipo_cliente?: 'normal' | 'empresa' | 'ambos';
  visible_en_web: boolean;
  destacado: boolean;
  sort_order: number;
  barcode?: string;
  created_at: string;
  colors?: ProductColor[];
  categories?: Category;
  brands?: Brand;
}

export interface ProductColor {
  id: string;
  product_id: string;
  color_name: string;
}

export interface AnalyticsEvent {
  id: string;
  product_id: string;
  event_type: 'view_product' | 'add_to_cart' | 'send_whatsapp';
  created_at: string;
}

export interface CartItem extends Product {
  quantity: number;
  selectedColor?: string;
}
