import { useEffect, useRef, useState } from 'react';
import { GRUPOS, RUTAS } from './datos/menu';
import { useRuta } from './utilidades/useRuta';
import { puede, nombreRol } from './utilidades/permisos';
import { useVoz } from './contextos/VozContext';
import { useAvisos } from './contextos/AvisosContext';
import { useApi } from './contextos/ApiContext';
import { useDatos } from './contextos/DatosContext';
import Icono from './componentes/Icono';
import Entrar from './paginas/Entrar';
import Resumen from './paginas/Resumen';
import Pedidos from './paginas/Pedidos';
import Clientes from './paginas/Clientes';
import PrimerosPasos from './paginas/PrimerosPasos';
import Usuarios from './paginas/Usuarios';
import Incidencias from './paginas/Incidencias';
import Incidencia from './paginas/Incidencia';
import Diagnostico from './paginas/Diagnostico';
import Configuracion from './paginas/Configuracion';
import Ajustes from './paginas/Ajustes';
import SinPermiso from './paginas/SinPermiso';
import Privacidad from './paginas/Privacidad';

const IncidenciaA = () => <Incidencia clave="A" />;
const IncidenciaB = () => <Incidencia clave="B" />;

const COMPONENTES = {
  '/': Resumen,
  '/pedidos': Pedidos,
  '/clientes': Clientes,
  '/primeros-pasos': PrimerosPasos,
  '/usuarios': Usuarios,
  '/incidencias': Incidencias,
  '/incidencias/a': IncidenciaA,
  '/incidencias/b': IncidenciaB,
  '/diagnostico': Diagnostico,
  '/configuracion': Configuracion,
  '/ajustes': Ajustes,
  '/privacidad': Privacidad,
};

function Logo({ tamano = 44 }) {
  return (
    <svg viewBox="0 0 48 48" width={tamano} height={tamano} role="img" aria-label="Logotipo de Tienda Monteclaro: una montaña con el sol saliendo detrás">
      <circle cx="34" cy="14" r="6.5" className="logo__sol" />
      <path d="M3 42 L19 13 L28 29 L33 22 L45 42 Z" className="logo__monte" />
      <path d="M14 42 L19 33 L24 42 Z" className="logo__sombra" />
    </svg>
  );
}

