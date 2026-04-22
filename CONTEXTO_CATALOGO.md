# 📚 Librería Crayola — Contexto del Sistema de Catálogo Curado

**Última actualización:** 2026-04-21  
**Stack:** Next.js (App Router) + Supabase + TypeScript

---

## 🎯 Modelo de Negocio

La Librería Crayola opera con un modelo de **catálogo curado**:
- El inventario interno puede ser grande (importado desde Excel u otros medios)
- La web solo muestra productos **seleccionados manualmente** por el admin
- La calidad del catálogo web importa más que la cantidad

---

## 🗄️ Base de Datos — Tabla `products`

### Campos clave (añadidos al schema original):

| Campo | Tipo | Descripción |
|-------|------|-------------|
| `nombre` | TEXT | Nombre del producto |
| `descripcion` | TEXT | Descripción |
| `imagen` / `image_url` | TEXT | URL de la imagen en Supabase Storage |
| `precio_venta` | NUMERIC(10,2) | Precio visible al público. NULL = no publicar |
| `categoria` / `category_id` | UUID → categories | Relación con tabla categories |
| `tipo_cliente` | TEXT | `'normal'` \| `'empresa'` — segmenta la audiencia |
| `visible_en_web` | BOOLEAN | **El switch principal** — `false` por defecto |
| `destacado` | BOOLEAN | Aparece en sección "Destacados" del home/catalog |
| `sort_order` | INT | Orden manual en el catálogo (menor = primero) |

### Regla de negocio crítica:
> Un producto se muestra en el catálogo web **SOLO SI**:
> `visible_en_web = true AND precio_venta IS NOT NULL`

---

## 🔄 Flujo de Trabajo del Admin

```
1. Cargar inventario (manual o Excel) → visible_en_web = false (default)
2. Admin abre panel "Inventario Interno" → ve todos los productos
3. Admin ajusta: precio_venta, categoria, tipo_cliente, destacado
4. Admin activa toggle "Mostrar en web" (visible_en_web = true)
5. Producto aparece en catálogo público
```

---

## 🛠️ Panel Admin — Vista "Inventario Interno"

### Ubicación: `/admin/products`

**Columnas de la tabla:**
- Imagen (thumbnail)
- Nombre del producto
- Categoría (selector inline editable)
- Tipo cliente (selector: Normal / Empresa)
- Precio venta (campo editable inline)
- Destacado (toggle/checkbox)
- **Visible en web** (toggle principal — verde = activo)
- Acciones (editar, eliminar)

**Features del panel:**
- Buscador por nombre (debounced)
- Filtro por estado (todos / visibles / ocultos)
- Filtro por tipo_cliente
- Filtro por categoría
- Orden manual drag-and-drop (campo `sort_order`)

---

## 🛒 Frontend — Catálogo Público (`/catalog`)

### Lógica de filtrado:
```ts
// Solo productos activos con precio definido
.eq('visible_en_web', true)
.not('precio_venta', 'is', null)
```

### Secciones:
1. **Destacados** — productos con `destacado = true` (carousel/grid especial)
2. **Para Empresas** — filtro `tipo_cliente = 'empresa'`
3. **Catálogo General** — todos los visibles
4. Filtros: por categoría, por tipo_cliente

---

## ❌ Reglas que NUNCA deben romperse

1. **Nunca** publicar automáticamente desde Excel (visible_en_web = false por defecto)
2. **Nunca** mostrar productos con `precio_venta = NULL` en el web
3. **Nunca** saturar el catálogo — prioridad a calidad sobre cantidad
4. El flujo siempre pasa por revisión manual del admin

---

## 📁 Estructura de Archivos Relevante

```
app/
  catalog/page.tsx           # Catálogo público (solo visible_en_web=true)
  admin/
    products/page.tsx        # Inventario interno (TODOS los productos)
    layout.tsx               # Sidebar admin con navegación

lib/
  types.ts                   # Tipos TS: Product, Category, CartItem...
  api/
    products.ts              # CRUD Supabase — getPublicProducts() vs getAllProducts()
  supabaseClient.ts

components/
  admin/
    ProductModal.tsx         # Modal crear/editar producto
    InventoryTable.tsx       # Tabla inline con toggles (por crear)
  catalog/
    ProductCard.tsx
    ProductDetail.tsx
    FeaturedSection.tsx      # Sección destacados (por crear)

supabase/
  schema.sql                 # Schema DB (actualizar con nuevos campos)
```

---

## 🚀 Mejoras a Futuro (Backlog)

- [ ] Importación desde Excel con preview antes de publicar
- [ ] Historial de cambios en productos (audit log)
- [ ] Uploads en lote de imágenes
- [ ] Gestión de stock / inventario numérico
- [ ] Descuentos por tipo de cliente (empresa vs normal)
- [ ] API de cotización automatizada por email
- [ ] Integración con WhatsApp Business API (vs link manual actual)
- [ ] Analytics más detalladas por producto y categoría
- [ ] Precios especiales / lista de precios por cliente
- [ ] PWA para pedidos desde celular

---

## 🔑 Variables de Entorno

```env
NEXT_PUBLIC_SUPABASE_URL=...
NEXT_PUBLIC_SUPABASE_ANON_KEY=...
```

## 📞 Sucursales WhatsApp

- **Liberia:** 84466444
- **Bagaces:** 86179090
