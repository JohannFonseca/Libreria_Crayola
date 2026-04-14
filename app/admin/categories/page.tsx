'use client';

import React from 'react';
import { Plus, Edit2, Trash2, Tag } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { supabase } from '@/lib/supabaseClient';

export default function AdminCategoriesPage() {
  const [categories, setCategories] = React.useState<any[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [newName, setNewName] = React.useState('');
  const [editingId, setEditingId] = React.useState<string | null>(null);

  React.useEffect(() => {
    fetchCategories();
  }, []);

  const fetchCategories = async () => {
    setLoading(true);
    const { data } = await supabase.from('categories').select('*').order('name');
    setCategories(data || []);
    setLoading(false);
  };

  const handleCreate = async () => {
    if (!newName) return;
    const { error } = await supabase.from('categories').insert({ name: newName });
    if (!error) {
      setNewName('');
      fetchCategories();
    }
  };

  const handleUpdate = async (id: string, name: string) => {
    const { error } = await supabase.from('categories').update({ name }).eq('id', id);
    if (!error) {
      setEditingId(null);
      fetchCategories();
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('¿Seguro? Esto desvinculará los productos de esta categoría.')) return;
    const { error } = await supabase.from('categories').delete().eq('id', id);
    if (!error) fetchCategories();
  };

  return (
    <div className="space-y-8">
      <div>
        <h1 className="text-3xl font-bold tracking-tight">Gestión de Categorías</h1>
        <p className="text-neutral-500">Organiza tus productos por tipos para facilitar la búsqueda.</p>
      </div>

      <Card className="p-6">
        <div className="flex gap-4">
          <input
            type="text"
            placeholder="Nueva categoría..."
            className="flex-1 rounded-xl border border-neutral-200 px-4 py-2 focus:border-primary focus:outline-none"
            value={newName}
            onChange={(e) => setNewName(e.target.value)}
          />
          <Button className="gap-2" onClick={handleCreate}>
            <Plus className="h-5 w-5" />
            Agregar
          </Button>
        </div>
      </Card>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {loading ? (
          <p className="col-span-full text-center py-10 text-neutral-400">Cargando...</p>
        ) : categories.map((cat) => (
          <Card key={cat.id} className="p-6 flex items-center justify-between group">
            <div className="flex items-center gap-4 flex-1">
              <div className="p-2 rounded-lg bg-primary/10 text-primary">
                <Tag className="h-5 w-5" />
              </div>
              {editingId === cat.id ? (
                <input
                  autoFocus
                  className="w-full border-b border-primary outline-none"
                  defaultValue={cat.name}
                  onBlur={(e) => handleUpdate(cat.id, e.target.value)}
                  onKeyDown={(e) => e.key === 'Enter' && handleUpdate(cat.id, (e.target as HTMLInputElement).value)}
                />
              ) : (
                <span className="font-semibold text-lg">{cat.name}</span>
              )}
            </div>
            <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
              <button 
                className="p-1 text-neutral-400 hover:text-primary"
                onClick={() => setEditingId(cat.id)}
              >
                <Edit2 className="h-4 w-4" />
              </button>
              <button 
                className="p-1 text-neutral-400 hover:text-red-500"
                onClick={() => handleDelete(cat.id)}
              >
                <Trash2 className="h-4 w-4" />
              </button>
            </div>
          </Card>
        ))}
      </div>
    </div>
  );
}
