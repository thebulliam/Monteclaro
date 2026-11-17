import { useState } from 'react';
import Seccion from '../componentes/Seccion';
import { useDatos } from '../contextos/DatosContext';
import { useApi } from '../contextos/ApiContext';
import { useAvisos } from '../contextos/AvisosContext';
import { ROLES, nombreRol } from '../utilidades/permisos';

const TEXTO_CODIGO = { 200: 'permitido (200)', 201: 'creado (201)', 403: 'rechazado (403)', 401: 'sin sesión (401)' };

export default function Usuarios() {
  const { datos } = useDatos();
  const { usuario, entrar, api } = useApi();
  const { avisar } = useAvisos();
  const [nombre, setNombre] = useState('');
  const [correo, setCorreo] = useState('');
  const [rol, setRol] = useState('consulta');
  const [error, setError] = useState('');
  const [comprobacion, setComprobacion] = useState(null);

  const crear = (e) => {
    e.preventDefault();
    const r = api.crearUsuario({ nombre, correo, rol });
    if (r.estado === 201) {
      setError('');
      avisar(`Usuario creado: ${r.cuerpo.nombre}, con el rol «${nombreRol(r.cuerpo.rol)}».`);
      setNombre('');
      setCorreo('');
    } else {
      setError(r.cuerpo.error || 'No se ha podido crear el usuario.');
    }
  };

  const comprobar = (u) => {
    const resultados = api.comprobarPermisos(u);
    setComprobacion({ nombre: u.nombre, rol: u.rol, resultados });
    avisar(
      `Permisos de ${u.nombre}: ${resultados.map((x) => `${x.accion}, ${TEXTO_CODIGO[x.estado] || x.estado}`).join('. ')}.`
    );
  };

  const entrarComo = (u) => {
    entrar(u.id);
    avisar(`Has entrado como ${u.nombre}.`);
    window.location.hash = '/pedidos';
  };

  return (
    <>
      <h1 tabIndex={-1}>Usuarios y permisos</h1>

      <Seccion id="usuarios-lista" titulo="Usuarios de la aplicación" resumen>
        <div className="tabla-envoltorio">
          <table className="tabla">
            <caption>{datos.usuarios.length} usuarios</caption>
            <thead>
              <tr>
                <th scope="col">Nombre</th>
                <th scope="col">Correo</th>
                <th scope="col">Rol</th>
                <th scope="col">Acciones</th>
              </tr>
            </thead>
            <tbody>
              {datos.usuarios.map((u) => (
                <tr key={u.id}>
                  <th scope="row">{u.nombre}</th>
                  <td>{u.correo}</td>
                  <td>{nombreRol(u.rol)}</td>
                  <td>
                    <div className="acciones">
                      <button
                        type="button"
                        className="boton boton--secundario boton--pequeno"
                        onClick={() => comprobar(u)}
                        aria-label={`Comprobar permisos de ${u.nombre}`}
                      >
                        Comprobar permisos
                      </button>
                      {u.id !== usuario.id && (
                        <button
                          type="button"
                          className="boton boton--secundario boton--pequeno"
                          onClick={() => entrarComo(u)}
                          aria-label={`Entrar como ${u.nombre}`}
                        >
                          Entrar como
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Seccion>

      {comprobacion && (
        <Seccion id="usuarios-comprobacion" titulo={`Permisos de ${comprobacion.nombre}`}>
          <p role="status">
            Rol: {nombreRol(comprobacion.rol)}. La comprobación intenta cada acción sin cambiar ningún dato.
          </p>
          <ul>
            {comprobacion.resultados.map((r) => (
              <li key={r.accion}>
                {r.accion}: <strong>{TEXTO_CODIGO[r.estado] || r.estado}</strong>
              </li>
            ))}
          </ul>
        </Seccion>
      )}

      <Seccion id="usuarios-crear" titulo="Crear un usuario nuevo">
        <form onSubmit={crear} className="formulario" noValidate>
          <div className="filtros__campo">
            <label htmlFor="u-nombre">Nombre y apellidos</label>
            <input id="u-nombre" type="text" value={nombre} onChange={(e) => setNombre(e.target.value)} placeholder="Daniel Ferrer" />
          </div>
          <div className="filtros__campo">
            <label htmlFor="u-correo">Correo de la tienda</label>
            <input id="u-correo" type="text" inputMode="email" value={correo} onChange={(e) => setCorreo(e.target.value)} placeholder="daniel.ferrer@monteclaro.example" />
          </div>
          <div className="filtros__campo">
            <label htmlFor="u-rol">Rol</label>
            <select id="u-rol" value={rol} onChange={(e) => setRol(e.target.value)}>
              {Object.keys(ROLES).map((clave) => (
                <option key={clave} value={clave}>
                  {ROLES[clave].nombre}
                </option>
              ))}
            </select>
          </div>
          {error && (
            <p className="error" role="alert">
              {error}
            </p>
          )}
          <button type="submit" className="boton">
            Crear usuario
          </button>
        </form>
      </Seccion>
    </>
  );
}
