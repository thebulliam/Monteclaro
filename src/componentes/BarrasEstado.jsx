import { TEXTO_ESTADO_PEDIDO } from './Insignia';

const ORDEN = ['pendiente', 'enviado', 'entregado'];

// Reparto de pedidos por estado. Cada fila lleva el número y el porcentaje escritos.
export default function BarrasEstado({ cuentas }) {
  const total = ORDEN.reduce((acc, e) => acc + (cuentas[e] || 0), 0) || 1;
  return (
    <ul className="reparto">
      {ORDEN.map((e) => {
        const n = cuentas[e] || 0;
        const pct = Math.round((n / total) * 100);
        return (
          <li key={e} className="reparto__fila">
            <p className="reparto__texto">
              <span>{TEXTO_ESTADO_PEDIDO[e]}</span>
              <strong>
                {n} {n === 1 ? 'pedido' : 'pedidos'} ({pct} %)
              </strong>
            </p>
            <div className="reparto__pista" aria-hidden="true">
              <div className={`reparto__barra reparto__barra--${e}`} style={{ width: `${pct}%` }} />
            </div>
          </li>
        );
      })}
    </ul>
  );
}
