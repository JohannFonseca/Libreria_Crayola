export interface Category {
  id: string;
  name: string;
  parent_id: string | null;
  created_at: string;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  category_id: string;
  image_url: string;
  precio_venta: number | null;
  tipo_cliente: 'normal' | 'empresa' | 'ambos';
  visible_en_web: boolean;
  destacado: boolean;
  sort_order: number;
  barcode?: string;
  created_at: string;
  colors?: ProductColor[];
  categories?: Category;
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
