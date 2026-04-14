import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catálogo - Librería Crayola",
  description: "Explora y cotiza nuestros productos de oficina y papelería.",
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
          <Navbar />
          <main className="flex-1">
            {children}
          </main>
          <footer className="border-t border-neutral-100 py-12 bg-white">
            <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
              <div className="flex flex-col items-center justify-between gap-6 md:flex-row">
                <div className="text-xl font-bold text-primary">Librería Crayola</div>
                <div className="text-sm text-neutral-500">
                  &copy; {new Date().getFullYear()} Librería Crayola. Todos los derechos reservados.
                </div>
              </div>
            </div>
          </footer>
        </CartProvider>
      </body>
    </html>
  );
}
