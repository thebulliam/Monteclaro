import { useEffect, useState } from 'react';
import Seccion from '../componentes/Seccion';
import Kpi from '../componentes/Kpi';
import Insignia from '../componentes/Insignia';
import GraficoBarras from '../componentes/GraficoBarras';
import BarrasEstado from '../componentes/BarrasEstado';
import { useDatos } from '../contextos/DatosContext';
import { useApi } from '../contextos/ApiContext';
import { contarPorEstado, euros, nombreDeCliente } from '../utilidades/pedidos';
import { sumar, ventasPorDia } from '../utilidades/ventas';
import { nombreRol, puede } from '../utilidades/permisos';
import { RUTA_INCIDENCIA } from '../utilidades/incidencias';

export default function Resumen() {
  const { datos } = useDatos();
  const { usuario, api } = useApi();
  const [pendientes, setPendientes] = useState([]);

  // Esta tarjeta usa el mismo filtro que la lista de pedidos.
  const comparacion = datos.config.comparacionEstados;
  useEffect(() => {
    const r = api.listarPedidos({ estado: 'PENDIENTE' });
    setPendientes(Array.isArray(r.cuerpo) ? r.cuerpo : []);
  }, [api, datos.pedidos, comparacion]);

  const ventas = ventasPorDia(datos);
  const total = sumar(ventas, 'total');
  const numPedidos = sumar(ventas, 'pedidos');
  const mejor = ventas.reduce((a, b) => (b.total > a.total ? b : a), ventas[0]);
  const cuentas = {
    pendiente: contarPorEstado(datos, 'pendiente'),
    enviado: contarPorEstado(datos, 'enviado'),
    entregado: contarPorEstado(datos, 'entregado'),
  };
  const verSoporte = puede(usuario.rol, 'soporte');
  const abiertas = ['A', 'B'].filter((k) => datos.tickets[k].estado === 'abierta');
  const criticas = abiertas.filter((k) => datos.tickets[k].prioridad.startsWith('1')).length;
  const ultimoDia = ventas[ventas.length - 1];

  return (
    <>
      <h1 tabIndex={-1}>Resumen de Monteclaro</h1>
      <p className="subtitulo">
        Hola, {usuario.nombre}. Rol: {nombreRol(usuario.rol)}. Datos de la tienda hasta el {ultimoDia.fecha}.
      </p>

      <Seccion id="res-indicadores" titulo="Indicadores principales" resumen className="seccion--sin-marco">
        <ul className="kpis">
          <Kpi
            icono="euro"
            etiqueta="Ventas de los últimos 7 días"
            valor={euros(total)}
            nota={`${numPedidos} pedidos`}
          />
          <Kpi
            icono="pedidos"
            etiqueta="Pendientes de envío"
            valor={cuentas.pendiente}
            tono="ambar"
            enlace={{ href: '#/pedidos', texto: 'Ir a preparar envíos' }}
          />
          {verSoporte ? (
            <Kpi
              icono="incidencias"
              etiqueta="Incidencias abiertas"
              valor={abiertas.length}
              tono={criticas > 0 ? 'rojo' : 'verde'}
              enlace={{ href: '#/incidencias', texto: criticas > 0 ? `${criticas} crítica, ver bandeja` : 'Ver bandeja' }}
            />
          ) : (
            <Kpi icono="clientes" etiqueta="Clientes" valor={datos.clientes.length} nota="Cuentas activas" tono="verde" />
          )}
          <Kpi
            icono="ventas"
            etiqueta="Ticket medio"
            valor={euros(numPedidos ? total / numPedidos : 0)}
            nota="Importe medio por pedido"
            tono="verde"
          />
        </ul>
      </Seccion>

      <div className="rejilla rejilla--2-1">
        <Seccion id="res-ventas" titulo="Ventas por día">
          <GraficoBarras
            id="res-ventas-grafico"
            datos={ventas}
            tituloTabla="Ventas y pedidos por día"
            resumen={`Ventas totales: ${euros(total)} en ${numPedidos} pedidos durante ${ventas.length} días. El mejor día fue el ${mejor.larga}, con ${euros(mejor.total)}.`}
          />
        </Seccion>

        <Seccion id="res-pendientes" titulo="Pendientes de envío">
          {pendientes.length === 0 ? (
            <p className="vacio">No hay pedidos que mostrar.</p>
          ) : (
            <ul className="lista-simple">
              {pendientes.slice(0, 5).map((p) => (
                <li key={p.id}>
                  <span>
                    <strong>{p.id}</strong>
                    <br />
                    {nombreDeCliente(datos, p.clienteId)}
                  </span>
                  <span>{euros(p.importe)}</span>
                </li>
              ))}
            </ul>
          )}
          <p>
            <a href="#/pedidos">Ver todos los pedidos</a>
          </p>
        </Seccion>
      </div>

      <div className={`rejilla ${verSoporte ? 'rejilla--3' : 'rejilla--2'}`}>
        <Seccion id="res-estados" titulo="Pedidos por estado">
          <BarrasEstado cuentas={cuentas} />
        </Seccion>

        <Seccion id="res-sistema" titulo="Estado del sistema">
          <dl className="datos-lista">
            <dt>Aplicación web</dt>
            <dd>
              <Insignia tono="ok">Operativa</Insignia>
            </dd>
            <dt>Base de datos</dt>
            <dd>
              <Insignia tono="ok">Operativa</Insignia>
            </dd>
            <dt>Comparación de estados</dt>
            <dd>
              <Insignia tono="info">{comparacion === 'estricta' ? 'Estricta' : 'Flexible'}</Insignia>
            </dd>
            <dt>Última actualización</dt>
            <dd>12/11/2026</dd>
          </dl>
        </Seccion>

        {verSoporte && (
          <Seccion id="res-incidencias" titulo="Incidencias abiertas">
            {abiertas.length === 0 ? (
              <p className="vacio">No hay incidencias abiertas.</p>
            ) : (
              <ul className="lista-simple">
                {abiertas.map((k) => (
                  <li key={k}>
                    <span>
                      <a href={`#${RUTA_INCIDENCIA[k]}`}>{datos.tickets[k].codigo}</a>
                      <br />
                      {datos.tickets[k].tipo}
                    </span>
                    <Insignia tono={datos.tickets[k].prioridad.startsWith('1') ? 'error' : 'neutro'}>
                      Prioridad {datos.tickets[k].prioridad}
                    </Insignia>
                  </li>
                ))}
              </ul>
            )}
          </Seccion>
        )}
      </div>
    </>
  );
}
