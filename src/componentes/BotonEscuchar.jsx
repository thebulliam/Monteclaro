import { useVoz } from '../contextos/VozContext';
import { textoDe } from '../utilidades/textoParaVoz';
import Icono from './Icono';

// Botón que lee en voz alta el contenido de la tarjeta a la que pertenece.
export default function BotonEscuchar({ id, destino, etiqueta }) {
  const { soportado, leyendo, hablar, detener } = useVoz();
  if (!soportado) return null;

  const activo = leyendo === id;
  const alPulsar = () => {
    if (activo) detener();
    else hablar(textoDe(destino.current), id);
  };

  return (
    <button
      type="button"
      className="boton boton--fantasma boton--pequeno"
      data-no-voz
      onClick={alPulsar}
      aria-label={`${activo ? 'Detener la lectura de' : 'Escuchar'} la sección: ${etiqueta}`}
    >
      <Icono nombre={activo ? 'parar' : 'voz'} tamano={16} />
      {activo ? 'Detener' : 'Escuchar'}
    </button>
  );
}
