export const WHATSAPP_NUMBER = "971504331603";


export function whatsappUrl(message: string): string {
    return `https://wa.me/${WHATSAPP_NUMBER}?text=${encodeURIComponent(message)}`;
}