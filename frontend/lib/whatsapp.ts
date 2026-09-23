export const MINISTRY_WHATSAPP_NUMBER = "22890877855";

interface WhatsAppMessageFields {
  name: string;
  subject?: string;
  phone?: string;
  message: string;
  email?: string;
}

/** Build a wa.me deep link pre-filling a formatted message from form fields. */
export function buildWhatsAppLink(fields: WhatsAppMessageFields): string {
  const lines = [
    fields.subject ? `*${fields.subject}*` : null,
    `Nom : ${fields.name}`,
    fields.email ? `Email : ${fields.email}` : null,
    fields.phone ? `Téléphone : ${fields.phone}` : null,
    "",
    fields.message,
  ].filter((line): line is string => line !== null);

  const text = encodeURIComponent(lines.join("\n"));
  return `https://wa.me/${MINISTRY_WHATSAPP_NUMBER}?text=${text}`;
}
