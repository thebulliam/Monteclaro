import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';

const AvisosContext = createContext(null);

// Barra de estado: la ven las personas que miran la pantalla y la anuncia el lector de pantalla.
export function AvisosProvider({ children }) {
  const [mensaje, setMensaje] = useState('');
  const alternar = useRef(false);

  const avisar = useCallback((texto) => {
    alternar.current = !alternar.current;
    // El espacio duro final obliga a anunciar de nuevo un mensaje repetido.
    setMensaje(alternar.current ? texto : `${texto} `);
  }, []);

  // El aviso se quita solo a los 8 segundos para no tapar contenido.
  useEffect(() => {
    if (!mensaje) return undefined;
    const t = setTimeout(() => setMensaje(''), 8000);
    return () => clearTimeout(t);
  }, [mensaje]);

  const valor = useMemo(() => ({ avisar }), [avisar]);

  return (
    <AvisosContext.Provider value={valor}>
      {children}
      <div className="estado" role="status" aria-live="polite" aria-atomic="true">
        {mensaje}
      </div>
    </AvisosContext.Provider>
  );
}

export function useAvisos() {
  return useContext(AvisosContext);
}
