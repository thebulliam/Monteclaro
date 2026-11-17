import Seccion from '../componentes/Seccion';
import Campo from '../componentes/Campo';
import Insignia from '../componentes/Insignia';
import DiagramaFlujo from '../componentes/DiagramaFlujo';
import { useDatos } from '../contextos/DatosContext';
import { useAvisos } from '../contextos/AvisosContext';
import { estaResuelto, tonoPrioridad } from '../utilidades/incidencias';
import { filtrarPedidos } from '../utilidades/pedidos';

const CASOS = {
  A: { pasos: 'pasosA', progreso: 'casoA', cierre: ['cierre-a', 'instrucciones-elena', 'nota-a'] },
  B: { pasos: 'pasosB', progreso: 'casoB', cierre: ['cierre-b', 'nota-b'] },
};

function Comprobacion({ clave }) {
  const { datos } = useDatos();
  const ok = estaResuelto(clave, datos);
  let texto;
  if (clave === 'A') {
    const n = filtrarPedidos(datos, { estado: 'PENDIENTE' }).length;
    texto = ok
      ? `El filtro «Pendientes de envío» devuelve ${n} pedidos. El problema parece resuelto.`
      : 'El filtro «Pendientes de envío» devuelve 0 pedidos, aunque hay pedidos pendientes guardados.';
  } else {
    const nuevos = datos.usuarios.filter((u) => u.rol === 'consulta' && u.activo);
    texto = ok
      ? `Existe ${nuevos.length === 1 ? 'un usuario' : `${nuevos.length} usuarios`} con el rol «Solo consulta»: ${nuevos.map((u) => u.nombre).join(', ')}.`
      : 'Todavía no existe ningún usuario con el rol «Solo consulta».';
  }
  return (
    <p className={ok ? 'resultado resultado--ok' : 'resultado resultado--mal'} role="status">
      <strong>{ok ? 'Comprobación superada. ' : 'Comprobación pendiente. '}</strong>
      {texto}
    </p>
  );
}

