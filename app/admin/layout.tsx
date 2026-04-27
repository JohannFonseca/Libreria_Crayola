'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname, useRouter } from 'next/navigation';
import { LayoutDashboard, Package, Tag, BarChart3, LogOut, ChevronRight } from 'lucide-react';
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
  if (checking) return <div className="flex min-h-screen items-center justify-center">Cargando...</div>;

  const handleLogout = async () => {
    await logoutAdmin();
    router.push('/admin/login');
  };

  const navItems = [
    { label: 'Dashboard', icon: LayoutDashboard, href: '/admin/dashboard' },
    { label: 'Productos', icon: Package, href: '/admin/products' },
    { label: 'Categorías', icon: Tag, href: '/admin/categories' },
  ];

  return (
    <div className="flex h-screen overflow-hidden bg-[#f5f5f7]">
      {/* Sidebar - Fijo y con scroll propio si es necesario */}
      <aside className="w-64 bg-white border-r border-neutral-200 flex flex-col flex-shrink-0 shadow-sm">
        <div className="p-6">
          <Link href="/" className="flex items-center gap-3 group">
            <div className="relative h-10 w-10 overflow-hidden rounded-lg border border-neutral-100 transition-transform group-hover:scale-105">
              <img src="/logo.jpeg" alt="Logo" className="h-full w-full object-cover" />
            </div>
            <div>
              <h1 className="text-sm font-bold tracking-tight text-neutral-900 leading-none">Librería Crayola</h1>
              <span className="text-[10px] font-medium text-neutral-400 uppercase tracking-widest">Administrador</span>
            </div>
          </Link>
        </div>

        <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto py-4">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all duration-200 ${
                  isActive
                    ? 'bg-primary text-white shadow-md shadow-primary/20'
                    : 'text-neutral-500 hover:bg-neutral-50 hover:text-neutral-900'
                }`}
              >
                <item.icon className={`h-5 w-5 ${isActive ? 'text-white' : 'text-neutral-400'}`} />
                <span className="font-semibold text-sm">{item.label}</span>
                {isActive && <ChevronRight className="h-4 w-4 ml-auto opacity-70" />}
              </Link>
            );
          })}
        </nav>

        <div className="p-6 border-t border-neutral-100">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl px-3"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm font-semibold">Cerrar Sesión</span>
          </Button>
        </div>
      </aside>

      {/* Main Content - Con su propio scroll independiente */}
      <main className="flex-1 overflow-y-auto bg-[#f5f5f7]">
        <div className="p-4 sm:p-6 lg:p-10 max-w-[1600px]">
          {children}
        </div>
      </main>
    </div>
  );
}
