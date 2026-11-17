// "Base de datos" de Tienda Monteclaro S.L. (empresa inventada) en un único objeto.
// Se puede descargar como JSON y volver a cargar. TODO es inventado.
// El fallo del ticket A (comparación estricta de estados) es una PROPUESTA de borrador.

export const ID_APP = 'monteclaro-panel-demo';
export const VERSION_ESQUEMA = 3;

export const proyectoPorDefecto = {
  app: ID_APP,
  version: VERSION_ESQUEMA,
  guardadoEn: null,
  autor: 'Guillermo · The Bulliam',

  // Ajuste técnico de la aplicación. 'estricta' = el fallo del ticket A. 'flexible' = corregido.
  config: { comparacionEstados: 'estricta' },

  usuarios: [
    { id: 'u1', nombre: 'Guillermo (soporte técnico)', correo: 'soporte@monteclaro.example', rol: 'admin', activo: true },
    { id: 'u2', nombre: 'Elena Marín', correo: 'elena.marin@monteclaro.example', rol: 'gestion', activo: true },
    { id: 'u3', nombre: 'Sergio Pardo', correo: 'sergio.pardo@monteclaro.example', rol: 'gestion', activo: true },
  ],

  clientes: [
    { id: 'c1', nombre: 'Marta Olivares', ciudad: 'Burgos', correo: 'marta.olivares@example.com' },
    { id: 'c2', nombre: 'Jorge Lasheras', ciudad: 'Zaragoza', correo: 'jorge.lasheras@example.com' },
    { id: 'c3', nombre: 'Irene Valbuena', ciudad: 'León', correo: 'irene.valbuena@example.com' },
    { id: 'c4', nombre: 'Hugo Barrantes', ciudad: 'Soria', correo: 'hugo.barrantes@example.com' },
    { id: 'c5', nombre: 'Noa Quintela', ciudad: 'Lugo', correo: 'noa.quintela@example.com' },
    { id: 'c6', nombre: 'Álvaro Cienfuegos', ciudad: 'Oviedo', correo: 'alvaro.cienfuegos@example.com' },
    { id: 'c7', nombre: 'Paula Mendizábal', ciudad: 'Vitoria', correo: 'paula.mendizabal@example.com' },
    { id: 'c8', nombre: 'Rubén Calatayud', ciudad: 'Teruel', correo: 'ruben.calatayud@example.com' },
  ],

  // Tras la actualización de ayer, los estados se guardan en minúsculas.
  pedidos: [
    { id: 'PED-2041', clienteId: 'c1', articulos: 2, importe: 38.9, fecha: '11/11/2026', estado: 'pendiente' },
    { id: 'PED-2042', clienteId: 'c2', articulos: 1, importe: 12.5, fecha: '11/11/2026', estado: 'pendiente' },
    { id: 'PED-2043', clienteId: 'c3', articulos: 4, importe: 96.0, fecha: '11/11/2026', estado: 'pendiente' },
    { id: 'PED-2044', clienteId: 'c4', articulos: 3, importe: 54.3, fecha: '12/11/2026', estado: 'pendiente' },
    { id: 'PED-2045', clienteId: 'c5', articulos: 1, importe: 21.0, fecha: '12/11/2026', estado: 'pendiente' },
    { id: 'PED-2038', clienteId: 'c6', articulos: 2, importe: 29.8, fecha: '10/11/2026', estado: 'enviado' },
    { id: 'PED-2039', clienteId: 'c7', articulos: 1, importe: 17.95, fecha: '10/11/2026', estado: 'enviado' },
    { id: 'PED-2040', clienteId: 'c8', articulos: 5, importe: 112.4, fecha: '10/11/2026', estado: 'enviado' },
    { id: 'PED-2034', clienteId: 'c1', articulos: 1, importe: 24.0, fecha: '08/11/2026', estado: 'entregado' },
    { id: 'PED-2035', clienteId: 'c2', articulos: 3, importe: 61.2, fecha: '08/11/2026', estado: 'entregado' },
    { id: 'PED-2036', clienteId: 'c6', articulos: 2, importe: 33.5, fecha: '09/11/2026', estado: 'entregado' },
    { id: 'PED-2037', clienteId: 'c3', articulos: 1, importe: 15.9, fecha: '09/11/2026', estado: 'entregado' },
    { id: 'PED-2028', clienteId: 'c3', articulos: 2, importe: 31.4, fecha: '06/11/2026', estado: 'entregado' },
    { id: 'PED-2029', clienteId: 'c5', articulos: 1, importe: 19.9, fecha: '06/11/2026', estado: 'entregado' },
    { id: 'PED-2030', clienteId: 'c7', articulos: 3, importe: 58.6, fecha: '07/11/2026', estado: 'entregado' },
    { id: 'PED-2031', clienteId: 'c4', articulos: 2, importe: 27.8, fecha: '07/11/2026', estado: 'entregado' },
    { id: 'PED-2032', clienteId: 'c1', articulos: 4, importe: 84.0, fecha: '07/11/2026', estado: 'entregado' },
    { id: 'PED-2033', clienteId: 'c8', articulos: 1, importe: 14.5, fecha: '07/11/2026', estado: 'entregado' },
  ],

  // Pasos hechos en cada caso (se guarda en el JSON)
  progreso: { casoA: [], casoB: [] },

  // ---------- Incidencias y peticiones ----------
  tickets: {
    A: {
      codigo: 'INC-0412',
      estado: 'abierta',
      solicitante: 'Elena Marín',
      abierto: '12/11/2026',
      asunto: 'La lista de pedidos de la aplicación aparece vacía y no se pueden preparar los envíos de hoy',
      categoria: 'Aplicación web de pedidos',
      subcategoria: 'Lista de pedidos · no muestra datos',
      tipo: 'Incidencia',
      impacto: 'Alto',
      urgencia: 'Alta',
      prioridad: '1 · Crítica',
      justificacion:
        'Impacto alto porque afecta a todo el equipo de pedidos y a los clientes que esperan su envío. Urgencia alta porque los envíos de hoy tienen que salir hoy.',
      descripcion:
        'Desde esta mañana la lista de pedidos pendientes sale vacía para Elena, responsable de pedidos. Ayer había pedidos. No aparece ningún mensaje de error. Sin la lista, el equipo no puede preparar los envíos de hoy.',
      acciones:
        'He pedido a Elena una captura de pantalla y la hora a la que vio pedidos por última vez. He comprobado que la aplicación está accesible y que no hay una caída general del servicio. He comprobado que Elena puede iniciar sesión sin problemas.',
      respuesta:
        'Hola, Elena:\n\nHe recibido tu ticket sobre la lista de pedidos vacía. Lo he marcado como prioridad crítica porque afecta a los envíos de hoy, y ya lo estoy revisando.\n\nTe escribiré en cuanto sepa la causa o necesite algo de ti. Gracias por avisar.\n\nGuillermo\nSoporte técnico · Tienda Monteclaro S.L.',
    },
    B: {
      codigo: 'SOL-0413',
      estado: 'abierta',
      solicitante: 'Elena Marín',
      abierto: '12/11/2026',
      asunto: 'Alta de acceso de solo consulta a pedidos para Daniel, nueva incorporación',
      categoria: 'Accesos y permisos',
      subcategoria: 'Alta de usuario · rol de solo lectura',
      tipo: 'Petición de servicio',
      impacto: 'Bajo',
      urgencia: 'Media',
      prioridad: '4 · Baja',
      justificacion:
        'Impacto bajo porque afecta a una sola persona y no impide trabajar a nadie más. Urgencia media porque Daniel empieza esta semana y necesitará consultar pedidos pronto, aunque hoy no hay nada bloqueado.',
      descripcion:
        'Entra una persona nueva en la tienda (Daniel, nombre inventado). Necesita consultar los pedidos, pero no debe poder crear, modificar ni borrar nada.',
      acciones:
        'He confirmado con Elena que ella aprueba la petición. He comprobado que la aplicación tiene un rol de solo consulta.',
      respuesta:
        'Hola, Elena:\n\nHe recibido la petición de acceso para Daniel. La atenderé en cuanto termine con la incidencia de la lista de pedidos, que bloquea los envíos de hoy.\n\nTe avisaré cuando el acceso esté listo.\n\nGuillermo\nSoporte técnico · Tienda Monteclaro S.L.',
    },
  },
  orden: {
    primero: 'Ticket A',
    explicacion:
      'Atiendo primero el ticket A porque es una incidencia que bloquea los envíos de hoy (prioridad 1). El ticket B es una petición de una sola persona, se puede planificar (prioridad 4) y puede esperar unas horas sin causar daño.',
  },

  // ---------- Plan de resolución de la incidencia A ----------
  pasosA: [
    {
      fase: 'Escuchar',
      titulo: 'Escuchar a Elena y confirmar qué ve',
      accion:
        'Leo el ticket y pregunto a Elena qué pantalla está viendo, desde cuándo ocurre y si aparece algún mensaje de error. Le pido una captura.',
      donde: { ruta: '/incidencias', texto: 'Abrir la incidencia en la bandeja' },
      esperado:
        'Elena confirma que la lista sale vacía desde esta mañana, sin mensaje de error, y que ayer sí había pedidos.',
      siFalla:
        'Elena, gracias por avisar. Para ayudarte rápido, ¿me puedes mandar una captura de la pantalla y decirme a qué hora viste pedidos por última vez? No hace falta que pruebes nada más.',
      observado: 'Sin error visible, desde las 8:30, y ayer había 5 pedidos pendientes de envío.',
    },
    {
      fase: 'Investigar',
      titulo: 'Reproducir el problema',
      accion: 'Abro la lista de pedidos con el filtro «Pendientes de envío», el que usa Elena.',
      donde: { ruta: '/pedidos', texto: 'Abrir Pedidos' },
      esperado: 'Veo el mismo mensaje «No hay pedidos que mostrar». Así sé que no es un problema solo de su equipo.',
      siFalla:
        'Elena, desde mi lado no consigo ver el fallo. ¿Puedes probar en una ventana privada del navegador y decirme si sigue vacía?',
      observado: 'Reproducido: la lista sale vacía y no hay ningún mensaje de error.',
    },
    {
      fase: 'Investigar',
      titulo: 'Mirar la pestaña Red del inspector',
      accion:
        'Abro las herramientas de diagnóstico (en un navegador real sería F12), pestaña Red, y miro la petición que pide los pedidos.',
      donde: { ruta: '/diagnostico', texto: 'Abrir el diagnóstico, pestaña Red' },
      esperado:
        'Veo qué dirección se consulta y qué responde el servidor: si es un error (4xx o 5xx) o una respuesta correcta pero vacía.',
      siFalla:
        'Elena, sigo revisando la parte técnica. No necesitas hacer nada; te escribo en cuanto tenga novedades.',
      observado:
        'La petición GET /api/pedidos?estado=PENDIENTE responde 200 OK, no un error, pero con una lista vacía. El filtro va en mayúsculas.',
    },
    {
      fase: 'Investigar',
      titulo: 'Mirar la consola del navegador',
      accion: 'Abro la pestaña Consola y busco errores en rojo.',
      donde: { ruta: '/diagnostico', texto: 'Abrir el diagnóstico, pestaña Consola' },
      esperado: 'No hay errores. Si los hubiera, el fallo estaría en el código de la página y no en los datos.',
      siFalla:
        'Elena, he encontrado un error en la propia página y lo estoy revisando. Seguiré informándote.',
      observado: 'La consola solo tiene líneas informativas, sin errores. Descarto un fallo de la interfaz.',
    },
    {
      fase: 'Plantear una hipótesis',
      titulo: 'Formular la hipótesis',
      accion:
        'Comparo el Panel (que dice que hay pedidos pendientes) con la lista (que sale vacía). Pruebo también el filtro «Todos».',
      donde: { ruta: '/', texto: 'Abrir el Panel' },
      esperado:
        'El Panel cuenta 5 pedidos pendientes y con «Todos» la lista sí muestra pedidos. Los datos existen: falla el filtro.',
      siFalla:
        'Elena, todavía no tengo la causa. Mientras tanto, si eliges «Todos» en el filtro de estado podrás ver los pedidos. Sigo investigando.',
      observado:
        'Hipótesis: la página pide el estado «PENDIENTE» en mayúsculas, pero tras la actualización de ayer la base de datos guarda «pendiente» en minúsculas.',
    },
    {
      fase: 'Probar',
      titulo: 'Probar la hipótesis con consultas',
      accion:
        'En la base de datos de ejemplo (solo lectura) consulto qué estados existen y pruebo la búsqueda con los dos formatos.',
      donde: { ruta: '/diagnostico', texto: 'Abrir el diagnóstico, pestaña Base de datos' },
      esperado: 'Con «pendiente» salen 5 pedidos y con «PENDIENTE», ninguno.',
      siFalla:
        'Elena, mi primera prueba no lo ha confirmado. Estoy probando otra posibilidad. No se ha perdido ningún dato.',
      observado: 'Confirmado: «pendiente» devuelve 5 pedidos; «PENDIENTE», ninguno.',
    },
    {
      fase: 'Confirmar',
      titulo: 'Aplicar la corrección y confirmar',
      accion:
        'En Configuración cambio la comparación de estados a «sin distinguir mayúsculas y minúsculas». Después vuelvo a Pedidos y recargo la lista.',
      donde: { ruta: '/configuracion', texto: 'Abrir Configuración' },
      esperado: 'La lista de pendientes muestra los 5 pedidos y Elena confirma que ya puede preparar los envíos.',
      siFalla:
        'Elena, el arreglo todavía no se ve en tu pantalla. Prueba a recargar con Ctrl+F5. Si sigue igual, te llamo y lo vemos juntos.',
      observado: 'Tras el cambio, la lista muestra los 5 pedidos. Elena confirma que ya puede preparar los envíos.',
    },
    {
      fase: 'Documentar',
      titulo: 'Documentar y cerrar el ticket',
      accion: 'Escribo la nota para la base de conocimiento y el correo de cierre para Elena, y cierro el ticket.',
      donde: { ruta: '/incidencias/a', texto: 'Ver el cierre en esta incidencia' },
      esperado:
        'Otra persona del equipo podría repetir el diagnóstico leyendo la nota. El ticket queda cerrado con la causa y la solución.',
      siFalla:
        'Elena, mantengo el ticket abierto unas horas más para vigilar que no vuelva a pasar. Si ves la lista vacía otra vez, respóndeme a este correo.',
      observado: 'Nota y correo de cierre listos. Ticket cerrado.',
    },
  ],

  // ---------- Plan de resolución de la petición B ----------
  pasosB: [
    {
      fase: 'Comprobar',
      titulo: 'Comprobar la aprobación de la petición',
      accion: 'Leo el ticket y confirmo que Elena, responsable de pedidos, ha aprobado el acceso por escrito.',
      donde: { ruta: '/incidencias', texto: 'Abrir la incidencia en la bandeja' },
      esperado: 'Tengo la aprobación escrita y sé qué rol necesita la persona nueva: solo consulta.',
      siFalla: 'Elena, antes de crear el acceso necesito que me confirmes por escrito que lo apruebas, y que me indiques el nombre y el correo de la persona nueva.',
      observado: 'Aprobación recibida. Rol necesario: solo consulta.',
    },
    {
      fase: 'Crear',
      titulo: 'Crear el usuario con el rol de solo consulta',
      accion: 'En Usuarios relleno el formulario con el nombre y el correo de la persona nueva y elijo el rol «Solo consulta».',
      donde: { ruta: '/usuarios', texto: 'Abrir Usuarios' },
      esperado: 'El usuario aparece en la lista con el rol «Solo consulta» y la aplicación avisa de que se ha creado.',
      siFalla: 'Elena, no he podido crear el acceso porque faltan datos o el correo ya existe. ¿Me confirmas el correo de Daniel?',
      observado: 'Usuario creado con el rol «Solo consulta». Es el único rol que se le asigna.',
    },
    {
      fase: 'Probar',
      titulo: 'Comprobar los permisos del usuario nuevo',
      accion: 'Pulso «Comprobar permisos» en la fila del usuario nuevo. La comprobación intenta leer y modificar un pedido, sin cambiar nada.',
      donde: { ruta: '/usuarios', texto: 'Abrir Usuarios' },
      esperado: 'Leer pedidos responde 200 (permitido) y modificar un pedido responde 403 (rechazado).',
      siFalla: 'Elena, el acceso de Daniel todavía no está listo: lo estoy ajustando para que solo pueda consultar. Te aviso en cuanto lo termine.',
      observado: 'Lectura 200, modificación 403. El rol funciona como se pidió.',
    },
    {
      fase: 'Probar',
      titulo: 'Entrar como la persona nueva y comprobarlo con los ojos',
      accion: 'Pulso «Entrar como» en la fila del usuario nuevo y abro Pedidos.',
      donde: { ruta: '/usuarios', texto: 'Abrir Usuarios' },
      esperado: 'Veo y busco pedidos, pero no aparece ningún botón para cambiarlos. Tampoco veo Usuarios ni Configuración.',
      siFalla: 'Elena, estoy corrigiendo un detalle del acceso. No le des todavía la dirección a Daniel.',
      observado: 'Solo puede consultar. No hay botones de edición ni menús de administración.',
    },
    {
      fase: 'Entregar',
      titulo: 'Enviar las instrucciones a la persona nueva',
      accion: 'Envío a la persona nueva la página «Primeros pasos», con instrucciones de una frase por paso.',
      donde: { ruta: '/primeros-pasos', texto: 'Abrir Primeros pasos' },
      esperado: 'La persona nueva puede entrar y consultar pedidos siguiendo solo esas instrucciones.',
      siFalla: 'Elena, Daniel me dice que no consigue entrar. Le voy a llamar para ver juntos en qué paso se queda.',
      observado: 'Instrucciones enviadas por un canal distinto al de la contraseña.',
    },
    {
      fase: 'Documentar',
      titulo: 'Documentar y cerrar el ticket',
      accion: 'Escribo la nota para la base de conocimiento y el correo de cierre, y cierro el ticket.',
      donde: { ruta: '/incidencias/b', texto: 'Ver el cierre en esta incidencia' },
      esperado: 'Otra persona del equipo podría repetir el alta leyendo la nota. El ticket queda cerrado.',
      siFalla: 'Elena, dejo el ticket abierto hasta que Daniel confirme que ya puede consultar pedidos.',
      observado: 'Nota y correo de cierre listos. Ticket cerrado.',
    },
  ],

  // Instrucciones para la persona nueva (una frase por paso)
  instruccionesUsuario: [
    { texto: 'Abre la dirección web de Monteclaro Panel que te envió soporte.' },
    { texto: 'En la pantalla de entrada, elige tu usuario.' },
    { texto: 'En el menú principal, entra en «Pedidos» para ver la lista.' },
    { texto: 'Usa el filtro de estado y el buscador para encontrar el pedido que necesites.' },
    { texto: 'Pulsa «Ver ficha» para leer el pedido completo. Recuerda que tu acceso es de solo consulta y no podrás cambiarlo.' },
    { texto: 'Si ves un botón para modificar pedidos o usuarios, avisa a soporte.' },
  ],

  // ---------- Comunicación (Fase 4) ----------
  comunicacion: [
    {
      id: 'cierre-a',
      tipo: 'Correo de cierre · Ticket A',
      para: 'Elena (responsable de pedidos)',
      asunto: 'Resuelto: la lista de pedidos vuelve a mostrar los envíos',
      cuerpo:
        'Hola, Elena:\n\nTe confirmo que la lista de pedidos ya funciona con normalidad y se ven los 5 pedidos pendientes de envío de hoy.\n\nQué pasaba: ayer, tras una actualización, la aplicación cambió la forma de guardar el estado de los pedidos y la lista dejó de reconocerlos. Por eso salía vacía. No se perdió ningún pedido.\n\nQué hemos hecho: hemos ajustado la lista para que los reconozca y lo hemos comprobado contigo.\n\nSi vuelve a ocurrir, respóndeme a este correo y lo revisamos enseguida.\n\nUn saludo,\nGuillermo\nSoporte técnico · Tienda Monteclaro S.L.',
    },
    {
      id: 'instrucciones-elena',
      tipo: 'Correo con instrucciones para Elena (persona no técnica)',
      para: 'Elena (responsable de pedidos)',
      asunto: 'Qué hacer si la lista de pedidos sale vacía otra vez',
      cuerpo:
        'Hola, Elena:\n\nPor si vuelve a pasar, estos son los pasos, de más sencillo a menos:\n\n1. Pulsa a la vez las teclas Ctrl y F5. Esto recarga la página desde cero.\n2. Si sigue vacía, elige «Todos» en el filtro de estado: así verás los pedidos mientras lo arreglamos.\n3. Haz una captura de la pantalla y respóndeme a este correo con la hora a la que dejaste de ver pedidos.\n\nNo hace falta que toques nada más. Con esa información lo reviso enseguida.\n\nUn saludo,\nGuillermo',
    },
    {
      id: 'nota-a',
      tipo: 'Nota interna · Ticket A (base de conocimiento)',
      para: 'Equipo de soporte',
      asunto: 'Lista de pedidos vacía tras una actualización',
      cuerpo:
        'Qué pasó: la lista de pedidos pendientes salía vacía para todo el equipo, sin error visible. La petición del navegador respondía 200 OK con una lista vacía.\n\nQué se hizo: se reprodujo el fallo, se revisó la pestaña Red y la Consola, se planteó una hipótesis y se probó con consultas de solo lectura.\n\nQué lo resolvió: la página pedía el estado «PENDIENTE» en mayúsculas y la base de datos pasó a guardar «pendiente» en minúsculas. Se cambió la comparación de estados para que no distinga mayúsculas de minúsculas.\n\nCómo evitarlo: probar la lista de pedidos después de cada actualización y, si cambia el formato de un campo, revisar todos los filtros que lo usan.',
    },
    {
      id: 'cierre-b',
      tipo: 'Correo de cierre · Ticket B',
      para: 'Elena (responsable de pedidos), con copia a Daniel',
      asunto: 'Resuelto: acceso de solo consulta a pedidos creado para Daniel',
      cuerpo:
        'Hola, Elena:\n\nEl acceso de Daniel ya está creado. Puede ver y buscar pedidos, pero no puede cambiar, crear ni borrar nada.\n\nDaniel recibirá por separado las instrucciones para entrar.\n\nSi en el futuro necesita más permisos, tendrás que aprobarlo en una petición nueva.\n\nUn saludo,\nGuillermo\nSoporte técnico · Tienda Monteclaro S.L.',
    },
    {
      id: 'nota-b',
      tipo: 'Nota interna · Ticket B (base de conocimiento)',
      para: 'Equipo de soporte',
      asunto: 'Alta de usuario con acceso de solo consulta a pedidos',
      cuerpo:
        'Qué pasó: una persona nueva necesitaba consultar pedidos sin poder cambiar nada.\n\nQué se hizo: se comprobó la aprobación de la responsable de pedidos, se creó el usuario con el rol «Solo consulta» y se comprobó que leer es 200 y modificar es 403.\n\nQué lo resolvió: asignar únicamente el rol de solo lectura.\n\nCómo repetirlo: seguir siempre la misma lista de pasos, pedir la aprobación por escrito y enviar las instrucciones por un canal distinto al de cualquier contraseña.',
    },
  ],
};