export default function Incidencia({ clave }) {
  const caso = CASOS[clave];
  const { datos, actualizar, modoEdicion } = useDatos();
  const { avisar } = useAvisos();
  const t = datos.tickets[clave];
  const pasos = datos[caso.pasos];
  const hechos = datos.progreso[caso.progreso];
  const ruta = (campo) => ['tickets', clave, campo];
  const resuelto = estaResuelto(clave, datos);
  const abierta = t.estado === 'abierta';

  const alternar = (i) => {
    const nuevos = hechos.includes(i) ? hechos.filter((h) => h !== i) : [...hechos, i];
    actualizar(['progreso', caso.progreso], nuevos);
    avisar(`${nuevos.length} de ${pasos.length} tareas hechas.`);
  };

  const cambiarEstado = () => {
    const nuevo = abierta ? 'cerrada' : 'abierta';
    actualizar(['tickets', clave, 'estado'], nuevo);
    avisar(nuevo === 'cerrada' ? `Incidencia ${t.codigo} cerrada.` : `Incidencia ${t.codigo} reabierta.`);
  };

  const indiceTexto = (id) => datos.comunicacion.findIndex((c) => c.id === id);

  return (
    <>
      <p className="migas">
        <a href="#/incidencias">Incidencias</a> / {t.codigo}
      </p>
      <h1 tabIndex={-1}>
        {t.codigo} · {clave === 'A' ? 'Lista de pedidos vacía' : 'Acceso de solo consulta para una persona nueva'}
      </h1>

      <Seccion
        id={`inc-${clave}-resumen`}
        titulo="Resumen"
        resumen
        acciones={
          <button
            type="button"
            className={abierta ? 'boton boton--pequeno' : 'boton boton--secundario boton--pequeno'}
            onClick={cambiarEstado}
            disabled={abierta && !resuelto}
            aria-label={abierta ? `Cerrar incidencia ${t.codigo}` : `Reabrir incidencia ${t.codigo}`}
          >
            {abierta ? 'Cerrar incidencia' : 'Reabrir'}
          </button>
        }
      >
        <div className="meta">
          <Insignia tono={t.estado === 'abierta' ? 'aviso' : 'ok'}>{abierta ? 'Abierta' : 'Cerrada'}</Insignia>
          <Insignia tono="info">{t.tipo}</Insignia>
          <Insignia tono={tonoPrioridad(t.prioridad)}>Prioridad {t.prioridad}</Insignia>
        </div>
        <p className="campo__texto">{t.asunto}</p>
        <dl className="datos-lista">
          <dt>Solicitante</dt>
          <dd>{t.solicitante}, responsable de pedidos</dd>
          <dt>Abierta el</dt>
          <dd>{t.abierto}</dd>
          <dt>Categoría</dt>
          <dd>
            {t.categoria} · {t.subcategoria}
          </dd>
        </dl>
        <Comprobacion clave={clave} />
        {abierta && !resuelto && <p className="nota">Cuando la comprobación se supere podrás cerrar la incidencia.</p>}
      </Seccion>

      <Seccion
        id={`inc-${clave}-plan`}
        titulo="Plan de resolución"
        acciones={
          <span className="progreso-texto">
            {hechos.length} de {pasos.length} hechas
          </span>
        }
      >
        <ol className="plan">
          {pasos.map((paso, i) => {
            const hecho = hechos.includes(i);
            return (
              <li key={paso.titulo} className={`plan__paso${hecho ? ' plan__paso--hecho' : ''}`}>
                <Seccion id={`inc-${clave}-tarea-${i + 1}`} titulo={`${i + 1}. ${paso.titulo}`} nivel={3}>
                  <p className="plan__fase">Fase: {paso.fase}</p>
                  <Campo etiqueta="Qué hago" ruta={[caso.pasos, i, 'accion']} multilinea filas={3} />
                  {!modoEdicion && (
                    <p>
                      <a className="boton boton--secundario boton--pequeno" href={`#${paso.donde.ruta}`}>
                        {paso.donde.texto}
                      </a>
                    </p>
                  )}
                  <Campo etiqueta="Resultado esperado" ruta={[caso.pasos, i, 'esperado']} multilinea filas={3} />
                  <Campo etiqueta="Mensaje para Elena si algo falla" ruta={[caso.pasos, i, 'siFalla']} multilinea filas={3} />
                  {(hecho || modoEdicion) && <Campo etiqueta="Conclusión" ruta={[caso.pasos, i, 'observado']} multilinea filas={2} />}
                  {!modoEdicion && (
                    <label className="comprobable">
                      <input type="checkbox" checked={hecho} onChange={() => alternar(i)} />
                      <span>Tarea hecha</span>
                    </label>
                  )}
                </Seccion>
              </li>
            );
          })}
        </ol>
      </Seccion>

      {clave === 'A' && (
        <Seccion id="inc-a-figura" titulo="Cómo viaja la petición y dónde falla">
          <DiagramaFlujo />
        </Seccion>
      )}

      <Seccion id={`inc-${clave}-datos`} titulo="Datos completos de la incidencia">
        <Campo etiqueta="Asunto" ruta={ruta('asunto')} />
        <Campo etiqueta="Categoría" ruta={ruta('categoria')} />
        <Campo etiqueta="Subcategoría" ruta={ruta('subcategoria')} />
        <Campo etiqueta="Tipo" ruta={ruta('tipo')} />
        <Campo etiqueta="Impacto" ruta={ruta('impacto')} />
        <Campo etiqueta="Urgencia" ruta={ruta('urgencia')} />
        <Campo etiqueta="Prioridad" ruta={ruta('prioridad')} />
        <Campo etiqueta="Justificación de la prioridad" ruta={ruta('justificacion')} multilinea filas={3} />
        <Campo etiqueta="Descripción del problema" ruta={ruta('descripcion')} multilinea filas={4} />
        <Campo etiqueta="Acciones ya realizadas" ruta={ruta('acciones')} multilinea filas={4} />
        <Campo etiqueta="Primera respuesta a Elena" ruta={ruta('respuesta')} multilinea filas={8} />
      </Seccion>

      <Seccion id={`inc-${clave}-cierre`} titulo="Comunicación y documentación">
        {caso.cierre.map((id) => {
          const i = indiceTexto(id);
          if (i < 0) return null;
          const texto = datos.comunicacion[i];
          return (
            <Seccion key={id} id={`inc-${clave}-${id}`} titulo={texto.tipo} nivel={3}>
              <Campo etiqueta="Para" ruta={['comunicacion', i, 'para']} />
              <Campo etiqueta="Asunto" ruta={['comunicacion', i, 'asunto']} />
              <Campo etiqueta="Texto" ruta={['comunicacion', i, 'cuerpo']} multilinea filas={12} />
            </Seccion>
          );
        })}
      </Seccion>
    </>
  );
}
