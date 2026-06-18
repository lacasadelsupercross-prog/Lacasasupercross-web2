import { createClient } from "@supabase/supabase-js";

const SUPABASE_URL = "https://kpqrcufbnicyubzilkgq.supabase.co";
const SUPABASE_ANON_KEY =
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtwcXJjdWZibmljeXViemlsa2dxIiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODA2MjEzODgsImV4cCI6MjA5NjE5NzM4OH0.dy5dX9Bv3bPacaAwTkF73ACL1PnNQn23xUV3SMszL2c";

const supabase = createClient(SUPABASE_URL, SUPABASE_ANON_KEY);

export interface Producto {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio_venta: number;
  imagen_url: string | null;
  codigo_interno: string;
  promo_activa: boolean;
  promo_fecha_inicio: string | null;
  promo_fecha_fin: string | null;
  promo_descuento_monto: number | null;
  categoria: { id: string; nombre: string; slug: string } | null;
  marca: { id: string; nombre: string; slug: string } | null;
}

export interface Servicio {
  id: string;
  nombre: string;
  descripcion: string | null;
  precio: number;
}

export async function getProductosActivos(): Promise<Producto[]> {
  const { data, error } = await supabase
    .from("productos")
    .select(`
      id, nombre, descripcion, precio_venta, imagen_url, codigo_interno,
      promo_activa, promo_fecha_inicio, promo_fecha_fin, promo_descuento_monto,
      categoria:categorias(id, nombre, slug),
      marca:marcas(id, nombre, slug)
    `)
    .eq("activo", true)
    .eq("disponible_en_tienda", true)
    .order("nombre");

  if (error) throw new Error(error.message);
  return (data as Producto[]) ?? [];
}

export async function getServicios(): Promise<Servicio[]> {
  const { data, error } = await supabase
    .from("servicios")
    .select("id, nombre, descripcion, precio")
    .eq("activo", true)
    .order("nombre");

  if (error) throw new Error(error.message);
  return (data as Servicio[]) ?? [];
}

export function precioPublico(precio: number): string {
  return precio.toFixed(2);
}

/** Retorna la promo si está activa HOY según fechas */
export function getPromoActiva(producto: Producto): {
  precioOriginal: string;
  precioPromo: string;
  ahorro: string;
  porcentaje: string;
} | null {
  if (!producto.promo_activa || !producto.promo_descuento_monto) return null;

  const hoy = new Date();
  hoy.setHours(0, 0, 0, 0);

  if (producto.promo_fecha_inicio) {
    const inicio = new Date(producto.promo_fecha_inicio + "T00:00:00");
    if (hoy < inicio) return null;
  }
  if (producto.promo_fecha_fin) {
    const fin = new Date(producto.promo_fecha_fin + "T23:59:59");
    if (hoy > fin) return null;
  }

  const precioOriginal = parseFloat(precioPublico(producto.precio_venta));
  const descuento = producto.promo_descuento_monto;
  const precioPromo = Math.max(0, precioOriginal - descuento);
  const porcentaje = ((descuento / precioOriginal) * 100).toFixed(0);

  return {
    precioOriginal: precioOriginal.toFixed(2),
    precioPromo: precioPromo.toFixed(2),
    ahorro: descuento.toFixed(2),
    porcentaje,
  };
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
