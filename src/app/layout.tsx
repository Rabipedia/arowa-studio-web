import type { Metadata } from "next";
import { Playfair_Display, Inter } from "next/font/google";
import "./globals.css";
import NavBar from "@/components/layout/NavBar";
import Footer from "@/components/layout/Footer";
import { CartProvider } from "@/context/CartContext";
import { AuthProvider } from "@/context/AuthContext";
import WhatsAppButton from "@/components/layout/WhatsAppButton";
import { SITE_NAME, SITE_URL } from "@/lib/seo";
import { GoogleAnalytics } from "@next/third-parties/google";

const playfair = Playfair_Display({
  variable: "--font-playfair",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: {
    default: "Home & Lifestyle Essentials in the UAE | Arowa Studio",
    template: `%s | ${SITE_NAME}`,
  },
  description:
    "Curated home and lifestyle products for modern UAE living. Decor, lighting, drinkware, accessories and more, with cash on delivery across Dubai and all Emirates.",
  openGraph: {
    type: "website",
    siteName: SITE_NAME,
    locale: "en_AE",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${playfair.variable} ${inter.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">
        <AuthProvider>
          <CartProvider>
            <NavBar/>
              <main className="flex-1">{children}</main>
            <Footer/>
         </CartProvider>
        </AuthProvider>
        <WhatsAppButton/>
      </body>
      {process.env.NEXT_PUBLIC_GA_ID && (
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID} />
      )}
    </html>
  );
}