// Etiqueta de estado. El significado va SIEMPRE en el texto, nunca solo en el color.
export default function Insignia({ tono = 'neutro', children }) {
  return <span className={`insignia insignia--${tono}`}>{children}</span>;
}

export const TONO_ESTADO_PEDIDO = { pendiente: 'aviso', enviado: 'info', entregado: 'ok' };
export const TEXTO_ESTADO_PEDIDO = { pendiente: 'Pendiente de envío', enviado: 'Enviado', entregado: 'Entregado' };
