import Seccion from '../componentes/Seccion';
import Campo from '../componentes/Campo';
import { useDatos } from '../contextos/DatosContext';

export default function PrimerosPasos() {
  const { datos, modoEdicion } = useDatos();
  return (
    <>
      <h1 tabIndex={-1}>Primeros pasos para consultar pedidos</h1>
      <Seccion id="pp-pasos" titulo="Si eres una persona nueva en la tienda" resumen>
        <p>Sigue estos pasos, una frase por paso. Tu acceso es de solo consulta: puedes mirar, pero no cambiar nada.</p>
        <ol>
          {datos.instruccionesUsuario.map((paso, i) => (
            <li key={i}>
              {modoEdicion ? (
                <Campo etiqueta={`Paso ${i + 1}`} ruta={['instruccionesUsuario', i, 'texto']} multilinea filas={2} />
              ) : (
                paso.texto
              )}
            </li>
          ))}
        </ol>
      </Seccion>
    </>
  );
}
