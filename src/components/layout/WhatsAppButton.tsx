export default function WhatsAppButton() {
    const number = "971504331603";
    const text = encodeURIComponent(
        "Hi Arowa Studio, I'd like to ask about a product."
    );
    const href= `https://wa.me/${number}?text=${text}`;

    return(
        <a
            href={href}
            target="blank"
            rel="noopener noreferrer"
            aria-label="Chat with us on Whatsapp"
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] shadow-lg transition hover:scale-105"
        >
            <svg viewBox="0 0 24 24" className="h-7 w-7 fill-white" aria-hidden="true">
                <path d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91c0 2.1.55 4.15 1.6 5.96L2 22l4.25-1.68c1.74.95 3.7 1.45 5.79 1.45 5.46 0 9.91-4.45 9.91-9.91S17.5 2 12.04 2zm5.8 14.16c-.24.68-1.42 1.3-1.95 1.35-.5.05-1.14.07-1.84-.11-.42-.13-.96-.31-1.66-.61-2.92-1.26-4.83-4.2-4.98-4.4-.15-.2-1.19-1.58-1.19-3.01s.75-2.14 1.02-2.43c.27-.29.58-.36.78-.36l.56.01c.18.01.42-.07.66.5.24.58.82 2.01.89 2.16.07.15.12.32.02.52-.1.2-.15.32-.29.5-.15.18-.31.4-.44.53-.15.15-.3.31-.13.6.17.29.76 1.25 1.63 2.03 1.12 1 2.06 1.31 2.35 1.46.29.15.46.12.63-.07.17-.2.73-.85.92-1.14.19-.29.39-.24.66-.15.27.1 1.7.8 1.99.95.29.15.48.22.55.34.07.12.07.72-.17 1.4z"/>
            </svg>
        </a>
    )
}