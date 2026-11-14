/**
 * Formateador de moneda costarricense (Colones - CRC ₡)
 */
export const formatCRC = (amount: number | null | undefined): string => {
  if (amount === null || amount === undefined || isNaN(amount)) {
    return 'Consultar';
  }

  // Formato estándar Costa Rica: ₡1.500
  try {
    return new Intl.NumberFormat('es-CR', {
      style: 'currency',
      currency: 'CRC',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0,
    }).format(amount).replace('CRC', '₡').trim();
  } catch {
    return `₡${amount.toLocaleString('es-CR')}`;
  }
};
