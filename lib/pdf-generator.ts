import jsPDF from 'jspdf';
import autoTable from 'jspdf-autotable';
import { CartItem } from './types';
import { BRANCHES, BranchId } from './whatsapp-helper';

export const generatePDF = (items: CartItem[], selectedBranchId: BranchId = 'liberia') => {
  const doc = new jsPDF();
  const selectedBranch = BRANCHES[selectedBranchId];

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
  doc.text(`Fecha de Emisión: ${new Date().toLocaleDateString()}`, 20, 34);

  // Selected Branch Info (Aligned top-right)
  doc.setFontSize(10);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(0, 113, 227); // Brand Primary Blue
  const attentionText = selectedBranchId === 'giovanny' ? `Atención: Ejecutivo ${selectedBranch.name}` : `Atención: Sucursal ${selectedBranch.name}`;
  doc.text(attentionText, 130, 20);
  
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(100, 100, 100);
  doc.text(`WhatsApp: ${selectedBranch.formattedPhone}`, 130, 26);
  doc.text(`Correo: ${selectedBranch.email}`, 130, 31);

  // Divider line
  doc.setDrawColor(230, 230, 230);
  doc.setLineWidth(0.5);
  doc.line(20, 38, 190, 38);

  // Contact details of both branches
  doc.setFontSize(8.5);
  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('Sucursal Liberia:', 20, 44);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text('WhatsApp: +506 8446 6444  |  Correo: Libreriacrayola25@gmail.com', 48, 44);

  doc.setFont('helvetica', 'bold');
  doc.setTextColor(80, 80, 80);
  doc.text('Sucursal Bagaces:', 20, 50);
  doc.setFont('helvetica', 'normal');
  doc.setTextColor(120, 120, 120);
  doc.text('WhatsApp: +506 8617 9090  |  Correo: libreriacrayolabagaced@gmail.com', 49, 50);

  // Table Data
  const tableData = items.map((item) => [
    item.name,
    item.selectedColor || '-',
    item.quantity.toString(),
  ]);

  autoTable(doc, {
    startY: 58,
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

  doc.save(`cotizacion-libreria-crayola-${selectedBranchId}.pdf`);
};
