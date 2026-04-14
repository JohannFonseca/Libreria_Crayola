import { supabase } from '../supabaseClient';
import { Product } from '../types';

export const getProducts = async () => {
  const { data, error } = await supabase
    .from('products')
    .select('*, categories(*), product_colors(*)')
    .order('created_at', { ascending: false });

  if (error) {
    console.error('Error fetching products:', error.message);
    throw error;
  }
  return data;
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
