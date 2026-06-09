import { createClient } from "@supabase/supabase-js";

// URL y anon key son públicos por diseño de Supabase (igual que cualquier app cliente)
// El anon key solo puede leer productos activos (política RLS)
const SUPABASE_URL = "https://uufodpagmahijwzsamhv.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InV1Zm9kcGFnbWFoaWp3enNhbWh2Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzk3NjU2ODksImV4cCI6MjA5NTM0MTY4OX0.2c0f908edrtW-AiomJnwYI-p8CBS5dvNJbiH9ZPpAEE";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio_venta: number;
  imagen_url: string | null;
  codigo_interno: string;
  categoria: { id: string; nombre: string; slug: string } | null;
  marca: { id: string; nombre: string; slug: string } | null;
}

export async function getProductosActivos(): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("productos")
    .select(`
      id, nombre, descripcion, precio_venta, imagen_url, codigo_interno,
      categoria:categorias(id, nombre, slug),
      marca:marcas(id, nombre, slug)
    `)
    .eq("activo", true)
    .eq("disponible_en_tienda", true)
    .order("nombre");

  if (error) throw new Error(error.message);
  return (data as Producto[]) ?? [];
}

export function precioPublico(precioBase: number): string {
  return (precioBase * 1.15).toFixed(2);
}

export function getCategorias(productos: Producto[]) {
  const map = new Map<string, { id: string; nombre: string; slug: string }>();
  for (const p of productos) {
    if (p.categoria) map.set(p.categoria.id, p.categoria);
  }
  return Array.from(map.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
}

export function getMarcas(productos: Producto[]) {
  const map = new Map<string, { id: string; nombre: string; slug: string }>();
  for (const p of productos) {
    if (p.marca) map.set(p.marca.id, p.marca);
  }
  return Array.from(map.values()).sort((a, b) => a.nombre.localeCompare(b.nombre));
}
