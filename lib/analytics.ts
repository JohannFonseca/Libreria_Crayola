import { supabase } from './supabase';

export const trackEvent = async (productId: string, eventType: 'view_product' | 'add_to_cart' | 'send_whatsapp') => {
  try {
    const { error } = await supabase.from('analytics').insert({
      product_id: productId,
      event_type: eventType,
    });
    if (error) console.error('Error tracking event:', error);
  } catch (e) {
    console.error('Analytics error:', e);
  }
};
