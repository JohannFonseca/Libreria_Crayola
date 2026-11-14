import { CartItem } from './types';
import { formatCRC } from './formatters';

export const BRANCHES = {
  liberia: {
    name: 'Liberia',
    phone: '50684466444',
    formattedPhone: '+506 8446 6444',
    email: 'Libreriacrayola25@gmail.com',
    label: 'Sucursal'
  },
  bagaces: {
    name: 'Bagaces',
    phone: '50686179090',
    formattedPhone: '+506 8617 9090',
    email: 'libreriacrayolabagaced@gmail.com',
    label: 'Sucursal'
  },
  giovanny: {
    name: 'Giovanny',
    phone: '50688439653',
    formattedPhone: '+506 8843 9653',
    email: 'Libreriacrayola25@gmail.com',
    label: 'Ejecutivo de Ventas'
  }
};

export type BranchId = keyof typeof BRANCHES;

export const generateWhatsAppLink = (items: CartItem[], branchId: BranchId = 'liberia') => {
  const branch = BRANCHES[branchId];
  const phoneNumber = branch.phone;
  
  let message = '*Cotización - Librería Crayola*\n\n';
  message += 'Hola, me gustaría solicitar una cotización formal para los siguientes productos:\n\n';
  message += '-------------------------------------------\n';
  message += 'DETALLE DEL PEDIDO:\n\n';

  let totalPrice = 0;
  let hasPrices = false;

  items.forEach((item) => {
    const itemPrice = item.precio_venta;
    let priceText = '';
    if (itemPrice && itemPrice > 0) {
      hasPrices = true;
      const subtotal = itemPrice * item.quantity;
      totalPrice += subtotal;
      priceText = ` | ${formatCRC(itemPrice)} c/u = *${formatCRC(subtotal)}*`;
    }

    message += `- *${item.name}*\n`;
    message += `  Cantidad: ${item.quantity}${priceText}\n`;
    if (item.barcode) {
      message += `  Código: ${item.barcode}\n`;
    }
    if (item.selectedColor) {
      message += `  Color: ${item.selectedColor}\n`;
    }
    message += '\n';
  });

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  message += '-------------------------------------------\n';
  message += `Total de artículos: ${totalItems} unidades\n`;
  if (hasPrices && totalPrice > 0) {
    message += `*Total estimado:* ${formatCRC(totalPrice)} (IVA incl.)\n`;
  }
  message += '\n';

  if (branchId === 'giovanny') {
    message += `Ejecutivo: ${branch.name}\n`;
    message += `WhatsApp: ${branch.formattedPhone}\n`;
    message += `Correo: ${branch.email}\n\n`;
  } else {
    message += `Sucursal de Retiro/Atención: ${branch.name}\n`;
    message += `WhatsApp: ${branch.formattedPhone}\n`;
    message += `Correo: ${branch.email}\n\n`;
  }
  message += 'Quedo atento a la confirmación de existencias. ¡Muchas gracias!';

  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${phoneNumber}?text=${encodedMessage}`;
};

export const generateMailtoLink = (items: CartItem[], branchId: BranchId = 'liberia') => {
  const branch = BRANCHES[branchId];
  const emailAddress = branch.email;
  
  const subject = `Solicitud de Cotización - Librería Crayola (${branch.name})`;
  
  let body = 'Hola,\n\nMe gustaría solicitar una cotización formal para los siguientes productos:\n\n';
  body += '-------------------------------------------\n';
  body += 'DETALLE DEL PEDIDO:\n\n';

  let totalPrice = 0;
  let hasPrices = false;

  items.forEach((item) => {
    const itemPrice = item.precio_venta;
    let priceText = '';
    if (itemPrice && itemPrice > 0) {
      hasPrices = true;
      const subtotal = itemPrice * item.quantity;
      totalPrice += subtotal;
      priceText = ` | ${formatCRC(itemPrice)} c/u = ${formatCRC(subtotal)}`;
    }

    body += `- ${item.name}\n`;
    body += `  Cantidad: ${item.quantity}${priceText}\n`;
    if (item.barcode) {
      body += `  Código: ${item.barcode}\n`;
    }
    if (item.selectedColor) {
      body += `  Color: ${item.selectedColor}\n`;
    }
    body += '\n';
  });

  const totalItems = items.reduce((acc, item) => acc + item.quantity, 0);

  body += '-------------------------------------------\n';
  body += `Total de artículos: ${totalItems} unidades\n`;
  if (hasPrices && totalPrice > 0) {
    body += `Total estimado: ${formatCRC(totalPrice)} (IVA incl.)\n`;
  }
  body += '\n';

  if (branchId === 'giovanny') {
    body += `Ejecutivo de Ventas: ${branch.name}\n`;
  } else {
    body += `Sucursal de Atención: ${branch.name}\n`;
  }
  body += `WhatsApp: ${branch.formattedPhone}\n`;
  body += `Correo: ${branch.email}\n\n`;
  body += 'Quedo a la espera de su respuesta.\n\nMuchas gracias.';

  const encodedSubject = encodeURIComponent(subject);
  const encodedBody = encodeURIComponent(body);
  return `mailto:${emailAddress}?subject=${encodedSubject}&body=${encodedBody}`;
};
