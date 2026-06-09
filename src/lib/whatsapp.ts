const NUMERO = "593968309908";

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
