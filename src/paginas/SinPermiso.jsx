import Seccion from '../componentes/Seccion';
import { useApi } from '../contextos/ApiContext';
import { nombreRol } from '../utilidades/permisos';

export default function SinPermiso() {
  const { usuario } = useApi();
  return (
    <>
      <h1 tabIndex={-1}>No tienes permiso para ver esta página</h1>
      <Seccion id="sin-permiso" titulo="Error 403: acceso rechazado" resumen>
        <p>
          Tu rol es «{nombreRol(usuario.rol)}» y esta página es solo para el soporte técnico. Si crees que
          debería estar disponible para ti, escribe a soporte.
        </p>
        <p>
          <a href="#/">Volver al Panel</a>
        </p>
      </Seccion>
    </>
  );
}
