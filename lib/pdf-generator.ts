import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CartItem } from './types';

export const generatePDF = (items: CartItem[]) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(0, 113, 227); // Apple-like Blue
  doc.text('Cotización - Librería Crayola', 20, 20);

  doc.setFontSize(10);
  doc.setTextColor(100);
  doc.text(`Fecha: ${new Date().toLocaleDateString()}`, 20, 28);
  doc.text('WhatsApp: +506 8446 6444', 20, 33);

  // Table
  const tableData = items.map((item) => [
    item.name,
    item.selectedColor || '-',
    item.quantity.toString(),
  ]);

  autoTable(doc, {
    startY: 45,
    head: [['Producto', 'Color', 'Cantidad']],
    body: tableData,
    headStyles: { fillColor: [0, 113, 227] },
    alternateRowStyles: { fillColor: [245, 245, 247] },
    margin: { left: 20, right: 20 },
  });

  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  doc.setFontSize(8);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      'Esta es una cotización informativa y no representa un compromiso de compra ni reserva de stock.',
      20,
      doc.internal.pageSize.height - 10
    );
  }

  doc.save('cotizacion-libreria-crayola.pdf');
};
