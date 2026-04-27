import { CartItem } from './types';

export const BRANCHES = {
  liberia: {
    name: 'Liberia',
    phone: '50684466444'
  },
  bagaces: {
    name: 'Bagaces',
    phone: '50686179090'
  }
};

export type BranchId = keyof typeof BRANCHES;

export const generateWhatsAppLink = (items: CartItem[], branchId: BranchId = 'liberia') => {
  const branch = BRANCHES[branchId];
  const phoneNumber = branch.phone;
  
  let message = '*Cotización - Librería Crayola*\n\n';
  message += 'Hola, me gustaría solicitar una cotización para los siguientes productos:\n\n';
  message += '-------------------------------------------\n';
  message += 'DETALLE DEL PEDIDO:\n\n';

  items.forEach((item) => {
    message += `- *${item.name}*\n`;
    if (item.barcode) {
      message += `  Código: ${item.barcode}\n`;
    }
    message += `  Cantidad: ${item.quantity}\n`;
    if (item.selectedColor) {
      message += `  Color: ${item.selectedColor}\n`;
    }
    message += '\n';
  });

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  message += '-------------------------------------------\n\n';
  message += `Total de artículos: ${totalItems}\n`;
  message += `Sucursal: ${branch.name}\n\n`;
  message += 'Muchas gracias.';

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};


