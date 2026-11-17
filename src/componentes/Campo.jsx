import { useId } from 'react';
import { useDatos } from '../contextos/DatosContext';
import { getEn } from '../utilidades/objetos';

// Muestra un dato del proyecto. En modo edición se convierte en un campo de texto.
//  - ruta: dónde está el dato dentro del JSON, por ejemplo ['tickets', 'A', 'asunto']
//  - bloque: la etiqueta va encima del texto (para textos largos)
export default function Campo({ etiqueta, ruta, multilinea = false, bloque = false, filas = 4 }) {
  const { datos, modoEdicion, actualizar } = useDatos();
  const id = useId();
  const valor = getEn(datos, ruta) ?? '';

  if (modoEdicion) {
    const propiedades = {
      id,
      value: valor,
      onChange: (e) => actualizar(ruta, e.target.value),
    };
    return (
      <div className="campo campo--edicion">
        <label htmlFor={id}>{etiqueta}</label>
        {multilinea ? (
          <textarea rows={filas} {...propiedades} />
        ) : (
          <input type="text" {...propiedades} />
        )}
      </div>
    );
  }

  if (multilinea || bloque) {
    return (
      <div className="campo">
        <p className="campo__etiqueta">{etiqueta}</p>
        <div className="campo__texto">{valor}</div>
      </div>
    );
  }

  return (
    <p className="campo">
      <strong className="campo__etiqueta">{etiqueta}: </strong>
      {valor}
    </p>
  );
}
