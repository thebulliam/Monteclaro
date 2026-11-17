import Seccion from '../componentes/Seccion';
import { useDatos } from '../contextos/DatosContext';
import { useAvisos } from '../contextos/AvisosContext';

export default function Configuracion() {
  const { datos, actualizar } = useDatos();
  const { avisar } = useAvisos();
  const actual = datos.config.comparacionEstados;

  const cambiar = (valor) => {
    actualizar(['config', 'comparacionEstados'], valor);
    avisar(
      valor === 'flexible'
        ? 'Comparación de estados cambiada: ya no distingue mayúsculas y minúsculas.'
        : 'Comparación de estados cambiada: estricta, distingue mayúsculas y minúsculas.'
    );
  };

  return (
    <>
      <h1 tabIndex={-1}>Configuración técnica</h1>

      <Seccion id="conf-estados" titulo="Comparación de estados en los filtros" resumen>
        <p>
          Define cómo compara la aplicación el estado que pide un filtro con el que está guardado en la base de
          datos. La última actualización (12/11/2026) pasó los estados guardados a minúsculas.
        </p>
        <fieldset className="opciones">
          <legend>Comparación de estados</legend>
          <div className="opcion">
            <input
              id="comp-estricta"
              type="radio"
              name="comparacion"
              checked={actual === 'estricta'}
              onChange={() => cambiar('estricta')}
            />
            <label htmlFor="comp-estricta">
              Estricta: distingue mayúsculas y minúsculas (ajuste actual desde la actualización)
            </label>
          </div>
          <div className="opcion">
            <input
              id="comp-flexible"
              type="radio"
              name="comparacion"
              checked={actual === 'flexible'}
              onChange={() => cambiar('flexible')}
            />
            <label htmlFor="comp-flexible">Flexible: no distingue mayúsculas y minúsculas</label>
          </div>
        </fieldset>
        <p role="status">Ajuste activo ahora: {actual === 'estricta' ? 'estricta' : 'flexible'}.</p>
      </Seccion>
    </>
  );
}
