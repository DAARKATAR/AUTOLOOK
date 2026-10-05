/**
 * Utilidad robusta para enlaces de WhatsApp de AutoLook / MotoLook.
 * Limpia y normaliza cualquier formato de teléfono:
 * - "3138663821" -> "573138663821" (agrega prefijo de Colombia automáticamente)
 * - "+57 313 866 3821" -> "573138663821" (elimina +, espacios y guiones)
 * - "573138663821" -> "573138663821"
 */
export const getCleanPhoneNumber = (phone) => {
  const raw = phone || (typeof import.meta !== 'undefined' && import.meta.env && import.meta.env.VITE_WHATSAPP_NUMBER) || '573138663821';
  let digits = String(raw).replace(/\D/g, '');
  if (!digits) {
    digits = '573138663821';
  }
  // Si el usuario ingresó los 10 dígitos locales de Colombia empezando en 3 (ej: 3138663821), agregar el 57
  if (digits.length === 10 && digits.startsWith('3')) {
    digits = '57' + digits;
  }
  return digits;
};

export const getWhatsAppUrl = (message = '', phone = null) => {
  const number = getCleanPhoneNumber(phone);
  const textParam = message ? `&text=${encodeURIComponent(message)}` : '';
  return `https://api.whatsapp.com/send?phone=${number}${textParam}`;
};
