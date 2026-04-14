import { CartItem } from './types';

export const generateWhatsAppLink = (items: CartItem[]) => {
  const phoneNumber = '50684466444';
  let message = 'Hola, quiero cotizar los siguientes productos:\n\n';

  items.forEach((item) => {
    const colorText = item.selectedColor ? ` (Color: ${item.selectedColor})` : '';
    message += `* ${item.name}${colorText} x${item.quantity}\n`;
  });

  message += '\nGracias.';

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};
