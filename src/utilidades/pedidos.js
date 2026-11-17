// Lógica de pedidos. Aquí vive el fallo del ticket A:
// con la comparación 'estricta', 'PENDIENTE' no coincide con 'pendiente'.

export function filtrarPedidos(datos, { estado = '', q = '' } = {}) {
  const estricta = datos.config.comparacionEstados === 'estricta';
  const nombreCliente = (id) => {
    const c = datos.clientes.find((x) => x.id === id);
    return c ? c.nombre : '';
  };
  return datos.pedidos.filter((p) => {
    if (estado) {
      const coincide = estricta ? p.estado === estado : p.estado.toLowerCase() === estado.toLowerCase();
      if (!coincide) return false;
    }
    if (q) {
      const texto = `${p.id} ${nombreCliente(p.clienteId)}`.toLowerCase();
      if (!texto.includes(q.toLowerCase())) return false;
    }
    return true;
  });
}

export const contarPorEstado = (datos, estado) =>
  datos.pedidos.filter((p) => p.estado.toLowerCase() === estado).length;

export const euros = (n) => n.toLocaleString('es-ES', { style: 'currency', currency: 'EUR' });

export const nombreDeCliente = (datos, id) => {
  const c = datos.clientes.find((x) => x.id === id);
  return c ? c.nombre : 'Cliente desconocido';
};
