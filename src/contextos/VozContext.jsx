import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from 'react';
import { useAvisos } from './AvisosContext';
import { dividirEnTrozos, resumenDe, textoDe } from '../utilidades/textoParaVoz';

const CLAVE = 'soporte-monteclaro:ajustes';
const POR_DEFECTO = { velocidad: 1, auto: 'no', tamano: 100 };

function leerAjustes() {
  try {
    const crudo = window.localStorage.getItem(CLAVE);
    if (crudo) return { ...POR_DEFECTO, ...JSON.parse(crudo) };
  } catch {
    /* sin almacenamiento: se usan los valores por defecto */
  }
  return POR_DEFECTO;
}

function guardarAjustes(ajustes) {
  try {
    window.localStorage.setItem(CLAVE, JSON.stringify(ajustes));
  } catch {
    /* sin almacenamiento: no pasa nada */
  }
}

const VozContext = createContext(null);

export function VozProvider({ children }) {
  const { avisar } = useAvisos();
  const soportado =
    typeof window !== 'undefined' && 'speechSynthesis' in window && 'SpeechSynthesisUtterance' in window;

  const [ajustes, setAjustes] = useState(leerAjustes);
  const [leyendo, setLeyendo] = useState('');
  const ajustesRef = useRef(ajustes);
  const vocesRef = useRef([]);

  useEffect(() => {
    ajustesRef.current = ajustes;
    document.documentElement.style.fontSize = `${ajustes.tamano}%`;
  }, [ajustes]);

  // Las voces se cargan de forma asíncrona en muchos navegadores.
  useEffect(() => {
    if (!soportado) return undefined;
    const synth = window.speechSynthesis;
    const cargar = () => {
      vocesRef.current = synth.getVoices();
    };
    cargar();
    synth.addEventListener('voiceschanged', cargar);
    return () => {
      synth.removeEventListener('voiceschanged', cargar);
      synth.cancel();
    };
  }, [soportado]);

  const cambiarAjuste = useCallback((clave, valor) => {
    setAjustes((previos) => {
      const nuevos = { ...previos, [clave]: valor };
      guardarAjustes(nuevos);
      return nuevos;
    });
  }, []);

  const borrarAjustes = useCallback(() => {
    try {
      window.localStorage.removeItem(CLAVE);
    } catch {
      /* nada que borrar */
    }
    setAjustes(POR_DEFECTO);
    avisar('Preferencias borradas de este navegador.');
  }, [avisar]);

  const detener = useCallback(() => {
    if (!soportado) return;
    window.speechSynthesis.cancel();
    setLeyendo('');
  }, [soportado]);

  const hablar = useCallback(
    (texto, id = 'texto') => {
      if (!soportado) {
        avisar('Tu navegador no admite la lectura en voz alta.');
        return;
      }
      const trozos = dividirEnTrozos(texto || '');
      if (!trozos.length) return;
      const synth = window.speechSynthesis;
      synth.cancel();
      setLeyendo(id);

      // Preferimos una voz española instalada en el dispositivo (más privada y más rápida).
      const voces = vocesRef.current;
      const voz =
        voces.find((v) => v.lang === 'es-ES' && v.localService) ||
        voces.find((v) => v.lang && v.lang.toLowerCase().startsWith('es-es')) ||
        voces.find((v) => v.lang && v.lang.toLowerCase().startsWith('es')) ||
        null;

      const terminar = () => setLeyendo((actual) => (actual === id ? '' : actual));
      trozos.forEach((trozo, i) => {
        const frase = new SpeechSynthesisUtterance(trozo);
        frase.lang = 'es-ES';
        frase.rate = ajustesRef.current.velocidad;
        if (voz) frase.voice = voz;
        frase.onerror = terminar;
        if (i === trozos.length - 1) frase.onend = terminar;
        synth.speak(frase);
      });
    },
    [soportado, avisar]
  );

  const leerPagina = useCallback(() => {
    hablar(textoDe(document.querySelector('main')), 'pagina');
  }, [hablar]);

  const leerResumen = useCallback(() => {
    hablar(resumenDe(document.querySelector('main')), 'pagina');
  }, [hablar]);

  const valor = useMemo(
    () => ({
      soportado,
      leyendo,
      ajustes,
      cambiarAjuste,
      borrarAjustes,
      hablar,
      detener,
      leerPagina,
      leerResumen,
    }),
    [soportado, leyendo, ajustes, cambiarAjuste, borrarAjustes, hablar, detener, leerPagina, leerResumen]
  );

  return <VozContext.Provider value={valor}>{children}</VozContext.Provider>;
}

export function useVoz() {
  return useContext(VozContext);
}
