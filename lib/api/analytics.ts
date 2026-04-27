import { supabase } from '../supabaseClient';

export const trackEvent = async (productId: string, eventType: 'view_product' | 'add_to_cart' | 'send_whatsapp') => {
  // Analíticas deshabilitadas
  return;
};

export const getAnalyticsStats = async () => {
  const { data, error } = await supabase.from('analytics').select('event_type');
  if (error) throw error;
  
  const stats = { view: 0, cart: 0, whatsapp: 0 };
  data.forEach((row) => {
    if (row.event_type === 'view_product') stats.view++;
    if (row.event_type === 'add_to_cart') stats.cart++;
    if (row.event_type === 'send_whatsapp') stats.whatsapp++;
  });
  
  // also get active products count (only visible)
  const { count: productsCount } = await supabase
    .from('products')
    .select('*', { count: 'exact', head: true })
    .eq('visible_en_web', true);
  
  return { ...stats, products: productsCount || 0 };
};

export const getPopularProducts = async () => {
  // We'll fetch all events and group them manually since Supabase standard JS client 
  // doesn't support complex group by unless using RPC.
  const { data: events, error } = await supabase.from('analytics')
    .select('product_id, products(name, categories(name))')
    .eq('event_type', 'view_product');
    
  if (error) throw error;
  
  const counts: Record<string, { count: number, name: string, category: string }> = {};
  events?.forEach((e: any) => {
    if (!e.product_id) return;
    if (!counts[e.product_id]) {
      counts[e.product_id] = { 
        count: 0, 
        name: e.products?.name || 'Unknown', 
        category: e.products?.categories?.name || 'Varios' 
      };
    }
    counts[e.product_id].count++;
  });
  
  return Object.values(counts)
    .sort((a, b) => b.count - a.count)
    .slice(0, 5);
};

export const getRecentActivity = async () => {
  const { data, error } = await supabase.from('analytics')
    .select('event_type, created_at, products(name)')
    .order('created_at', { ascending: false })
    .limit(5);
    
  if (error) throw error;
  return data;
};
