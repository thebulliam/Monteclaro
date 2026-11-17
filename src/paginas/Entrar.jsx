import Seccion from '../componentes/Seccion';
import Icono from '../componentes/Icono';
import { useDatos } from '../contextos/DatosContext';
import { useApi } from '../contextos/ApiContext';
import { useAvisos } from '../contextos/AvisosContext';
import { nombreRol } from '../utilidades/permisos';

export default function Entrar() {
  const { datos } = useDatos();
  const { entrar } = useApi();
  const { avisar } = useAvisos();

  const alEntrar = (usuario) => {
    entrar(usuario.id);
    avisar(`Has entrado como ${usuario.nombre}.`);
  };

  return (
    <div className="entrada">
      <div className="entrada__marca">
        <h1 tabIndex={-1}>Monteclaro Panel</h1>
        <p>
          La aplicación interna de Tienda Monteclaro: pedidos, clientes, usuarios y soporte técnico en un solo lugar.
        </p>
        <ul className="entrada__puntos">
          <li>Pedidos y envíos al día</li>
          <li>Permisos por rol</li>
          <li>Accesible con teclado, lector de pantalla y voz</li>
        </ul>
      </div>

      <div className="entrada__acceso">
        <Seccion id="entrar-usuarios" titulo="Entrar" resumen>
          <p>Demostración sin contraseñas: elige un usuario inventado. Cada rol ve y puede hacer cosas distintas.</p>
          <ul className="lista-usuarios">
            {datos.usuarios
              .filter((u) => u.activo)
              .map((u) => (
                <li key={u.id}>
                  <button type="button" className="boton boton--grande" onClick={() => alEntrar(u)}>
                    <span className="boton__linea">
                      <Icono nombre="entrar" tamano={18} />
                      Entrar como {u.nombre}
                    </span>
                    <span className="boton__detalle">{nombreRol(u.rol)}</span>
                  </button>
                </li>
              ))}
          </ul>
          <details className="evaluacion">
            <summary>Para quien evalúa: cómo probar los dos casos</summary>
            <ol>
              <li>
                <strong>Incidencia INC-0412.</strong> Entra como Guillermo, abre «Incidencias» y sigue el plan de resolución:
                la lista de pedidos pendientes sale vacía y hay que encontrar la causa con «Diagnóstico».
              </li>
              <li>
                <strong>Petición SOL-0413.</strong> Con el mismo usuario, abre «Usuarios», crea a una persona nueva con el rol
                «Solo consulta» y comprueba qué puede y qué no puede hacer.
              </li>
            </ol>
          </details>
        </Seccion>
      </div>
    </div>
  );
}
