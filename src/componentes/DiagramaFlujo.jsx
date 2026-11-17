// Diagrama del ticket A. Es una imagen con texto alternativo completo (role="img", title y desc),
// y el mismo contenido está escrito en el pie de figura para quien no vea el dibujo.
export default function DiagramaFlujo() {
  return (
    <figure className="figura">
      <svg
        viewBox="0 0 820 230"
        role="img"
        aria-labelledby="diagrama-titulo diagrama-desc"
        className="diagrama"
      >
        <title id="diagrama-titulo">Cómo viaja la petición de pedidos y dónde falla</title>
        <desc id="diagrama-desc">
          Tres cajas conectadas de izquierda a derecha: la página de pedidos, el servidor y la base de datos.
          La página pide pedidos con el estado PENDIENTE en mayúsculas. La base de datos los guarda como
          pendiente en minúsculas. Como no coinciden, el servidor responde correctamente pero con una lista
          vacía.
        </desc>

        <defs>
          <marker id="flecha" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="8" markerHeight="8" orient="auto">
            <path d="M0 0 L10 5 L0 10 z" className="diagrama__flecha" />
          </marker>
        </defs>

        <g className="diagrama__caja">
          <rect x="10" y="70" width="210" height="90" rx="10" />
          <rect x="305" y="70" width="210" height="90" rx="10" />
          <rect x="600" y="70" width="210" height="90" rx="10" />
        </g>

        <g className="diagrama__texto" textAnchor="middle">
          <text x="115" y="108" fontWeight="700">Página de pedidos</text>
          <text x="115" y="134">pide estado=PENDIENTE</text>
          <text x="410" y="108" fontWeight="700">Servidor</text>
          <text x="410" y="134">responde 200 OK</text>
          <text x="705" y="108" fontWeight="700">Base de datos</text>
          <text x="705" y="134">guarda «pendiente»</text>
        </g>

        <g className="diagrama__linea">
          <line x1="222" y1="115" x2="302" y2="115" markerEnd="url(#flecha)" />
          <line x1="517" y1="115" x2="597" y2="115" markerEnd="url(#flecha)" />
        </g>

        <g className="diagrama__alerta" textAnchor="middle">
          <text x="410" y="40" fontWeight="700">≠ mayúsculas y minúsculas</text>
          <text x="410" y="62">0 coincidencias</text>
          <text x="410" y="195" fontWeight="700">Respuesta: lista vacía []</text>
        </g>
      </svg>
      <figcaption>
        Figura 1. La página pide «PENDIENTE» en mayúsculas, la base de datos guarda «pendiente» en minúsculas.
        No coinciden, así que el servidor responde bien pero sin ningún pedido.
      </figcaption>
    </figure>
  );
}
