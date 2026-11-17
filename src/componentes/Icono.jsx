// Iconos de trazo simple. Son decorativos: siempre van con texto al lado, por eso están ocultos al lector de pantalla.
const TRAZOS = {
  inicio: 'M3 11l9-8 9 8v10a1 1 0 0 1-1 1h-5v-6h-6v6H4a1 1 0 0 1-1-1z',
  pedidos: 'M21 8l-9-5-9 5v8l9 5 9-5z M3 8l9 5 9-5 M12 13v8',
  clientes: 'M16 21v-2a4 4 0 0 0-4-4H6a4 4 0 0 0-4 4v2 M9 11a4 4 0 1 0 0-8 4 4 0 0 0 0 8z M22 21v-2a4 4 0 0 0-3-3.9 M16 3.1a4 4 0 0 1 0 7.8',
  incidencias: 'M12 9v4 M12 17h.01 M10.3 3.9L1.8 18a2 2 0 0 0 1.7 3h17a2 2 0 0 0 1.7-3L13.7 3.9a2 2 0 0 0-3.4 0z',
  usuarios: 'M12 22s8-4 8-10V5l-8-3-8 3v7c0 6 8 10 8 10z',
  diagnostico: 'M22 12h-4l-3 9L9 3l-3 9H2',
  config: 'M4 21v-7 M4 10V3 M12 21v-9 M12 8V3 M20 21v-5 M20 12V3 M1 14h6 M9 8h6 M17 16h6',
  ayuda: 'M12 22a10 10 0 1 0 0-20 10 10 0 0 0 0 20z M9.1 9a3 3 0 0 1 5.8 1c0 2-3 3-3 3 M12 17h.01',
  accesibilidad: 'M12 4.5a1.5 1.5 0 1 0 0 .01 M4 8l8 1.5L20 8 M12 9.5V14 M8.5 21l3.5-7 3.5 7',
  privacidad: 'M5 11h14v10H5z M8 11V7a4 4 0 0 1 8 0v4',
  ventas: 'M23 6l-9.5 9.5-5-5L1 18 M17 6h6v6',
  euro: 'M18 7a7 7 0 1 0 0 10 M4 10h9 M4 14h9',
  guardar: 'M19 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h11l5 5v11a2 2 0 0 1-2 2z M17 21v-8H7v8 M7 3v5h8',
  voz: 'M11 5L6 9H2v6h4l5 4z M15.5 8.5a5 5 0 0 1 0 7 M19 5a10 10 0 0 1 0 14',
  parar: 'M6 6h12v12H6z',
  menu: 'M3 6h18 M3 12h18 M3 18h18',
  cerrar: 'M6 6l12 12 M18 6L6 18',
  entrar: 'M15 3h4a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2h-4 M10 17l5-5-5-5 M15 12H3',
};

export default function Icono({ nombre, tamano = 20 }) {
  return (
    <svg
      className="icono"
      width={tamano}
      height={tamano}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      aria-hidden="true"
      focusable="false"
    >
      <path d={TRAZOS[nombre] || TRAZOS.inicio} />
    </svg>
  );
}
