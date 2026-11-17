import { useRef } from 'react';
import Seccion from '../componentes/Seccion';
import Icono from '../componentes/Icono';
import { useVoz } from '../contextos/VozContext';
import { useDatos } from '../contextos/DatosContext';

function formatoFecha(iso) {
  try {
    return new Date(iso).toLocaleString('es-ES', { dateStyle: 'long', timeStyle: 'short' });
  } catch {
    return iso;
  }
}

export default function Ajustes() {
  const { soportado, leyendo, leerPagina, detener, ajustes, cambiarAjuste } = useVoz();
  const { datos, modoEdicion, setModoEdicion, sinGuardar, guardar, cargar, restablecer } = useDatos();
  const entrada = useRef(null);
  const leyendoPagina = leyendo === 'pagina';
  const cambiarTamano = (paso) => cambiarAjuste('tamano', Math.min(160, Math.max(90, ajustes.tamano + paso)));

  const alElegirArchivo = async (e) => {
    const fichero = e.target.files && e.target.files[0];
    await cargar(fichero);
    e.target.value = '';
  };

  let estadoDatos = 'Sin cambios todavía.';
  if (sinGuardar) estadoDatos = 'Tienes cambios sin guardar.';
  else if (datos.guardadoEn) estadoDatos = `Último guardado: ${formatoFecha(datos.guardadoEn)}.`;

  return (
    <>
      <h1 tabIndex={-1}>Accesibilidad, voz y archivo de datos</h1>
      <p className="subtitulo">Ajusta cómo se lee y se ve la aplicación, y guarda o recupera tu trabajo.</p>

      <div className="rejilla rejilla--2">
        <Seccion id="aj-voz" titulo="Voz y lectura" resumen>
          {soportado ? (
            <>
              <p>
                Cada tarjeta tiene su botón «Escuchar». Atajos: Alt más L lee la página entera y Escape detiene la lectura.
              </p>
              <p>
                <button type="button" className="boton" onClick={leyendoPagina ? detener : leerPagina}>
                  <Icono nombre={leyendoPagina ? 'parar' : 'voz'} tamano={18} />
                  {leyendoPagina ? 'Detener la lectura' : 'Leer esta página'}
                </button>
              </p>
              <div className="campo-form">
                <label htmlFor="auto-lectura">Lectura automática</label>
                <select id="auto-lectura" value={ajustes.auto} onChange={(e) => cambiarAjuste('auto', e.target.value)}>
                  <option value="no">No, solo con el botón</option>
                  <option value="resumen">Título y resumen al cambiar de página</option>
                  <option value="todo">Página completa al cambiar de página</option>
                </select>
              </div>
              <div className="campo-form">
                <label htmlFor="velocidad">Velocidad de la voz</label>
                <select id="velocidad" value={ajustes.velocidad} onChange={(e) => cambiarAjuste('velocidad', Number(e.target.value))}>
                  <option value={0.8}>Lenta</option>
                  <option value={1}>Normal</option>
                  <option value={1.25}>Rápida</option>
                  <option value={1.5}>Muy rápida</option>
                </select>
              </div>
            </>
          ) : (
            <p>Tu navegador no admite la lectura en voz alta. Puedes usar tu lector de pantalla.</p>
          )}
        </Seccion>

        <Seccion id="aj-tamano" titulo="Tamaño del texto">
          <p id="etiqueta-tamano">Tamaño actual: {ajustes.tamano} %.</p>
          <div className="acciones" role="group" aria-labelledby="etiqueta-tamano">
            <button type="button" className="boton boton--secundario" onClick={() => cambiarTamano(-10)} disabled={ajustes.tamano <= 90}>
              Texto más pequeño
            </button>
            <button type="button" className="boton boton--secundario" onClick={() => cambiarTamano(10)} disabled={ajustes.tamano >= 160}>
              Texto más grande
            </button>
          </div>
        </Seccion>

        <Seccion id="aj-datos" titulo="Datos de la tienda (archivo JSON)">
          <p>
            Esta aplicación no tiene base de datos: todo vive en un archivo JSON que controlas tú. Cárgalo para seguir
            trabajando y descárgalo al terminar para guardar los cambios.
          </p>
          <div className="acciones">
            <button type="button" className="boton" onClick={guardar}>
              <Icono nombre="guardar" tamano={18} />
              Guardar datos (descargar JSON)
            </button>
            <button type="button" className="boton boton--secundario" onClick={() => entrada.current.click()}>
              Cargar archivo JSON
            </button>
            <input ref={entrada} type="file" accept=".json,application/json" hidden tabIndex={-1} onChange={alElegirArchivo} />
            <button type="button" className="boton boton--secundario" onClick={restablecer}>
              Restablecer datos de demostración
            </button>
          </div>
          <p role="status" className={sinGuardar ? 'estado-datos estado-datos--aviso' : 'estado-datos'}>
            {estadoDatos}
          </p>
        </Seccion>

        <Seccion id="aj-edicion" titulo="Edición de textos">
          <p>
            Activa el modo edición para cambiar los textos de las incidencias, los mensajes y las instrucciones. No cambia los
            datos de pedidos, clientes ni usuarios.
          </p>
          <div className="opcion">
            <input id="modo-edicion" type="checkbox" checked={modoEdicion} onChange={(e) => setModoEdicion(e.target.checked)} />
            <label htmlFor="modo-edicion">Modo edición de textos</label>
          </div>
        </Seccion>
      </div>
    </>
  );
}
