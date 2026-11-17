import Icono from './Icono';

// Tarjeta de indicador. Se lee en este orden: nombre, valor, nota.
export default function Kpi({ icono, etiqueta, valor, nota, tono = 'azul', enlace }) {
  return (
    <li className={`kpi kpi--${tono}`}>
      <span className="kpi__icono" aria-hidden="true">
        <Icono nombre={icono} />
      </span>
      <div className="kpi__texto">
        <p className="kpi__etiqueta">{etiqueta}</p>
        <p className="kpi__valor">{valor}</p>
        <p className="kpi__nota">
          {enlace ? <a href={enlace.href}>{enlace.texto}</a> : nota}
        </p>
      </div>
    </li>
  );
}
