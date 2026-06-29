const NUMERO = "593968309908";

export interface ItemPedido {
  nombre: string;
  codigo: string;
  precio: string;
  cantidad: number;
}

export function urlConsulta(nombre: string, codigo: string): string {
  const msg = `Hola, me interesa el producto: *${nombre}* (Cód. ${codigo}). ¿Está disponible?`;
  return `https://wa.me/${NUMERO}?text=${encodeURIComponent(msg)}`;
}

export function urlGeneral(): string {
  return `https://wa.me/${NUMERO}?text=${encodeURIComponent("Hola, quisiera información sobre repuestos de motos.")}`;
}

export function urlServicio(nombre: string): string {
  const msg = `Hola, quisiera agendar el servicio: *${nombre}*. ¿Cuál es su disponibilidad?`;
  return `https://wa.me/${NUMERO}?text=${encodeURIComponent(msg)}`;
}

export function urlCarrito(items: ItemPedido[]): string {
  let msg = "¡Hola! Quiero hacer el siguiente pedido:\n\n";
  for (const item of items) {
    msg += `• ${item.cantidad}x *${item.nombre}* (Cód. ${item.codigo}) — $${item.precio} c/u\n`;
  }
  const total = items.reduce((s, i) => s + parseFloat(i.precio) * i.cantidad, 0);
  msg += `\n*Total estimado: $${total.toFixed(2)}*\n¿Están disponibles?`;
  return `https://wa.me/${NUMERO}?text=${encodeURIComponent(msg)}`;
}
