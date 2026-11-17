import Seccion from '../componentes/Seccion';
import Campo from '../componentes/Campo';
import Kpi from '../componentes/Kpi';
import Insignia from '../componentes/Insignia';
import MatrizITIL from '../componentes/MatrizITIL';
import { useDatos } from '../contextos/DatosContext';
import { RUTA_INCIDENCIA, tonoPrioridad } from '../utilidades/incidencias';

export default function Incidencias() {
  const { datos } = useDatos();
  const claves = ['A', 'B'];
  const abiertas = claves.filter((k) => datos.tickets[k].estado === 'abierta').length;
  const criticas = claves.filter((k) => datos.tickets[k].estado === 'abierta' && datos.tickets[k].prioridad.startsWith('1')).length;

  return (
    <>
      <h1 tabIndex={-1}>Incidencias y peticiones</h1>
      <p className="subtitulo">Avisos del equipo de la tienda que atiende el soporte técnico.</p>

      <Seccion id="inc-kpis" titulo="Situación de la bandeja" resumen className="seccion--sin-marco">
        <ul className="kpis">
          <Kpi icono="incidencias" etiqueta="Abiertas" valor={abiertas} tono={abiertas ? 'ambar' : 'verde'} nota="Pendientes de resolver" />
          <Kpi icono="incidencias" etiqueta="Críticas" valor={criticas} tono={criticas ? 'rojo' : 'verde'} nota="Prioridad 1" />
          <Kpi icono="ayuda" etiqueta="Cerradas" valor={claves.length - abiertas} tono="verde" nota="Resueltas y documentadas" />
        </ul>
      </Seccion>

      <Seccion id="inc-bandeja" titulo="Bandeja">
        <div className="tabla-envoltorio">
          <table className="tabla">
            <caption>{claves.length} avisos de Elena Marín, responsable de pedidos</caption>
            <thead>
              <tr>
                <th scope="col">Código</th>
                <th scope="col">Asunto</th>
                <th scope="col">Tipo</th>
                <th scope="col">Prioridad</th>
                <th scope="col">Estado</th>
                <th scope="col">Abierta</th>
              </tr>
            </thead>
            <tbody>
              {claves.map((k) => {
                const t = datos.tickets[k];
                return (
                  <tr key={k}>
                    <th scope="row">
                      <a href={`#${RUTA_INCIDENCIA[k]}`}>{t.codigo}</a>
                    </th>
                    <td>{t.asunto}</td>
                    <td>{t.tipo}</td>
                    <td>
                      <Insignia tono={tonoPrioridad(t.prioridad)}>{t.prioridad}</Insignia>
                    </td>
                    <td>
                      <Insignia tono={t.estado === 'abierta' ? 'aviso' : 'ok'}>{t.estado === 'abierta' ? 'Abierta' : 'Cerrada'}</Insignia>
                    </td>
                    <td>{t.abierto}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </Seccion>

      <Seccion id="inc-prioridad" titulo="Cómo se prioriza (matriz ITIL)">
        <MatrizITIL />
        <Campo etiqueta="Atiendo primero" ruta={['orden', 'primero']} />
        <Campo etiqueta="Por qué" ruta={['orden', 'explicacion']} multilinea filas={4} />
      </Seccion>
    </>
  );
}
