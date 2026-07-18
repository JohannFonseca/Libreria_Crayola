'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Tag, BarChart3, LogOut, ChevronRight, Award } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { getSession, logoutAdmin } from '@/lib/api/auth';

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const isLoginPage = pathname === '/admin/login';
  const [checking, setChecking] = React.useState(true);

  React.useEffect(() => {
    const checkSession = async () => {
      if (isLoginPage) {
        setChecking(false);
        return;
      }
      
      const session = await getSession();
      if (!session) {
        router.push('/admin/login');
      } else {
        setChecking(false);
      }
    };
    
    checkSession();
  }, [isLoginPage, router]);

  if (isLoginPage) return <>{children}</>;
  if (checking) return <div className="flex min-h-screen items-center justify-center font-bold text-neutral-400 animate-pulse">Cargando...</div>;

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { label: 'Productos', icon: Package, href: '/admin/products' },
    { label: 'Categorías', icon: Tag, href: '/admin/categories' },
    { label: 'Marcas', icon: Award, href: '/admin/brands' },
  ];

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-[#fafafa]">
      {/* Top Header */}
      <header className="h-16 bg-white border-b border-neutral-200/60 flex items-center justify-between px-6 shadow-sm z-30">
        <Link href="/" className="flex items-center gap-3 group">
          <div className="relative h-9 w-auto transition-transform group-hover:scale-105 flex items-center justify-center">
            <img src="/LogoGrande.png" alt="Logo" className="h-full w-auto object-contain mix-blend-multiply" />
          </div>
          <div>
            <h1 className="text-sm font-black tracking-tight text-neutral-900 leading-none">Librería Crayola</h1>
            <span className="text-[9px] font-black text-primary uppercase tracking-widest mt-0.5 block">Administrador</span>
          </div>
        </Link>

        <div className="flex items-center gap-4">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-neutral-50 border border-neutral-100">
            <div className="h-7 w-7 rounded-lg bg-primary/10 text-primary font-black text-xs flex items-center justify-center">
              AD
            </div>
            <span className="text-xs font-extrabold text-neutral-700">Admin</span>
          </div>
          
          <Button
            variant="ghost"
            className="text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl px-3 h-10 flex items-center gap-2 transition-all font-bold text-xs"
            onClick={handleLogout}
          >
            <LogOut className="h-4 w-4" />
            <span className="hidden sm:inline">Cerrar Sesión</span>
          </Button>
        </div>
      </header>

      {/* Under-Header Area */}
      <div className="flex flex-1 overflow-hidden">
        {/* Sidebar */}
        <aside className="w-56 bg-white border-r border-neutral-200/50 flex flex-col flex-shrink-0 relative z-20 shadow-[2px_0_12px_rgba(0,0,0,0.01)]">
          <nav className="flex-1 px-3 space-y-1.5 overflow-y-auto py-6">
            <span className="text-[9px] font-black text-neutral-400 uppercase tracking-[0.2em] block px-3 mb-3">Navegación</span>
            {navItems.map((item) => {
              const isActive = pathname === item.href;
              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`flex items-center gap-3 px-3 py-3 rounded-xl transition-all duration-300 font-bold text-sm ${
                    isActive
                      ? 'bg-gradient-to-r from-primary to-primary/95 text-white shadow-lg shadow-primary/15 scale-[1.01]'
                      : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
                  }`}
                >
                  <item.icon className={`h-4.5 w-4.5 transition-transform duration-300 ${isActive ? 'text-white scale-110' : 'text-neutral-400 group-hover:scale-110'}`} />
                  <span>{item.label}</span>
                  {isActive && <ChevronRight className="h-3.5 w-3.5 ml-auto opacity-85" />}
                </Link>
              );
            })}
          </nav>
        </aside>

        {/* Main Content - Independent scrolling */}
        <main className="flex-1 overflow-y-auto bg-[#fafafa] relative">
          <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808003_1px,transparent_1px),linear-gradient(to_bottom,#80808003_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
          <div className="p-6 sm:p-8 lg:p-10 max-w-[1600px] relative">
            {children}
          </div>
        </main>
      </div>
    </div>
  );
}
