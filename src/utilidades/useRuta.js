import { useEffect, useState } from 'react';

// Rutas con "#" (por ejemplo #/ticket-a): funcionan en cualquier alojamiento estático
// y el botón "Atrás" del navegador sigue funcionando.
const leer = () => window.location.hash.replace(/^#/, '') || '/';

export function useRuta() {
  const [ruta, setRuta] = useState(leer);
  useEffect(() => {
    const alCambiar = () => setRuta(leer());
    window.addEventListener('hashchange', alCambiar);
    return () => window.removeEventListener('hashchange', alCambiar);
  }, []);
  return ruta;
}
