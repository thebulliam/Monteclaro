import { euros } from '../utilidades/pedidos';

// Gráfico de barras en SVG. El dibujo está oculto al lector de pantalla y a la voz (aria-hidden);
// lo que se lee es el resumen escrito de debajo y, si se quiere, la tabla con los mismos datos.
export default function GraficoBarras({ id, datos, resumen, tituloTabla }) {
  const ancho = 640;
  const alto = 250;
  const margen = { izq: 52, der: 12, arr: 22, abajo: 34 };
  const areaAncho = ancho - margen.izq - margen.der;
  const areaAlto = alto - margen.arr - margen.abajo;
  const maximo = Math.max(...datos.map((d) => d.total), 1);
  const tope = Math.ceil(maximo / 50) * 50;
  const paso = areaAncho / datos.length;
  const anchoBarra = Math.min(48, paso * 0.6);
  const marcas = [0, 0.25, 0.5, 0.75, 1].map((f) => Math.round(tope * f));

  return (
    <figure className="grafico">
      <svg viewBox={`0 0 ${ancho} ${alto}`} aria-hidden="true" focusable="false" className="grafico__svg">
        {marcas.map((m) => {
          const y = margen.arr + areaAlto - (m / tope) * areaAlto;
          return (
            <g key={m}>
              <line x1={margen.izq} x2={ancho - margen.der} y1={y} y2={y} className="grafico__rejilla" />
              <text x={margen.izq - 8} y={y + 4} textAnchor="end" className="grafico__eje">
                {m} €
              </text>
            </g>
          );
        })}
        {datos.map((d, i) => {
          const h = (d.total / tope) * areaAlto;
          const x = margen.izq + paso * i + (paso - anchoBarra) / 2;
          const y = margen.arr + areaAlto - h;
          const ultimo = i === datos.length - 1;
          return (
            <g key={d.fecha}>
              <rect x={x} y={y} width={anchoBarra} height={h} rx="5" className={ultimo ? 'grafico__barra grafico__barra--ultima' : 'grafico__barra'} />
              <text x={x + anchoBarra / 2} y={y - 6} textAnchor="middle" className="grafico__valor">
                {Math.round(d.total)}
              </text>
              <text x={x + anchoBarra / 2} y={alto - 12} textAnchor="middle" className="grafico__eje">
                {d.corta}
              </text>
            </g>
          );
        })}
      </svg>
      <figcaption id={`${id}-resumen`}>{resumen}</figcaption>
      <details className="grafico__tabla" data-no-voz>
        <summary>Ver los datos del gráfico en una tabla</summary>
        <div className="tabla-envoltorio">
          <table className="tabla">
            <caption>{tituloTabla}</caption>
            <thead>
              <tr>
                <th scope="col">Día</th>
                <th scope="col">Pedidos</th>
                <th scope="col">Ventas</th>
              </tr>
            </thead>
            <tbody>
              {datos.map((d) => (
                <tr key={d.fecha}>
                  <th scope="row">{d.larga}</th>
                  <td>{d.pedidos}</td>
                  <td>{euros(d.total)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </details>
    </figure>
  );
}
