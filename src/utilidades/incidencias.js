import { filtrarPedidos } from './pedidos';

// ¿Está resuelta la incidencia? Se comprueba mirando el estado real de la aplicación.
export function estaResuelto(clave, datos) {
  if (clave === 'A') return filtrarPedidos(datos, { estado: 'PENDIENTE' }).length > 0;
  return datos.usuarios.some((u) => u.rol === 'consulta' && u.activo);
}

export const RUTA_INCIDENCIA = { A: '/incidencias/a', B: '/incidencias/b' };

export function tonoPrioridad(prioridad) {
  if (prioridad.startsWith('1')) return 'error';
  if (prioridad.startsWith('2')) return 'aviso';
  return 'neutro';
}
