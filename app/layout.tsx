import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  metadataBase: new URL('https://libreria-crayola-cr.vercel.app'),
  title: "Catálogo - Librería Crayola",
  description: "Explora y cotiza nuestros productos de oficina y papelería.",
  icons: {
    icon: '/logo.jpeg',
    shortcut: '/logo.jpeg',
    apple: '/logo.jpeg',
  },
  openGraph: {
    title: "Catálogo - Librería Crayola",
    description: "Explora y cotiza nuestros productos de oficina y papelería.",
    url: "https://libreria-crayola-cr.vercel.app",
    siteName: "Librería Crayola",
    images: [
      {
        url: '/LogoGrande.png',
        width: 1500,
        height: 788,
        alt: "Librería Crayola",
      },
    ],
    locale: "es_CR",
    type: "website",
  },
};
import { CartProvider } from "@/context/CartContext";

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="es" className="h-full antialiased">
      <body className="min-h-full flex flex-col bg-[#fbfbfd]">
        <CartProvider>
          <ClientLayoutWrapper>
            {children}
          </ClientLayoutWrapper>
        </CartProvider>
      </body>
    </html>
  );
}
