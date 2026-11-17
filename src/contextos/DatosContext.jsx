import { createContext, useCallback, useContext, useEffect, useMemo, useState } from 'react';
import { proyectoPorDefecto } from '../datos/proyectoPorDefecto';
import { clonar, setEn } from '../utilidades/objetos';
import { descargarJson, leerJson } from '../utilidades/ficheroJson';
import { useAvisos } from './AvisosContext';

const DatosContext = createContext(null);

// Aquí vive la "base de datos" del sitio: un objeto en memoria que se guarda y se carga como JSON.
export function DatosProvider({ children }) {
  const { avisar } = useAvisos();
  const [datos, setDatos] = useState(() => clonar(proyectoPorDefecto));
  const [modoEdicion, setModoEdicion] = useState(false);
  const [sinGuardar, setSinGuardar] = useState(false);

  const actualizar = useCallback((ruta, valor) => {
    setDatos((previos) => setEn(previos, ruta, valor));
    setSinGuardar(true);
  }, []);

  const guardar = useCallback(() => {
    const conFecha = { ...datos, guardadoEn: new Date().toISOString() };
    const nombre = descargarJson(conFecha);
    setDatos(conFecha);
    setSinGuardar(false);
    avisar(`Progreso guardado. Se ha descargado el archivo ${nombre}.`);
  }, [datos, avisar]);

  const cargar = useCallback(
    async (fichero) => {
      if (!fichero) return;
      if (sinGuardar && !window.confirm('Tienes cambios sin guardar. ¿Quieres cargar el archivo y perderlos?')) {
        return;
      }
      try {
        const nuevos = await leerJson(fichero);
        setDatos(nuevos);
        setSinGuardar(false);
        avisar(`Archivo ${fichero.name} cargado. Puedes seguir trabajando.`);
      } catch (error) {
        avisar(`No se ha podido cargar el archivo. ${error.message}`);
      }
    },
    [sinGuardar, avisar]
  );

  const restablecer = useCallback(() => {
    if (!window.confirm('¿Restablecer la demo? Se perderán los cambios que no hayas guardado.')) return;
    setDatos(clonar(proyectoPorDefecto));
    setSinGuardar(false);
    avisar('Demo restablecida a su contenido inicial.');
  }, [avisar]);

  // Aviso del navegador si se intenta cerrar con cambios sin guardar.
  useEffect(() => {
    if (!sinGuardar) return undefined;
    const antes = (e) => {
      e.preventDefault();
      e.returnValue = '';
    };
    window.addEventListener('beforeunload', antes);
    return () => window.removeEventListener('beforeunload', antes);
  }, [sinGuardar]);

  const valor = useMemo(
    () => ({ datos, actualizar, modoEdicion, setModoEdicion, sinGuardar, guardar, cargar, restablecer }),
    [datos, actualizar, modoEdicion, sinGuardar, guardar, cargar, restablecer]
  );

  return <DatosContext.Provider value={valor}>{children}</DatosContext.Provider>;
}

export function useDatos() {
  return useContext(DatosContext);
}
