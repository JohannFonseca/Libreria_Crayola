import { supabase } from '../supabaseClient';

export const trackEvent = async (productId: string, eventType: 'view_product' | 'add_to_cart' | 'send_whatsapp') => {
  try {
    const { error } = await supabase.from('analytics').insert({
      product_id: productId,
      event_type: eventType,
    });
    
    if (error) {
      console.error('Error tracking analytics event:', error.message);
    }
  } catch (e) {
    console.error('Unexpected error in trackEvent:', e);
  }
};
