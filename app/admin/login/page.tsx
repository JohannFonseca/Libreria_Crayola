'use client';

import React from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Mail, Lock, ArrowRight, ShieldCheck } from 'lucide-react';
import { loginAdmin } from '@/lib/api/auth';
import { Button } from '@/components/ui/Button';
import { motion } from 'framer-motion';

export default function AdminLoginPage() {
  const [email, setEmail] = React.useState('');
  const [password, setPassword] = React.useState('');
  const [loading, setLoading] = React.useState(false);
  const [error, setError] = React.useState<string | null>(null);
  const router = useRouter();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      await loginAdmin(email, password);
      router.push('/admin/dashboard');
    } catch (loginError: any) {
      setError('Credenciales inválidas. Intenta de nuevo.');
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-[90vh] flex items-center justify-center px-4 overflow-hidden bg-[#fafafa] w-full">
      {/* Animated Custom Decorative Background Blobs & Grid Pattern */}
      <div className="absolute inset-0 bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px] pointer-events-none" />
      <div className="absolute top-0 inset-x-0 -z-10 h-full w-full pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 h-[500px] w-[500px] bg-primary/10 blur-[130px] rounded-full animate-pulse" style={{ animationDuration: '8s' }} />
        <div className="absolute bottom-1/4 right-1/4 h-[500px] w-[500px] bg-amber-500/10 blur-[120px] rounded-full animate-pulse" style={{ animationDuration: '10s' }} />
      </div>

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: "easeOut" }}
        className="w-full max-w-md relative z-10"
      >
        {/* Back Link */}
        <div className="mb-6">
          <Link href="/" className="inline-flex items-center gap-2 text-neutral-400 hover:text-neutral-800 font-extrabold text-sm transition-colors group">
            <span className="group-hover:-translate-x-1 transition-transform">←</span> Volver al Inicio
          </Link>
        </div>

        <div className="w-full p-8 sm:p-10 bg-white border border-neutral-200/60 rounded-[32px] shadow-[0_20px_50px_rgba(0,0,0,0.04)] relative overflow-hidden">
          <div className="mb-8 text-center">
            {/* Logo wrapper */}
            <div className="relative h-14 w-auto mx-auto mb-6 flex items-center justify-center">
              <img src="/LogoGrande.png" alt="Logo" className="h-full w-auto object-contain mix-blend-multiply" />
            </div>
            
            <h1 className="text-3xl font-black text-neutral-900 tracking-tight flex items-center justify-center gap-2">
              Panel de <span className="gradient-text-crayola">Administración</span>
            </h1>
            <p className="text-neutral-500 text-sm font-semibold mt-2">
              Ingresa a tu cuenta para gestionar el catálogo y las cotizaciones
            </p>
          </div>

          <form onSubmit={handleLogin} className="space-y-6">
            <div>
              <label className="block text-sm font-extrabold mb-2 text-neutral-700">Correo Electrónico</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
                  <Mail className="h-5 w-5" />
                </span>
                <input
                  type="email"
                  required
                  placeholder="correo@ejemplo.com"
                  className="w-full rounded-2xl border border-neutral-200 pl-12 pr-4 py-3.5 text-sm bg-neutral-50/50 focus:bg-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-semibold"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-extrabold mb-2 text-neutral-700">Contraseña</label>
              <div className="relative">
                <span className="absolute inset-y-0 left-0 flex items-center pl-4 text-neutral-400">
                  <Lock className="h-5 w-5" />
                </span>
                <input
                  type="password"
                  required
                  placeholder="••••••••"
                  className="w-full rounded-2xl border border-neutral-200 pl-12 pr-4 py-3.5 text-sm bg-neutral-50/50 focus:bg-white focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-semibold"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="p-4 bg-red-50 border border-red-100 rounded-2xl flex items-center gap-2.5 text-red-600 text-xs sm:text-sm font-bold"
              >
                <ShieldCheck className="h-5 w-5 text-red-500 flex-shrink-0" />
                <span>{error}</span>
              </motion.div>
            )}

            <Button 
              type="submit" 
              className="w-full h-14 text-base font-extrabold rounded-2xl bg-primary hover:bg-primary/95 text-white shadow-lg shadow-primary/20 transition-all hover:scale-[1.02] active:scale-[0.98] flex items-center justify-center gap-2 shine-effect" 
              disabled={loading}
            >
              {loading ? (
                <>
                  <span className="h-5 w-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  Iniciando sesión...
                </>
              ) : (
                <>
                  Iniciar Sesión
                  <ArrowRight className="h-5 w-5" />
                </>
              )}
            </Button>
          </form>
        </div>
      </motion.div>
    </div>
  );
}
