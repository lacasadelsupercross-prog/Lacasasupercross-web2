import { createClient } from "@supabase/supabase-js";

// Lee de import.meta.env (local/dev) o process.env (Cloudflare Pages build)
const SUPABASE_URL =
  import.meta.env.SUPABASE_URL ??
  (typeof process !== "undefined" ? process.env.SUPABASE_URL : undefined) ?? "";

const SUPABASE_KEY =
  import.meta.env.SUPABASE_SERVICE_ROLE_KEY ??
  (typeof process !== "undefined" ? process.env.SUPABASE_SERVICE_ROLE_KEY : undefined) ??
  import.meta.env.SUPABASE_ANON_KEY ??
  (typeof process !== "undefined" ? process.env.SUPABASE_ANON_KEY : undefined) ?? "";

const supabase = createClient(SUPABASE_URL, SUPABASE_KEY);

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
