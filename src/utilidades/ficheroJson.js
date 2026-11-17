import { ID_APP, VERSION_ESQUEMA, proyectoPorDefecto } from '../datos/proyectoPorDefecto';
import { clonar, fusionar } from './objetos';

const MAX_BYTES = 2 * 1024 * 1024; // 2 MB: de sobra para este proyecto

export function nombreFichero(fecha = new Date()) {
  const dos = (n) => String(n).padStart(2, '0');
  return `proyecto-monteclaro-${fecha.getFullYear()}-${dos(fecha.getMonth() + 1)}-${dos(fecha.getDate())}.json`;
}

// Descarga el estado actual como archivo JSON. Todo ocurre en el navegador.
export function descargarJson(datos) {
  const nombre = nombreFichero();
  const blob = new Blob([JSON.stringify(datos, null, 2)], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const enlace = document.createElement('a');
  enlace.href = url;
  enlace.download = nombre;
  document.body.appendChild(enlace);
  enlace.click();
  enlace.remove();
  setTimeout(() => URL.revokeObjectURL(url), 1000);
  return nombre;
}

// Lee y valida un archivo JSON subido por la persona.
export async function leerJson(fichero) {
  if (fichero.size > MAX_BYTES) throw new Error('El archivo es demasiado grande para esta aplicación.');
  const texto = await fichero.text();
  let json;
  try {
    json = JSON.parse(texto);
  } catch {
    throw new Error('El archivo no es un JSON válido.');
  }
  if (!json || json.app !== ID_APP) {
    throw new Error('Este archivo no se guardó con esta aplicación, así que no lo he cargado.');
  }
  if (typeof json.version !== 'number' || json.version > VERSION_ESQUEMA) {
    throw new Error('Este archivo es de una versión más nueva de la aplicación y no puedo leerlo.');
  }
  return fusionar(clonar(proyectoPorDefecto), json);
}
