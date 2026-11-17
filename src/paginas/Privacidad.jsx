import Seccion from '../componentes/Seccion';
import { useVoz } from '../contextos/VozContext';

export default function Privacidad() {
  const { borrarAjustes } = useVoz();

  return (
    <>
      <h1 tabIndex={-1}>Qué guarda este sitio y qué no</h1>

      <Seccion id="priv-resumen" titulo="En pocas palabras" resumen>
        <p>
          Este sitio no tiene cuentas reales, ni servidor propio, ni base de datos. Los datos de la tienda
          viven en la memoria de tu navegador mientras tienes la página abierta, y solo se guardan si tú
          descargas el archivo JSON.
        </p>
      </Seccion>

      <Seccion id="priv-no" titulo="Lo que este sitio no guarda">
        <ul>
          <li>No pide ni guarda tu nombre, tu correo ni ningún dato personal tuyo.</li>
          <li>No tiene contraseñas: entrar es elegir un usuario inventado.</li>
          <li>No usa cookies ni herramientas de analítica o seguimiento.</li>
          <li>No envía nada de lo que haces a ningún servidor.</li>
          <li>
            No pide las tipografías a servicios externos: vienen incluidas en el propio sitio.
          </li>
          <li>
            No contiene datos reales: Tienda Monteclaro, sus clientes, pedidos, usuarios y correos son
            inventados.
          </li>
        </ul>
      </Seccion>

      <Seccion id="priv-si" titulo="Lo que sí se guarda, y dónde">
        <ul>
          <li>
            <strong>Tus preferencias</strong> (velocidad de la voz, lectura automática y tamaño del texto) se
            guardan en este navegador, en este dispositivo, solo si las cambias. No salen de aquí.
          </li>
          <li>
            <strong>Los datos de la tienda y tu progreso</strong> (pedidos, usuarios que crees, ajustes y
            pasos hechos) viven en la memoria de la página. Si cierras la pestaña sin guardar, se pierden.
          </li>
          <li>
            <strong>Tu archivo JSON</strong> se crea en tu dispositivo cuando pulsas «Guardar progreso». Es
            tuyo: tú decides dónde guardarlo y a quién se lo das. No escribas datos reales en él.
          </li>
        </ul>
        <button type="button" className="boton" onClick={borrarAjustes}>
          Borrar mis preferencias de este navegador
        </button>
      </Seccion>

      <Seccion id="priv-voz" titulo="Sobre la voz">
        <p>
          La lectura en voz alta usa las voces de tu navegador o de tu dispositivo. Este sitio prioriza una
          voz instalada en el dispositivo. Aun así, algunos navegadores ofrecen voces que se procesan en los
          servidores de su fabricante. Si te preocupa, elige un navegador con voces locales o usa tu lector de
          pantalla.
        </p>
      </Seccion>

      <Seccion id="priv-alojamiento" titulo="Sobre el alojamiento">
        <p>
          Cuando el sitio se publique, el servicio que lo aloje puede guardar registros técnicos habituales,
          como la dirección IP de quien visita. Este sitio no los usa ni los consulta.
        </p>
      </Seccion>
    </>
  );
}
