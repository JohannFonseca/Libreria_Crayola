import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CartItem } from './types';

export const generatePDF = (items: CartItem[]) => {
  const doc = new jsPDF();

  // Header
  doc.setFontSize(22);
  doc.setTextColor(0, 113, 227); // Brand Primary Blue
  doc.setFont('helvetica', 'bold');
  doc.text('Cotización de Productos', 20, 20);
  
  doc.setFontSize(14);
  doc.setTextColor(80, 80, 80);
  doc.text('Librería Crayola', 20, 27);

  doc.setFontSize(9);
  doc.setTextColor(120, 120, 120);
  doc.setFont('helvetica', 'normal');
  doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 20, 35);
  doc.text('WhatsApp Liberia: +506 8446 6444  |  WhatsApp Bagaces: +506 8617 9090', 20, 40);
  doc.text('Email: Libreriacrayola25@gmail.com', 20, 45);

  // Table Data
  const tableData = items.map((item) => [
    item.name,
    item.selectedColor || '-',
    item.quantity.toString(),
  ]);

  autoTable(doc, {
    startY: 52,
    head: [['Producto', 'Color', 'Cantidad']],
    body: tableData,
    headStyles: { fillColor: [0, 113, 227], textColor: [255, 255, 255], fontStyle: 'bold' },
    alternateRowStyles: { fillColor: [250, 250, 252] },
    margin: { left: 20, right: 20 },
    theme: 'striped',
  });


  // Footer
  const pageCount = (doc as any).internal.getNumberOfPages();
  doc.setFontSize(8);
  doc.setTextColor(140, 140, 140);
  for (let i = 1; i <= pageCount; i++) {
    doc.setPage(i);
    doc.text(
      'Esta es una cotización informativa basada en los precios vigentes. No representa un compromiso de compra ni reserva de stock.',
      20,
      doc.internal.pageSize.height - 15
    );
    doc.text(
      `Página ${i} de ${pageCount}`,
      doc.internal.pageSize.width - 35,
      doc.internal.pageSize.height - 15
    );
  }

  doc.save('cotizacion-libreria-crayola.pdf');
};
