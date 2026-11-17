import { createContext, useCallback, useContext, useMemo, useRef, useState } from 'react';
import { useDatos } from './DatosContext';
import { filtrarPedidos } from '../utilidades/pedidos';
import { nombreRol, puede } from '../utilidades/permisos';

const ApiContext = createContext(null);

// "Servidor" de Monteclaro simulado en el navegador: comprueba permisos, responde con códigos
// HTTP y apunta cada petición en un registro (la pestaña Red del diagnóstico) y en la consola real.
export function ApiProvider({ children }) {
  const { datos, actualizar } = useDatos();
  const datosRef = useRef(datos);
  datosRef.current = datos;

  const [usuarioId, setUsuarioId] = useState(null);
  const [registro, setRegistro] = useState([]);
  const contador = useRef(0);

  const usuario = datos.usuarios.find((u) => u.id === usuarioId && u.activo) || null;

  const anotar = useCallback((metodo, url, estado, cuerpo, quien) => {
    contador.current += 1;
    const entrada = {
      id: contador.current,
      hora: new Date().toLocaleTimeString('es-ES'),
      metodo,
      url,
      estado,
      cuerpo,
      usuario: quien,
    };
    setRegistro((previo) => [entrada, ...previo].slice(0, 40));
    // También va a la consola real del navegador, por si se usa el inspector de verdad.
    const linea = `[Monteclaro API] ${metodo} ${url} → ${estado}`;
    if (estado >= 400) console.error(linea, cuerpo);
    else console.info(linea, cuerpo);
  }, []);

  const api = useMemo(() => {
    const peticion = (metodo, url, permiso, ejecutar, quien = usuario) => {
      if (!quien) {
        const cuerpo = { error: 'No autenticado' };
        anotar(metodo, url, 401, cuerpo, 'anónimo');
        return { estado: 401, cuerpo };
      }
      if (permiso && !puede(quien.rol, permiso)) {
        const cuerpo = {
          error: 'Prohibido',
          detalle: `El rol «${nombreRol(quien.rol)}» no tiene permiso para esta acción`,
        };
        anotar(metodo, url, 403, cuerpo, quien.rol);
        return { estado: 403, cuerpo };
      }
      const { estado, cuerpo } = ejecutar(datosRef.current);
      anotar(metodo, url, estado, cuerpo, quien.rol);
      return { estado, cuerpo };
    };

    return {
      listarPedidos: ({ estado = '', q = '' } = {}) => {
        const params = new URLSearchParams();
        if (estado) params.set('estado', estado);
        if (q) params.set('q', q);
        const texto = params.toString();
        return peticion('GET', `/api/pedidos${texto ? `?${texto}` : ''}`, 'leer', (d) => ({
          estado: 200,
          cuerpo: filtrarPedidos(d, { estado, q }),
        }));
      },

      cambiarEstado: (id, nuevoEstado) =>
        peticion('PATCH', `/api/pedidos/${id}`, 'escribir', (d) => {
          const i = d.pedidos.findIndex((p) => p.id === id);
          if (i < 0) return { estado: 404, cuerpo: { error: 'Pedido no encontrado' } };
          actualizar(['pedidos', i, 'estado'], nuevoEstado);
          return { estado: 200, cuerpo: { id, estado: nuevoEstado } };
        }),

      crearUsuario: ({ nombre, correo, rol }) =>
        peticion('POST', '/api/usuarios', 'usuarios', (d) => {
          if (!nombre.trim()) return { estado: 400, cuerpo: { error: 'Falta el nombre' } };
          if (!/^\S+@\S+\.\S+$/.test(correo)) return { estado: 400, cuerpo: { error: 'El correo no es válido' } };
          if (!['consulta', 'gestion', 'admin'].includes(rol)) return { estado: 400, cuerpo: { error: 'Rol no válido' } };
          if (d.usuarios.some((u) => u.correo.toLowerCase() === correo.trim().toLowerCase())) {
            return { estado: 409, cuerpo: { error: 'Ya existe un usuario con ese correo' } };
          }
          const nuevo = { id: `u${Date.now()}`, nombre: nombre.trim(), correo: correo.trim(), rol, activo: true };
          actualizar(['usuarios'], [...d.usuarios, nuevo]);
          return { estado: 201, cuerpo: nuevo };
        }),

      // Comprueba qué podría hacer otro usuario, sin cambiar ningún dato.
      comprobarPermisos: (objetivo) => {
        const lectura = peticion('GET', '/api/pedidos?simulacion=1', 'leer', (d) => ({
          estado: 200,
          cuerpo: { pedidos: d.pedidos.length },
        }), objetivo);
        const escritura = peticion('PATCH', '/api/pedidos/PED-2041?simulacion=1', 'escribir', () => ({
          estado: 200,
          cuerpo: { mensaje: 'Simulación: no se ha modificado nada' },
        }), objetivo);
        return [
          { accion: 'Leer pedidos', estado: lectura.estado },
          { accion: 'Modificar un pedido', estado: escritura.estado },
        ];
      },
    };
  }, [usuario, anotar, actualizar]);

  const valor = useMemo(
    () => ({
      usuario,
      entrar: (id) => setUsuarioId(id),
      salir: () => setUsuarioId(null),
      registro,
      limpiarRegistro: () => setRegistro([]),
      api,
    }),
    [usuario, registro, api]
  );

  return <ApiContext.Provider value={valor}>{children}</ApiContext.Provider>;
}

export function useApi() {
  return useContext(ApiContext);
}
