import type { Metadata } from "next";
import { Navbar } from "@/components/layout/Navbar";
import "./globals.css";

export const metadata: Metadata = {
  title: "Catálogo - Librería Crayola",
  description: "Explora y cotiza nuestros productos de oficina y papelería.",
  icons: {
    icon: '/LogoGrande.png',
    shortcut: '/LogoGrande.png',
    apple: '/LogoGrande.png',
  }
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
              <div className="flex flex-col items-center justify-between gap-10 md:flex-row md:items-start">
                
                <div className="flex flex-col items-center md:items-start gap-2">
                  <div className="text-xl font-bold text-primary">Librería Crayola</div>
                  <a href="mailto:Libreriacrayola25@gmail.com" className="text-sm text-neutral-500 hover:text-primary transition-colors">Libreriacrayola25@gmail.com</a>
                </div>

                <div className="flex flex-col items-center md:items-start gap-3">
                  <div className="font-semibold text-primary">Ubicaciones</div>
                  <a href="https://maps.app.goo.gl/gmvax4dDDtRWG1AZ7" target="_blank" rel="noopener noreferrer" className="text-sm text-neutral-500 hover:text-primary transition-colors flex items-center gap-2">
                    📍 Liberia
                  </a>
                  <span className="text-sm text-neutral-400 cursor-help flex items-center gap-2" title="Próximamente">
                    📍 Bagaces (Próximamente)
                  </span>
                </div>

                <div className="text-sm text-neutral-500 self-center">
                  &copy; {new Date().getFullYear()} Librería Crayola. Todos los derechos reservados.
                </div>
              </div>
            </div>
          </footer>
          
          <a 
            href="https://wa.me/50684466444" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="fixed bottom-6 right-6 z-50 flex h-14 w-14 items-center justify-center rounded-full bg-[#25D366] text-white shadow-lg hover:scale-110 transition-transform"
            aria-label="Contactar por WhatsApp"
          >
            <svg viewBox="0 0 24 24" fill="currentColor" className="h-8 w-8">
              <path d="M12.031 0C5.385 0 0 5.385 0 12.031c0 2.12.553 4.195 1.604 6.016L.513 24l6.115-1.605A11.963 11.963 0 0012.031 24c6.646 0 12.031-5.385 12.031-12.031C24.062 5.385 18.677 0 12.031 0zM12.031 22.016a9.954 9.954 0 01-5.086-1.39l-.365-.216-3.784.992 1.011-3.69-.238-.378A9.976 9.976 0 012.062 12.03c0-5.503 4.481-9.984 9.969-9.984 5.503 0 9.984 4.481 9.984 9.984 0 5.503-4.481 9.984-9.984 9.984zm5.474-7.484c-.301-.151-1.776-.879-2.052-.98-.276-.101-.477-.151-.678.151-.201.302-.778.98-.953 1.181-.176.201-.351.226-.653.075-1.353-.674-2.316-1.2-3.238-2.528-.238-.344.025-.515.244-.73.195-.195.301-.301.452-.5.151-.201.201-.302.301-.502.101-.201.05-.376-.025-.527-.075-.151-.678-1.631-.93-2.233-.245-.589-.494-.509-.678-.518-.176-.008-.377-.008-.578-.008-.201 0-.527.075-.803.376-.276.301-1.054 1.029-1.054 2.51 0 1.481 1.079 2.912 1.23 3.112.151.201 2.12 3.238 5.138 4.542.719.313 1.28.498 1.716.638.721.229 1.378.197 1.895.119.581-.088 1.776-.725 2.027-1.426.251-.701.251-1.302.176-1.426-.075-.125-.276-.201-.578-.352z"/>
            </svg>
          </a>
        </CartProvider>
      </body>
    </html>
  );
}
