import { useRef, useState } from 'react';
import Seccion from '../componentes/Seccion';
import { useDatos } from '../contextos/DatosContext';
import { useApi } from '../contextos/ApiContext';
import { useAvisos } from '../contextos/AvisosContext';

const PESTANAS = [
  { id: 'red', texto: 'Red' },
  { id: 'consola', texto: 'Consola' },
  { id: 'bd', texto: 'Base de datos' },
];

function resumenCuerpo(cuerpo) {
  if (Array.isArray(cuerpo)) return `lista con ${cuerpo.length} elementos`;
  return JSON.stringify(cuerpo);
}

function PestanaRed() {
  const { registro, limpiarRegistro } = useApi();
  const { avisar } = useAvisos();
  return (
    <>
      <p>
        Peticiones que ha hecho la aplicación al servidor. Abre pedidos en otra pestaña del menú y vuelve aquí
        para ver la petición. Cada petición se puede abrir para ver su respuesta.
      </p>
      <button
        type="button"
        className="boton boton--secundario boton--pequeno"
        onClick={() => {
          limpiarRegistro();
          avisar('Registro de peticiones vaciado.');
        }}
      >
        Vaciar el registro
      </button>
      {registro.length === 0 ? (
        <p>Todavía no hay peticiones. Abre la lista de pedidos para generar una.</p>
      ) : (
        <ul className="registro-red">
          {registro.map((r) => (
            <li key={r.id}>
              <details>
                <summary>
                  {r.hora} · {r.metodo} {r.url} · estado {r.estado}
                  {r.estado >= 400 ? ' (error)' : r.estado === 200 ? ' (correcto)' : ''}
                </summary>
                <p>Usuario (rol): {r.usuario}</p>
                <p>Respuesta: {resumenCuerpo(r.cuerpo)}</p>
                <pre tabIndex={0} role="region" aria-label={`Respuesta completa de ${r.metodo} ${r.url}`}>
                  {JSON.stringify(r.cuerpo, null, 2)}
                </pre>
              </details>
            </li>
          ))}
        </ul>
      )}
    </>
  );
}

function PestanaConsola() {
  const { registro } = useApi();
  const lineas = [...registro].reverse();
  return (
    <>
      <p>
        Mensajes de la consola. En rojo irían los errores (por ejemplo, un fallo en el código de la página).
        Las líneas informativas son normales.
      </p>
      <pre tabIndex={0} role="region" aria-label="Mensajes de la consola" className="consola">
        {lineas.length === 0
          ? '[info] Monteclaro Panel 1.8.2 iniciado.'
          : ['[info] Monteclaro Panel 1.8.2 iniciado.']
              .concat(
                lineas.map((r) =>
                  r.estado >= 400
                    ? `[ERROR] ${r.metodo} ${r.url} → ${r.estado} ${JSON.stringify(r.cuerpo)}`
                    : `[info] ${r.metodo} ${r.url} → ${r.estado}, ${resumenCuerpo(r.cuerpo)}`
                )
              )
              .join('\n')}
      </pre>
    </>
  );
}

function PestanaBD() {
  const { datos } = useDatos();
  const [resultado, setResultado] = useState(null);

  const consultas = [
    {
      sql: 'SELECT estado, COUNT(*) FROM pedidos GROUP BY estado',
      ejecutar: () => {
        const cuenta = {};
        datos.pedidos.forEach((p) => {
          cuenta[p.estado] = (cuenta[p.estado] || 0) + 1;
        });
        return Object.keys(cuenta).map((e) => `  ${e} | ${cuenta[e]}`);
      },
    },
    {
      sql: "SELECT * FROM pedidos WHERE estado = 'PENDIENTE'",
      ejecutar: () => datos.pedidos.filter((p) => p.estado === 'PENDIENTE').map((p) => `  ${p.id} | ${p.estado}`),
    },
    {
      sql: "SELECT * FROM pedidos WHERE estado = 'pendiente'",
      ejecutar: () => datos.pedidos.filter((p) => p.estado === 'pendiente').map((p) => `  ${p.id} | ${p.estado}`),
    },
    {
      sql: "SELECT * FROM pedidos WHERE LOWER(estado) = 'pendiente'",
      ejecutar: () => datos.pedidos.filter((p) => p.estado.toLowerCase() === 'pendiente').map((p) => `  ${p.id} | ${p.estado}`),
    },
  ];

  const lanzar = (c) => {
    const filas = c.ejecutar();
    setResultado({ sql: c.sql, filas });
  };

  return (
    <>
      <p>
        Base de datos de ejemplo, solo lectura (esta pantalla no modifica nada). Elige una consulta y mira el
        resultado.
      </p>
      <ul className="consultas">
        {consultas.map((c) => (
          <li key={c.sql}>
            <button type="button" className="boton boton--secundario" onClick={() => lanzar(c)}>
              Ejecutar: {c.sql}
            </button>
          </li>
        ))}
      </ul>
      <div role="status" aria-live="polite">
        {resultado && (
          <>
            <p>
              Consulta: <code>{resultado.sql}</code>. Resultado: {resultado.filas.length}{' '}
              {resultado.filas.length === 1 ? 'fila' : 'filas'}.
            </p>
            <pre tabIndex={0} role="region" aria-label="Resultado de la consulta" className="consola">
              {resultado.filas.length ? resultado.filas.join('\n') : '  0 filas'}
            </pre>
          </>
        )}
      </div>
    </>
  );
}

export default function Diagnostico() {
  const [activa, setActiva] = useState('red');
  const refs = useRef({});

  const alTeclear = (e, i) => {
    let nuevo = null;
    if (e.key === 'ArrowRight') nuevo = (i + 1) % PESTANAS.length;
    if (e.key === 'ArrowLeft') nuevo = (i - 1 + PESTANAS.length) % PESTANAS.length;
    if (e.key === 'Home') nuevo = 0;
    if (e.key === 'End') nuevo = PESTANAS.length - 1;
    if (nuevo === null) return;
    e.preventDefault();
    setActiva(PESTANAS[nuevo].id);
    refs.current[PESTANAS[nuevo].id].focus();
  };

  return (
    <>
      <h1 tabIndex={-1}>Herramientas de diagnóstico</h1>

      <Seccion id="diag-intro" titulo="Qué es esto" resumen>
        <p>
          Una versión sencilla de las herramientas del navegador (el inspector y la consola) y de una base de
          datos de ejemplo. Sirve para investigar qué hace la aplicación sin tocar nada. Las peticiones también
          se escriben en la consola real de tu navegador.
        </p>
      </Seccion>

      <Seccion id="diag-herramientas" titulo="Herramientas">
        <div role="tablist" aria-label="Herramientas de diagnóstico" className="pestanas">
          {PESTANAS.map((p, i) => (
            <button
              key={p.id}
              ref={(el) => {
                refs.current[p.id] = el;
              }}
              type="button"
              role="tab"
              id={`pestana-${p.id}`}
              aria-selected={activa === p.id}
              aria-controls={`panel-${p.id}`}
              tabIndex={activa === p.id ? 0 : -1}
              className="pestana"
              onClick={() => setActiva(p.id)}
              onKeyDown={(e) => alTeclear(e, i)}
            >
              {p.texto}
            </button>
          ))}
        </div>
        <div role="tabpanel" id={`panel-${activa}`} aria-labelledby={`pestana-${activa}`} className="panel-pestana">
          {activa === 'red' && <PestanaRed />}
          {activa === 'consola' && <PestanaConsola />}
          {activa === 'bd' && <PestanaBD />}
        </div>
      </Seccion>
    </>
  );
}
