-- Migración para añadir campos del catálogo curado
ALTER TABLE products 
  ADD COLUMN IF NOT EXISTS precio_venta NUMERIC(10,2) DEFAULT NULL,
  ADD COLUMN IF NOT EXISTS tipo_cliente TEXT CHECK (tipo_cliente IN ('normal', 'empresa', 'ambos')) DEFAULT 'ambos',
  ADD COLUMN IF NOT EXISTS visible_en_web BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS destacado BOOLEAN DEFAULT false,
  ADD COLUMN IF NOT EXISTS sort_order INT DEFAULT 0;
