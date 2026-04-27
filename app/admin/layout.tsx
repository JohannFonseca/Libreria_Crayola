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
    <div className="flex min-h-screen bg-[#f5f5f7]">
      {/* Sidebar - Más compacto */}
      <aside className="w-56 bg-white border-r border-neutral-200">
        <div className="p-6">
          <h1 className="text-lg font-bold tracking-tight">Admin Catalog</h1>
        </div>

        <nav className="px-3 space-y-1">
          {navItems.map((item) => {
            const isActive = pathname === item.href;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl transition-all ${
                  isActive
                    ? 'bg-primary text-white shadow-md'
                    : 'text-neutral-500 hover:bg-neutral-100 hover:text-foreground'
                }`}
              >
                <item.icon className="h-5 w-5" />
                <span className="font-medium text-sm">{item.label}</span>
                {isActive && <ChevronRight className="h-4 w-4 ml-auto" />}
              </Link>
            );
          })}
        </nav>

        <div className="absolute bottom-6 w-56 px-3">
          <Button
            variant="ghost"
            className="w-full justify-start gap-3 text-red-500 hover:bg-red-50 hover:text-red-600 rounded-xl px-3"
            onClick={handleLogout}
          >
            <LogOut className="h-5 w-5" />
            <span className="text-sm">Cerrar Sesión</span>
          </Button>
        </div>
      </aside>

      {/* Main Content - Con más espacio lateral */}
      <main className="flex-1 overflow-y-auto">
        <div className="p-4 sm:p-6 lg:p-8">
          {children}
        </div>
      </main>
    </div>
  );
}
