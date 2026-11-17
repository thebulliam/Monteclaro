export const clonar = (valor) => JSON.parse(JSON.stringify(valor));

export function getEn(objeto, ruta) {
  return ruta.reduce((acc, clave) => (acc == null ? undefined : acc[clave]), objeto);
}

// Devuelve una copia con el valor cambiado en la ruta indicada (sin mutar el original).
export function setEn(objeto, ruta, valor) {
  if (ruta.length === 0) return valor;
  const [clave, ...resto] = ruta;
  const copia = Array.isArray(objeto) ? [...objeto] : { ...objeto };
  copia[clave] = setEn(objeto == null ? undefined : objeto[clave], resto, valor);
  return copia;
}

const esObjeto = (v) => v !== null && typeof v === 'object' && !Array.isArray(v);

// Mezcla un JSON cargado con los valores por defecto, para que un archivo
// antiguo o incompleto no rompa la aplicación.
export function fusionar(base, extra) {
  if (base === null) return extra === undefined ? null : extra;
  if (Array.isArray(base)) return Array.isArray(extra) ? extra : base;
  if (esObjeto(base)) {
    const salida = { ...base };
    if (esObjeto(extra)) {
      Object.keys(extra).forEach((clave) => {
        salida[clave] = clave in base ? fusionar(base[clave], extra[clave]) : extra[clave];
      });
    }
    return salida;
  }
  return typeof extra === typeof base ? extra : base;
}
