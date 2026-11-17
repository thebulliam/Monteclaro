// Páginas de la aplicación.
// permiso: qué permiso hace falta para verla. publica: se ve sin entrar. menu: aparece en el menú lateral.
export const GRUPOS = [
  { id: 'tienda', titulo: 'Tienda' },
  { id: 'soporte', titulo: 'Soporte y administración' },
  { id: 'ayuda', titulo: 'Ayuda' },
];

export const RUTAS = [
  { ruta: '/', etiqueta: 'Resumen', titulo: 'Resumen de Monteclaro', menu: true, grupo: 'tienda', icono: 'inicio' },
  { ruta: '/pedidos', etiqueta: 'Pedidos', titulo: 'Pedidos', menu: true, grupo: 'tienda', icono: 'pedidos' },
  { ruta: '/clientes', etiqueta: 'Clientes', titulo: 'Clientes', menu: true, grupo: 'tienda', icono: 'clientes' },
  { ruta: '/incidencias', etiqueta: 'Incidencias', titulo: 'Incidencias y peticiones', permiso: 'soporte', menu: true, grupo: 'soporte', icono: 'incidencias' },
  { ruta: '/incidencias/a', etiqueta: 'Incidencia INC-0412', titulo: 'Incidencia INC-0412 · Lista de pedidos vacía', permiso: 'soporte' },
  { ruta: '/incidencias/b', etiqueta: 'Petición SOL-0413', titulo: 'Petición SOL-0413 · Acceso de solo consulta', permiso: 'soporte' },
  { ruta: '/usuarios', etiqueta: 'Usuarios y permisos', titulo: 'Usuarios y permisos', permiso: 'usuarios', menu: true, grupo: 'soporte', icono: 'usuarios' },
  { ruta: '/diagnostico', etiqueta: 'Diagnóstico', titulo: 'Herramientas de diagnóstico', permiso: 'soporte', menu: true, grupo: 'soporte', icono: 'diagnostico' },
  { ruta: '/configuracion', etiqueta: 'Configuración', titulo: 'Configuración del sistema', permiso: 'soporte', menu: true, grupo: 'soporte', icono: 'config' },
  { ruta: '/primeros-pasos', etiqueta: 'Primeros pasos', titulo: 'Primeros pasos para consultar pedidos', menu: true, grupo: 'ayuda', icono: 'ayuda' },
  { ruta: '/ajustes', etiqueta: 'Accesibilidad y datos', titulo: 'Accesibilidad, voz y archivo de datos', publica: true, menu: true, grupo: 'ayuda', icono: 'accesibilidad' },
  { ruta: '/privacidad', etiqueta: 'Privacidad', titulo: 'Qué guarda este sitio y qué no', publica: true, menu: true, grupo: 'ayuda', icono: 'privacidad' },
];
