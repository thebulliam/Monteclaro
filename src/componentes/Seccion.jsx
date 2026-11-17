import { useRef } from 'react';
import BotonEscuchar from './BotonEscuchar';

// Tarjeta de contenido con su título y su propio botón "Escuchar".
// resumen = true → entra en la lectura automática "Título y resumen".
export default function Seccion({ id, titulo, nivel = 2, resumen = false, className = '', acciones = null, children }) {
  const ref = useRef(null);
  const idTitulo = `${id}-titulo`;
  const Titulo = `h${nivel}`;

  return (
    <section
      ref={ref}
      aria-labelledby={idTitulo}
      className={`seccion seccion--n${nivel} ${className}`.trim()}
      data-resumen={resumen ? 'si' : undefined}
    >
      <div className="seccion__cabecera">
        <Titulo id={idTitulo}>{titulo}</Titulo>
        <div className="seccion__acciones" data-no-voz>
          {acciones}
          <BotonEscuchar id={id} destino={ref} etiqueta={titulo} />
        </div>
      </div>
      <div className="seccion__cuerpo">{children}</div>
    </section>
  );
}
