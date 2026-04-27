import { supabase } from '../supabaseClient';
import { Product } from '../types';

// Obtiene SOLO los productos visibles y con precio (para el frontend público)
export const getPublicProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*), product_colors(*)')
    .eq('visible_en_web', true)
    .not('precio_venta', 'is', null)
    .order('sort_order', { ascending: true })
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching public products:', error.message);
    throw error;
  }
  return data;
};

// Obtiene los productos con paginación (para el panel admin)
export const getAllProductsAdmin = async (from = 0, to = 199) => {
  const { data, error, count } = await supabase
    .from('products')
    .select('*, categories(*), product_colors(*)', { count: 'exact' })
    .order('created_at', { ascending: false })
    .range(from, to);

  if (error) {
    console.error('Error fetching admin products:', error.message);
    throw error;
  }
  return { products: data as Product[], count: count || 0 };
};

export const getProductById = async (id: string) => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*), product_colors(*)')
    .eq('id', id)
    .single();

  if (error) {
    console.error(`Error fetching product ${id}:`, error.message);
    throw error;
  }
  return data;
};

export const createProduct = async (productData: any) => {
  const { data, error } = await supabase
    .from('products')
    .insert(productData)
    .select()
    .single();

  if (error) {
    console.error('Error creating product:', error.message);
    throw error;
  }
  return data;
};

export const updateProduct = async (id: string, productData: any) => {
  const { data, error } = await supabase
    .from('products')
    .update(productData)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating product ${id}:`, error.message);
    throw error;
  }
  return data;
};

// Actualización parcial (para edición inline en admin)
export const updateProductInline = async (id: string, updates: Partial<Product>) => {
  const { data, error } = await supabase
    .from('products')
    .update(updates)
    .eq('id', id)
    .select()
    .single();

  if (error) {
    console.error(`Error inline updating product ${id}:`, error.message);
    throw error;
  }
  return data;
};

export const toggleVisibility = async (id: string, visible: boolean) => {
  return updateProductInline(id, { visible_en_web: visible });
};

export const deleteProduct = async (id: string) => {
  const { error } = await supabase
    .from('products')
    .delete()
    .eq('id', id);

  if (error) {
    console.error(`Error deleting product ${id}:`, error.message);
    throw error;
  }
  return true;
};
