// Cálculos del Resumen a partir de los pedidos.
const aFecha = (texto) => {
  const [d, m, a] = texto.split('/').map(Number);
  return new Date(a, m - 1, d);
};

// Ventas por día (los últimos 7 días con pedidos), ordenadas de más antiguo a más reciente.
export function ventasPorDia(datos) {
  const mapa = new Map();
  datos.pedidos.forEach((p) => {
    const dia = mapa.get(p.fecha) || { fecha: p.fecha, total: 0, pedidos: 0 };
    dia.total += p.importe;
    dia.pedidos += 1;
    mapa.set(p.fecha, dia);
  });
  return [...mapa.values()]
    .sort((a, b) => aFecha(a.fecha) - aFecha(b.fecha))
    .slice(-7)
    .map((d) => ({
      ...d,
      corta: aFecha(d.fecha).toLocaleDateString('es-ES', { weekday: 'short', day: 'numeric' }).replace('.', ''),
      larga: aFecha(d.fecha).toLocaleDateString('es-ES', { weekday: 'long', day: 'numeric', month: 'long' }),
    }));
}

export const sumar = (lista, campo) => lista.reduce((acc, x) => acc + x[campo], 0);
