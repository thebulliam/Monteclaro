# Monteclaro Panel · dashboard interno de Tienda Monteclaro S.L. (empresa inventada)

Proyecto final del Bootcamp Service Desk. React (create-react-app), componentes `.jsx` y CSS puro.
Soporte técnico y desarrollo: The Bulliam. Todos los datos son inventados.

## Arrancar
    npm install
    npm start          # http://localhost:3000
    npm run build      # versión para publicar (carpeta build/)

## Qué es
El panel que usa el equipo de la tienda: Resumen (KPIs, ventas por día, pedidos por estado, estado del sistema), Pedidos, Clientes,
Usuarios y permisos, y un módulo de soporte (Incidencias, Diagnóstico, Configuración). Marca propia (logo, Fraunces + Inter incluidas).

Los dos casos del proyecto se prueban dentro de la propia aplicación:
- INC-0412 (incidencia): la lista/tarjeta de "Pendientes de envío" sale vacía mientras el Resumen cuenta 5.
  Incidencias → plan de resolución → Diagnóstico (Red, Consola, Base de datos) → Configuración → comprobación automática → cerrar.
  Causa propuesta: el filtro pide 'PENDIENTE' y la BD guarda 'pendiente'.
- SOL-0413 (petición): Usuarios → crear usuario con rol "Solo consulta" → Comprobar permisos (200 / 403) → Entrar como.

Usuarios de demostración (sin contraseñas): Guillermo (soporte, admin), Elena y Sergio (gestión).

## Estructura (src/)
- `paginas/` Entrar, Resumen, Pedidos, Clientes, Usuarios, Incidencias, Incidencia, Diagnostico, Configuracion, PrimerosPasos, Ajustes, Privacidad, SinPermiso
- `componentes/` Seccion (tarjeta + botón Escuchar), Kpi, GraficoBarras, BarrasEstado, Insignia, Icono, Campo, MatrizITIL, DiagramaFlujo
- `contextos/` DatosContext (el JSON), ApiContext ("servidor" simulado con permisos y registro de peticiones), VozContext, AvisosContext
- `datos/proyectoPorDefecto.js` TODA la base de datos de la demo. `datos/menu.js` rutas, grupos y permisos.
- `utilidades/` permisos, pedidos (aquí vive el fallo), ventas, incidencias, ficheroJson, textoParaVoz, useRuta

## JSON como base de datos
«Guardar datos» (barra superior o página Accesibilidad y datos) descarga `proyecto-monteclaro-AAAA-MM-DD.json`; «Cargar archivo JSON» lo recupera.

## Voz y accesibilidad
Botón «Escuchar» en cada tarjeta y «Escuchar la página» arriba, lectura automática opcional, Alt+L / Escape, tamaño de texto,
gráficos con resumen escrito y tabla alternativa, estados siempre en texto, solo teclado, foco gestionado, avisos para lectores de pantalla.

## Pendiente de decidir
Servicio de publicación y base de datos de ejemplo definitiva: los elige Guillermo y los confirma Alejandro.