export default function App() {
  const ruta = useRuta();
  const { usuario, salir } = useApi();
  const { sinGuardar, guardar } = useDatos();
  const principal = useRef(null);
  const primeraVez = useRef(true);
  const { ajustes, leerPagina, leerResumen, detener, leyendo, soportado } = useVoz();
  const { avisar } = useAvisos();
  const [menuAbierto, setMenuAbierto] = useState(false);

  const base = RUTAS.find((r) => r.ruta === ruta) || RUTAS[0];
  let pagina = { clave: base.ruta, etiqueta: base.etiqueta, titulo: base.titulo, Componente: COMPONENTES[base.ruta] };
  if (!usuario && !base.publica) {
    pagina = { clave: 'entrar', etiqueta: 'Entrar', titulo: 'Entrar en Monteclaro Panel', Componente: Entrar };
  } else if (usuario && base.permiso && !puede(usuario.rol, base.permiso)) {
    pagina = { clave: 'sin-permiso', etiqueta: 'Sin permiso', titulo: 'Sin permiso (403)', Componente: SinPermiso };
  }
  const Pagina = pagina.Componente;
  const idUsuario = usuario ? usuario.id : 'nadie';

  useEffect(() => {
    document.title = `${pagina.etiqueta} · Monteclaro Panel`;
    window.scrollTo(0, 0);
    setMenuAbierto(false);
    if (primeraVez.current) {
      primeraVez.current = false;
      return;
    }
    const titulo = document.querySelector('main h1');
    if (titulo) titulo.focus();
    avisar(`Página: ${pagina.titulo}`);
    if (ajustes.auto === 'todo') leerPagina();
    else if (ajustes.auto === 'resumen') leerResumen();
    // Solo debe ejecutarse cuando cambia la página o el usuario.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [pagina.clave, idUsuario]);

  useEffect(() => {
    const alPulsar = (e) => {
      if (e.altKey && e.key.toLowerCase() === 'l') {
        e.preventDefault();
        if (leyendo === 'pagina') detener();
        else leerPagina();
      } else if (e.key === 'Escape') {
        if (leyendo) detener();
        setMenuAbierto(false);
      }
    };
    window.addEventListener('keydown', alPulsar);
    return () => window.removeEventListener('keydown', alPulsar);
  }, [leyendo, leerPagina, detener]);

  const saltar = (e) => {
    e.preventDefault();
    if (principal.current) principal.current.focus();
  };

  const cambiarUsuario = () => {
    salir();
    avisar('Has salido. Elige otro usuario para entrar.');
    window.location.hash = '/';
  };

  const visibles = RUTAS.filter((r) => r.menu && (r.publica || (usuario && (!r.permiso || puede(usuario.rol, r.permiso)))));
  const activa = (r) => ruta === r.ruta || (r.ruta !== '/' && ruta.startsWith(`${r.ruta}/`));
  const leyendoPagina = leyendo === 'pagina';

  const pie = (
    <footer className="pie">
      <p>
        Tienda Monteclaro S.L. es una empresa inventada: todos los nombres y datos de este sitio son inventados. Soporte técnico
        y desarrollo: The Bulliam.
      </p>
    </footer>
  );

  // Sin sesión: marco sencillo (entrada, accesibilidad y privacidad)
  if (!usuario) {
    return (
      <>
        <a className="enlace-saltar" href="#contenido" onClick={saltar}>
          Saltar al contenido principal
        </a>
        <header className="publica">
          <div className="publica__marca">
            <Logo />
            <p className="marca-texto">
              <span className="marca-texto__nombre">Monteclaro</span>
              <span className="marca-texto__lema">Tienda online · Panel interno</span>
            </p>
          </div>
          <nav aria-label="Principal">
            <ul className="publica__menu">
              <li>
                <a href="#/" aria-current={pagina.clave === 'entrar' ? 'page' : undefined}>Entrar</a>
              </li>
              {visibles.map((r) => (
                <li key={r.ruta}>
                  <a href={`#${r.ruta}`} aria-current={activa(r) && pagina.clave === r.ruta ? 'page' : undefined}>
                    {r.etiqueta}
                  </a>
                </li>
              ))}
            </ul>
          </nav>
        </header>
        <main id="contenido" ref={principal} tabIndex={-1} className="principal principal--publica">
          <Pagina />
        </main>
        {pie}
      </>
    );
  }

  return (
    <div className="app">
      <a className="enlace-saltar" href="#contenido" onClick={saltar}>
        Saltar al contenido principal
      </a>

      <aside id="menu-lateral" className={`lateral${menuAbierto ? ' lateral--abierto' : ''}`}>
        <div className="lateral__marca">
          <Logo tamano={42} />
          <p className="marca-texto">
            <span className="marca-texto__nombre">Monteclaro</span>
            <span className="marca-texto__lema">Panel interno</span>
          </p>
        </div>
        <nav aria-label="Principal" className="lateral__nav">
          {GRUPOS.map((g) => {
            const items = visibles.filter((r) => r.grupo === g.id);
            if (!items.length) return null;
            return (
              <div key={g.id} className="lateral__grupo">
                <p className="lateral__titulo" id={`grupo-${g.id}`}>
                  {g.titulo}
                </p>
                <ul aria-labelledby={`grupo-${g.id}`}>
                  {items.map((r) => (
                    <li key={r.ruta}>
                      <a href={`#${r.ruta}`} aria-current={activa(r) && pagina.clave === r.ruta ? 'page' : undefined}>
                        <Icono nombre={r.icono} />
                        {r.etiqueta}
                      </a>
                    </li>
                  ))}
                </ul>
              </div>
            );
          })}
        </nav>
      </aside>

      <div className="cuerpo">
        <header className="superior">
          <button
            type="button"
            className="boton boton--fantasma superior__menu"
            aria-expanded={menuAbierto}
            aria-controls="menu-lateral"
            onClick={() => setMenuAbierto((a) => !a)}
          >
            <Icono nombre={menuAbierto ? 'cerrar' : 'menu'} />
            Menú
          </button>
          <p className="superior__ruta">Monteclaro · {base.etiqueta}</p>
          <div className="superior__acciones">
            {soportado && (
              <button type="button" className="boton boton--secundario boton--pequeno" onClick={leyendoPagina ? detener : leerPagina} aria-keyshortcuts="Alt+L">
                <Icono nombre={leyendoPagina ? 'parar' : 'voz'} tamano={16} />
                {leyendoPagina ? 'Detener la lectura' : 'Escuchar la página'}
              </button>
            )}
            <button type="button" className={sinGuardar ? 'boton boton--pequeno boton--aviso' : 'boton boton--secundario boton--pequeno'} onClick={guardar}>
              <Icono nombre="guardar" tamano={16} />
              {sinGuardar ? 'Guardar datos (cambios sin guardar)' : 'Guardar datos'}
            </button>
            <p className="superior__usuario">
              <strong>{usuario.nombre}</strong>
              <span>{nombreRol(usuario.rol)}</span>
            </p>
            <button type="button" className="boton boton--secundario boton--pequeno" onClick={cambiarUsuario}>
              Cambiar de usuario
            </button>
          </div>
        </header>

        <main id="contenido" ref={principal} tabIndex={-1} className="principal">
          <Pagina />
        </main>
        {pie}
      </div>
    </div>
  );
}
