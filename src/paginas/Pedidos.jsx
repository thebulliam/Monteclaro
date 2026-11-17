import { useEffect, useRef, useState } from 'react';
import Seccion from '../componentes/Seccion';
import { useDatos } from '../contextos/DatosContext';
import { useApi } from '../contextos/ApiContext';
import { useAvisos } from '../contextos/AvisosContext';
import { euros, nombreDeCliente } from '../utilidades/pedidos';
import { nombreRol, puede } from '../utilidades/permisos';
import Insignia, { TEXTO_ESTADO_PEDIDO, TONO_ESTADO_PEDIDO } from '../componentes/Insignia';

// El valor que se envía al servidor va en mayúsculas: ahí está el origen del ticket A.
const OPCIONES = [
  { valor: 'PENDIENTE', texto: 'Pendientes de envío' },
  { valor: 'ENVIADO', texto: 'Enviados' },
  { valor: 'ENTREGADO', texto: 'Entregados' },
  { valor: '', texto: 'Todos' },
];


export default function Pedidos() {
  const { datos } = useDatos();
  const { usuario, api } = useApi();
  const { avisar } = useAvisos();
  const [estado, setEstado] = useState('PENDIENTE');
  const [escrito, setEscrito] = useState('');
  const [q, setQ] = useState('');
  const [lista, setLista] = useState([]);
  const [seleccionado, setSeleccionado] = useState(null);
  const fichaRef = useRef(null);
  const estadoRef = useRef(null);

  const comparacion = datos.config.comparacionEstados;
  useEffect(() => {
    const respuesta = api.listarPedidos({ estado, q });
    setLista(Array.isArray(respuesta.cuerpo) ? respuesta.cuerpo : []);
  }, [api, estado, q, datos.pedidos, comparacion]);

  const ficha = seleccionado ? datos.pedidos.find((p) => p.id === seleccionado) : null;
  useEffect(() => {
    if (ficha && fichaRef.current) fichaRef.current.focus();
    // Solo al abrir otra ficha.
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [seleccionado]);

  const buscar = (e) => {
    e.preventDefault();
    setQ(escrito.trim());
  };

  const marcarEnviado = (pedido) => {
    const r = api.cambiarEstado(pedido.id, 'enviado');
    avisar(
      r.estado === 200
        ? `El pedido ${pedido.id} se ha marcado como enviado.`
        : `No se ha podido cambiar el pedido: ${r.cuerpo.error}.`
    );
    if (estadoRef.current) estadoRef.current.focus();
  };

  const puedeEscribir = puede(usuario.rol, 'escribir');
  const filtroActual = OPCIONES.find((o) => o.valor === estado).texto;

  return (
    <>
      <h1 tabIndex={-1}>Pedidos</h1>
      <p className="subtitulo">Busca pedidos, mira su estado y prepara los envíos.</p>

      <Seccion id="pedidos-lista" titulo="Lista de pedidos" resumen>
        <form className="filtros" onSubmit={buscar} role="search" aria-label="Buscar pedidos">
          <div className="filtros__campo">
            <label htmlFor="filtro-estado">Estado del pedido</label>
            <select id="filtro-estado" value={estado} onChange={(e) => setEstado(e.target.value)}>
              {OPCIONES.map((o) => (
                <option key={o.texto} value={o.valor}>
                  {o.texto}
                </option>
              ))}
            </select>
          </div>
          <div className="filtros__campo">
            <label htmlFor="filtro-q">Buscar por número de pedido o cliente</label>
            <input id="filtro-q" type="text" value={escrito} onChange={(e) => setEscrito(e.target.value)} />
          </div>
          <button type="submit" className="boton">
            Buscar
          </button>
        </form>

        <p ref={estadoRef} tabIndex={-1} role="status" aria-live="polite" className="resultado-lista">
          {lista.length === 0
            ? 'No hay pedidos que mostrar.'
            : `Mostrando ${lista.length} ${lista.length === 1 ? 'pedido' : 'pedidos'}. Filtro: ${filtroActual}.`}
        </p>

        {lista.length > 0 && (
          <div className="tabla-envoltorio">
            <table className="tabla">
              <caption>Pedidos de Tienda Monteclaro. Filtro: {filtroActual}.</caption>
              <thead>
                <tr>
                  <th scope="col">Pedido</th>
                  <th scope="col">Cliente</th>
                  <th scope="col">Fecha</th>
                  <th scope="col">Importe</th>
                  <th scope="col">Estado</th>
                  <th scope="col">Acciones</th>
                </tr>
              </thead>
              <tbody>
                {lista.map((p) => (
                  <tr key={p.id}>
                    <th scope="row">{p.id}</th>
                    <td>{nombreDeCliente(datos, p.clienteId)}</td>
                    <td>{p.fecha}</td>
                    <td>{euros(p.importe)}</td>
                    <td>
                      <Insignia tono={TONO_ESTADO_PEDIDO[p.estado]}>{TEXTO_ESTADO_PEDIDO[p.estado] || p.estado}</Insignia>
                    </td>
                    <td>
                      <div className="acciones">
                        <button
                          type="button"
                          className="boton boton--secundario boton--pequeno"
                          onClick={() => setSeleccionado(p.id)}
                          aria-label={`Ver ficha del pedido ${p.id}`}
                        >
                          Ver ficha
                        </button>
                        {puedeEscribir && p.estado === 'pendiente' && (
                          <button
                            type="button"
                            className="boton boton--pequeno"
                            onClick={() => marcarEnviado(p)}
                            aria-label={`Marcar como enviado el pedido ${p.id}`}
                          >
                            Marcar como enviado
                          </button>
                        )}
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </Seccion>

      {ficha && (
        <Seccion id="pedido-ficha" titulo={`Ficha del pedido ${ficha.id}`}>
          <div ref={fichaRef} tabIndex={-1} className="ficha">
            <dl className="ficha__datos">
              <dt>Cliente</dt>
              <dd>{nombreDeCliente(datos, ficha.clienteId)}</dd>
              <dt>Fecha</dt>
              <dd>{ficha.fecha}</dd>
              <dt>Artículos</dt>
              <dd>{ficha.articulos}</dd>
              <dt>Importe</dt>
              <dd>{euros(ficha.importe)}</dd>
              <dt>Estado</dt>
              <dd>
                <Insignia tono={TONO_ESTADO_PEDIDO[ficha.estado]}>{TEXTO_ESTADO_PEDIDO[ficha.estado] || ficha.estado}</Insignia>
              </dd>
            </dl>
            {!puedeEscribir && (
              <p className="aviso-suave">
                Tu rol es «{nombreRol(usuario.rol)}»: puedes leer este pedido, pero no cambiarlo.
              </p>
            )}
          </div>
        </Seccion>
      )}
    </>
  );
}
