-- Create Categories table
CREATE TABLE categories (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  parent_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Products table
CREATE TABLE products (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  description TEXT,
  category_id UUID REFERENCES categories(id) ON DELETE SET NULL,
  image_url TEXT,
  precio_venta NUMERIC(10,2) DEFAULT NULL,
  tipo_cliente TEXT CHECK (tipo_cliente IN ('normal', 'empresa')) DEFAULT 'normal',
  visible_en_web BOOLEAN DEFAULT false,
  destacado BOOLEAN DEFAULT false,
  sort_order INT DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create Product Colors table
CREATE TABLE product_colors (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  color_name TEXT NOT NULL
);

-- Create Analytics table
CREATE TABLE analytics (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID REFERENCES products(id) ON DELETE CASCADE,
  event_type TEXT CHECK (event_type IN ('view_product', 'add_to_cart', 'send_whatsapp')),
  created_at TIMESTAMPTZ DEFAULT NOW()
);

-- Create storage bucket for product images
-- Note: This usually needs to be done via the Supabase Dashboard or API
-- INSERT INTO storage.buckets (id, name, public) VALUES ('product-images', 'product-images', true);

-- Row Level Security (RLS)

-- Public read access
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);

ALTER TABLE products ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);

ALTER TABLE product_colors ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public read product colors" ON product_colors FOR SELECT USING (true);

-- Analytics: Public insert, Admin read
ALTER TABLE analytics ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Public insert analytics" ON analytics FOR INSERT WITH CHECK (true);
CREATE POLICY "Admin read analytics" ON analytics FOR SELECT USING (auth.role() = 'authenticated');

-- Admin access (Authenticated users)
CREATE POLICY "Admin full access categories" ON categories FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access products" ON products FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access product colors" ON product_colors FOR ALL TO authenticated USING (true);
CREATE POLICY "Admin full access analytics" ON analytics FOR ALL TO authenticated USING (true);
