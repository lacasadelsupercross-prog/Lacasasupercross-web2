export interface CartItem {
  id: string;
  uuid: string;
  nombre: string;
  codigo: string;
  precio: string;
  cantidad: number;
  imagen: string;
}

const KEY = "carrito_supercross";

export function getCarrito(): CartItem[] {
  try {
    return JSON.parse(localStorage.getItem(KEY) ?? "[]") as CartItem[];
  } catch {
    return [];
  }
}

export function guardarCarrito(items: CartItem[]): void {
  localStorage.setItem(KEY, JSON.stringify(items));
  document.dispatchEvent(new CustomEvent("carrito:cambio", { detail: items }));
}

export function agregarAlCarrito(item: Omit<CartItem, "cantidad">): void {
  const items = getCarrito();
  const idx = items.findIndex(i => i.id === item.id);
  if (idx >= 0) {
    items[idx].cantidad++;
  } else {
    items.push({ ...item, cantidad: 1 });
  }
  guardarCarrito(items);
}

export function actualizarCantidad(id: string, cantidad: number): void {
  let items = getCarrito();
  if (cantidad <= 0) {
    items = items.filter(i => i.id !== id);
  } else {
    const idx = items.findIndex(i => i.id === id);
    if (idx >= 0) items[idx].cantidad = cantidad;
  }
  guardarCarrito(items);
}

export function vaciarCarrito(): void {
  guardarCarrito([]);
}

export function totalItems(): number {
  return getCarrito().reduce((sum, i) => sum + i.cantidad, 0);
}
