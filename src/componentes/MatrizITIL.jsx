import { useDatos } from '../contextos/DatosContext';

const IMPACTOS = ['Alto', 'Medio', 'Bajo'];
const URGENCIAS = ['Alta', 'Media', 'Baja'];
const VALORES = { Alto: [1, 2, 3], Medio: [2, 3, 4], Bajo: [3, 4, 5] };
const NOMBRES = { 1: 'Crítica', 2: 'Alta', 3: 'Media', 4: 'Baja', 5: 'Planificada' };

const normal = (t) => String(t || '').trim().toLowerCase();

// Matriz ITIL: cruza impacto y urgencia. Marca dónde cae cada ticket según lo que se haya escrito.
export default function MatrizITIL() {
  const { datos } = useDatos();
  const marcas = ['A', 'B'].map((clave) => ({
    clave,
    impacto: normal(datos.tickets[clave].impacto),
    urgencia: normal(datos.tickets[clave].urgencia),
  }));

  const ticketsEn = (impacto, urgencia) =>
    marcas
      .filter((m) => m.impacto === normal(impacto) && m.urgencia === normal(urgencia))
      .map((m) => `Ticket ${m.clave}`);

  return (
    <div className="tabla-envoltorio">
      <table className="tabla tabla--matriz">
        <caption>
          Matriz ITIL de prioridad. Cada celda cruza un impacto con una urgencia. Prioridades: 1 crítica,
          2 alta, 3 media, 4 baja, 5 planificada.
        </caption>
        <thead>
          <tr>
            <th scope="col">Impacto ↓ / Urgencia →</th>
            {URGENCIAS.map((u) => (
              <th key={u} scope="col">
                Urgencia {u.toLowerCase()}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {IMPACTOS.map((impacto) => (
            <tr key={impacto}>
              <th scope="row">Impacto {impacto.toLowerCase()}</th>
              {URGENCIAS.map((urgencia, i) => {
                const valor = VALORES[impacto][i];
                const aqui = ticketsEn(impacto, urgencia);
                return (
                  <td key={urgencia} className={aqui.length ? 'celda--marcada' : undefined}>
                    Prioridad {valor}, {NOMBRES[valor].toLowerCase()}
                    {aqui.length > 0 && <strong className="celda__marca"> · {aqui.join(' y ')}</strong>}
                  </td>
                );
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
