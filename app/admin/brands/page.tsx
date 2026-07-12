'use client';

import React, { useEffect, useState } from 'react';
import { Plus, Edit2, Trash2, Award, Upload, X } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabaseClient';
import { uploadImage } from '@/lib/api/storage';
import { Brand } from '@/lib/types';
import { motion } from 'framer-motion';

export default function AdminBrandsPage() {
  const [brands, setBrands] = useState<Brand[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Form State
  const [name, setName] = useState('');
  const [description, setDescription] = useState('');
  const [color, setColor] = useState('#10B981'); // default Emerald green
  const [logoUrl, setLogoUrl] = useState('');
  const [visibleEnWeb, setVisibleEnWeb] = useState(true);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);

  // Suggested color swatches
  const colorSwatches = [
    { name: 'Esmeralda', value: '#10B981' },
    { name: 'Azul', value: '#3B82F6' },
    { name: 'Naranja', value: '#F59E0B' },
    { name: 'Indigo', value: '#4F46E5' },
    { name: 'Rojo', value: '#EF4444' },
    { name: 'Cian', value: '#06B6D4' },
    { name: 'Rosa', value: '#EC4899' },
    { name: 'Gris Oscuro', value: '#374151' },
  ];

  useEffect(() => {
    fetchBrands();
  }, []);

  const fetchBrands = async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('brands')
        .select('*')
        .order('name');
      
      if (error) throw error;
      setBrands((data as Brand[]) || []);
    } catch (e) {
      console.error('Error fetching brands:', e);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    setUploadingImage(true);
    try {
      const url = await uploadImage(file);
      setLogoUrl(url);
    } catch (error) {
      console.error('Error uploading image:', error);
      alert('Error al subir la imagen. Verifica que el bucket de almacenamiento exista.');
    } finally {
      setUploadingImage(false);
    }
  };

  const resetForm = () => {
    setName('');
    setDescription('');
    setColor('#10B981');
    setLogoUrl('');
    setVisibleEnWeb(true);
    setEditingId(null);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name) return;

    // Helper classes for backward compatibility with frontend styling
    const swatch = colorSwatches.find(s => s.value.toLowerCase() === color.toLowerCase());
    let bg_color = 'bg-neutral-50';
    let text_color = 'text-neutral-600';
    
    if (color === '#10B981') { bg_color = 'bg-emerald-50'; text_color = 'text-emerald-600'; }
    else if (color === '#3B82F6') { bg_color = 'bg-blue-50'; text_color = 'text-blue-600'; }
    else if (color === '#F59E0B') { bg_color = 'bg-amber-50'; text_color = 'text-amber-600'; }
    else if (color === '#4F46E5') { bg_color = 'bg-indigo-50'; text_color = 'text-indigo-600'; }
    else if (color === '#EF4444') { bg_color = 'bg-red-50'; text_color = 'text-red-600'; }
    else if (color === '#06B6D4') { bg_color = 'bg-cyan-50'; text_color = 'text-cyan-600'; }
    else if (color === '#EC4899') { bg_color = 'bg-pink-50'; text_color = 'text-pink-600'; }

    const brandData = {
      name,
      description: description || null,
      color,
      bg_color,
      text_color,
      logo_url: logoUrl || null,
      visible_en_web: visibleEnWeb
    };

    try {
      if (editingId) {
        const { error } = await supabase
          .from('brands')
          .update(brandData)
          .eq('id', editingId);
        if (error) throw error;
      } else {
        const { error } = await supabase
          .from('brands')
          .insert(brandData);
        if (error) throw error;
      }
      
      resetForm();
      fetchBrands();
    } catch (error: any) {
      console.error('Error saving brand:', error);
      alert('Error al guardar la marca: ' + error.message);
    }
  };

  const handleEdit = (brand: Brand) => {
    setEditingId(brand.id);
    setName(brand.name);
    setDescription(brand.description || '');
    setColor(brand.color || '#10B981');
    setLogoUrl(brand.logo_url || '');
    setVisibleEnWeb(brand.visible_en_web ?? true);
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Estás seguro de eliminar esta marca? Los productos asociados perderán su marca asignada.')) return;
    
    try {
      const { error } = await supabase
        .from('brands')
        .delete()
        .eq('id', id);
      if (error) throw error;
      
      fetchBrands();
      if (editingId === id) resetForm();
    } catch (error: any) {
      console.error('Error deleting brand:', error);
      alert('Error al eliminar la marca: ' + error.message);
    }
  };

  const handleToggleVisibility = async (brand: Brand) => {
    try {
      const { error } = await supabase
        .from('brands')
        .update({ visible_en_web: !(brand.visible_en_web ?? true) })
        .eq('id', brand.id);
      if (error) throw error;
      fetchBrands();
    } catch (error: any) {
      console.error('Error toggling brand visibility:', error);
    }
  };

  return (
    <div className="space-y-10">
      <div>
        <h1 className="text-3xl font-black tracking-tight text-neutral-900">Gestión de Marcas</h1>
        <p className="text-neutral-500 font-semibold mt-1">Organiza y destaca las marcas de tus productos en el sitio público.</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Form Card */}
        <div className="lg:col-span-4">
          <Card className="p-6 border-neutral-200/60 shadow-sm sticky top-6">
            <h2 className="text-lg font-black text-neutral-900 mb-6 flex items-center gap-2">
              <Award className="h-5 w-5 text-primary" />
              {editingId ? 'Editar Marca' : 'Nueva Marca'}
            </h2>

            <form onSubmit={handleSave} className="space-y-6">
              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-neutral-500 mb-2">Nombre de la Marca</label>
                <input
                  type="text"
                  required
                  placeholder="Ej. Crayola, Bic..."
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-semibold"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-neutral-500 mb-2">Descripción (Opcional)</label>
                <textarea
                  placeholder="Escribe una breve descripción de la marca..."
                  rows={3}
                  className="w-full rounded-xl border border-neutral-200 px-4 py-3 text-sm focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-semibold"
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-neutral-500 mb-2">Color Representativo</label>
                <div className="grid grid-cols-5 gap-2 mb-3">
                  {colorSwatches.map((swatch) => (
                    <button
                      key={swatch.value}
                      type="button"
                      className={`h-8 rounded-lg border-2 transition-all flex items-center justify-center`}
                      style={{ 
                        backgroundColor: swatch.value,
                        borderColor: color.toLowerCase() === swatch.value.toLowerCase() ? '#111827' : 'transparent',
                        boxShadow: color.toLowerCase() === swatch.value.toLowerCase() ? '0 0 0 2px white' : 'none'
                      }}
                      onClick={() => setColor(swatch.value)}
                      title={swatch.name}
                    />
                  ))}
                  <div className="relative h-8 rounded-lg overflow-hidden border border-neutral-200/80 flex items-center justify-center bg-neutral-50 hover:bg-neutral-100 transition-colors">
                    <input
                      type="color"
                      className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
                      value={color}
                      onChange={(e) => setColor(e.target.value)}
                    />
                    <span className="text-xs font-extrabold">+</span>
                  </div>
                </div>
                <div className="flex items-center gap-2 mt-2">
                  <div className="h-4 w-4 rounded border border-neutral-200" style={{ backgroundColor: color }} />
                  <span className="text-xs font-mono font-bold text-neutral-500">{color.toUpperCase()}</span>
                </div>
              </div>

              <div>
                <label className="block text-xs font-black uppercase tracking-wider text-neutral-500 mb-2">Logo de la Marca</label>
                <div className="space-y-4">
                  {logoUrl ? (
                    <div className="relative h-28 w-28 rounded-2xl border border-neutral-200 p-2 bg-neutral-50 flex items-center justify-center group overflow-hidden">
                      <img src={logoUrl} alt="Logo Preview" className="max-h-full max-w-full object-contain" />
                      <button
                        type="button"
                        className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 flex items-center justify-center text-white transition-opacity duration-200"
                        onClick={() => setLogoUrl('')}
                      >
                        <X className="h-6 w-6" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex flex-col items-center justify-center h-28 w-full border-2 border-dashed border-neutral-200 rounded-2xl cursor-pointer hover:bg-neutral-50 hover:border-primary/55 transition-all text-neutral-400">
                      {uploadingImage ? (
                        <div className="h-6 w-6 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
                      ) : (
                        <>
                          <Upload className="h-6 w-6 mb-1 text-neutral-400" />
                          <span className="text-xs font-extrabold">Subir Logotipo</span>
                          <span className="text-[10px] font-bold text-neutral-400 mt-0.5">JPG, PNG</span>
                        </>
                      )}
                      <input
                        type="file"
                        accept="image/*"
                        className="hidden"
                        onChange={handleImageUpload}
                        disabled={uploadingImage}
                      />
                    </label>
                  )}
                  <input
                    type="text"
                    placeholder="O ingresa URL de la imagen..."
                    className="w-full rounded-xl border border-neutral-200 px-4 py-2.5 text-xs focus:border-primary focus:outline-none focus:ring-4 focus:ring-primary/10 transition-all font-semibold"
                    value={logoUrl}
                    onChange={(e) => setLogoUrl(e.target.value)}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between p-3.5 bg-neutral-50 rounded-xl border border-neutral-200/50">
                <div>
                  <label className="block text-xs font-black uppercase tracking-wider text-neutral-700">Destacar en Inicio</label>
                  <p className="text-[10px] text-neutral-400 font-bold mt-0.5">Mostrar en el carrusel de la página de inicio</p>
                </div>
                <button
                  type="button"
                  onClick={() => setVisibleEnWeb(!visibleEnWeb)}
                  className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors ${visibleEnWeb ? 'bg-green-500' : 'bg-neutral-300'}`}
                >
                  <span className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${visibleEnWeb ? 'translate-x-6' : 'translate-x-1'}`} />
                </button>
              </div>

              <div className="flex gap-3 pt-2">
                <Button type="submit" className="flex-1 font-extrabold h-11 rounded-xl">
                  {editingId ? 'Guardar Cambios' : 'Agregar Marca'}
                </Button>
                {editingId && (
                  <Button type="button" variant="ghost" className="border border-neutral-200 hover:bg-neutral-100 rounded-xl px-4" onClick={resetForm}>
                    Cancelar
                  </Button>
                )}
              </div>
            </form>
          </Card>
        </div>

        {/* Right Column: Brands Grid */}
        <div className="lg:col-span-8 space-y-6">
          <div className="p-4 bg-white border border-neutral-200/60 rounded-2xl flex items-center justify-between">
            <span className="text-sm font-bold text-neutral-500">Marcas Registradas</span>
            <span className="text-xs font-black bg-neutral-100 px-3 py-1 rounded-full text-neutral-700">{brands.length} en total</span>
          </div>

          {loading ? (
            <div className="flex flex-col items-center justify-center py-20 bg-white border border-neutral-200/60 rounded-[32px] space-y-3">
              <div className="h-8 w-8 border-2 border-primary/20 border-t-primary rounded-full animate-spin" />
              <span className="text-neutral-400 text-sm font-bold">Cargando marcas...</span>
            </div>
          ) : brands.length === 0 ? (
            <div className="text-center py-20 bg-white border border-neutral-200/60 rounded-[32px] space-y-4">
              <Award className="h-12 w-12 text-neutral-300 mx-auto" />
              <div>
                <p className="text-neutral-600 font-extrabold">No hay marcas registradas</p>
                <p className="text-neutral-400 text-xs mt-1">Usa el formulario de la izquierda para registrar tu primera marca.</p>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {brands.map((brand) => (
                <div 
                  key={brand.id} 
                  className="bg-white border border-neutral-200/60 rounded-[28px] p-6 shadow-sm hover:shadow-md transition-all duration-300 flex flex-col justify-between group relative overflow-hidden"
                >
                  {/* Decorative color strip */}
                  <div className="absolute top-0 inset-x-0 h-1.5" style={{ backgroundColor: brand.color }} />
                  
                  <div className="space-y-4">
                    <div className="flex items-center justify-between gap-4">
                      {/* Logo or initial placeholder */}
                      {brand.logo_url ? (
                        <div className="h-12 w-12 rounded-xl border border-neutral-100 bg-neutral-50 flex items-center justify-center p-1.5 overflow-hidden">
                          <img src={brand.logo_url} alt={brand.name} className="max-h-full max-w-full object-contain" />
                        </div>
                      ) : (
                        <div 
                          className="h-12 w-12 rounded-xl flex items-center justify-center font-black text-lg" 
                          style={{ backgroundColor: `${brand.color}15`, color: brand.color }}
                        >
                          {brand.name.substring(0, 2).toUpperCase()}
                        </div>
                      )}

                      <div className="flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        <button
                          onClick={() => handleEdit(brand)}
                          className="h-8 w-8 rounded-lg bg-neutral-50 border border-neutral-100 hover:bg-neutral-100 text-neutral-500 hover:text-primary flex items-center justify-center transition-all"
                          title="Editar"
                        >
                          <Edit2 className="h-4 w-4" />
                        </button>
                        <button
                          onClick={() => handleDelete(brand.id)}
                          className="h-8 w-8 rounded-lg bg-neutral-50 border border-neutral-100 hover:bg-red-50 text-neutral-500 hover:text-red-650 flex items-center justify-center transition-all"
                          title="Eliminar"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>

                    <div>
                      <h3 className="font-extrabold text-neutral-900 text-lg flex items-center gap-2">
                        {brand.name}
                        <span 
                          className="inline-block h-2 w-2 rounded-full" 
                          style={{ backgroundColor: brand.color }} 
                        />
                      </h3>
                      <p className="text-neutral-500 text-xs font-semibold mt-1.5 leading-relaxed min-h-[36px] line-clamp-2">
                        {brand.description || 'Sin descripción adicional.'}
                      </p>
                    </div>
                  </div>

                  <div className="mt-6 pt-4 border-t border-neutral-100 flex items-center justify-between text-xs text-neutral-400 font-bold">
                    <button
                      type="button"
                      onClick={() => handleToggleVisibility(brand)}
                      className={`flex items-center gap-1.5 px-2.5 py-1 rounded-lg border text-[10px] uppercase font-black tracking-wide transition-all ${
                        brand.visible_en_web ?? true
                          ? 'border-green-100 bg-green-50 text-green-600 hover:bg-green-100'
                          : 'border-neutral-200 bg-neutral-50 text-neutral-400 hover:bg-neutral-100'
                      }`}
                    >
                      <span className={`h-1.5 w-1.5 rounded-full ${brand.visible_en_web ?? true ? 'bg-green-500' : 'bg-neutral-400'}`} />
                      {(brand.visible_en_web ?? true) ? 'En Inicio' : 'Oculto en Inicio'}
                    </button>
                    <span 
                      className="px-2.5 py-0.5 rounded-md font-mono uppercase tracking-wider text-[9px]"
                      style={{ backgroundColor: `${brand.color}12`, color: brand.color }}
                    >
                      {brand.color}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
