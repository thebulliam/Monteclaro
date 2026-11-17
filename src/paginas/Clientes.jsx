import Seccion from '../componentes/Seccion';
import { useDatos } from '../contextos/DatosContext';
import { euros } from '../utilidades/pedidos';

export default function Clientes() {
  const { datos } = useDatos();
  const deCliente = (id) => datos.pedidos.filter((p) => p.clienteId === id);
  const numeroPedidos = (id) => deCliente(id).length;
  const gasto = (id) => deCliente(id).reduce((acc, p) => acc + p.importe, 0);

  return (
    <>
      <h1 tabIndex={-1}>Clientes</h1>
      <p className="subtitulo">Quién compra en la tienda y cuánto.</p>
      <Seccion id="clientes-lista" titulo="Lista de clientes" resumen>
        <p>Clientes de Tienda Monteclaro. Todos los datos son inventados.</p>
        <div className="tabla-envoltorio">
          <table className="tabla">
            <caption>{datos.clientes.length} clientes</caption>
            <thead>
              <tr>
                <th scope="col">Cliente</th>
                <th scope="col">Ciudad</th>
                <th scope="col">Correo</th>
                <th scope="col">Pedidos</th>
                <th scope="col">Gasto total</th>
              </tr>
            </thead>
            <tbody>
              {datos.clientes.map((c) => (
                <tr key={c.id}>
                  <th scope="row">{c.nombre}</th>
                  <td>{c.ciudad}</td>
                  <td>{c.correo}</td>
                  <td>{numeroPedidos(c.id)}</td>
                  <td>{euros(gasto(c.id))}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </Seccion>
    </>
  );
}
