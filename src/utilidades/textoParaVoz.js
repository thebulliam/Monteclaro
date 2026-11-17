// Convierte un trozo de la página en un texto limpio para leerlo en voz alta.

const BLOQUES = 'h1,h2,h3,h4,p,li,th,td,caption,dt,dd,legend,label,figcaption,pre,.campo__texto';

export function textoDe(elemento) {
  if (!elemento) return '';
  const copia = elemento.cloneNode(true);

  // Los campos de edición se leen con lo que haya escrito dentro.
  const origenes = elemento.querySelectorAll('textarea, input[type="text"]');
  copia.querySelectorAll('textarea, input[type="text"]').forEach((campo, i) => {
    const p = document.createElement('p');
    p.textContent = origenes[i] ? origenes[i].value : '';
    campo.replaceWith(p);
  });

  // Fuera lo que no es contenido: botones, controles y lo marcado como "no leer".
  copia
    .querySelectorAll('[data-no-voz], [aria-hidden="true"], button, select, input, script, style')
    .forEach((nodo) => nodo.remove());

  // Una pausa natural al final de cada bloque.
  copia.querySelectorAll(BLOQUES).forEach((nodo) => {
    const t = nodo.textContent.trim();
    if (t) nodo.append(/[.!?…:;]$/.test(t) ? ' ' : '. ');
  });

  return copia.textContent.replace(/\s+/g, ' ').trim();
}

// Título de la página + secciones marcadas como resumen.
export function resumenDe(principal) {
  if (!principal) return '';
  const titulo = principal.querySelector('h1');
  const partes = [titulo ? titulo.textContent : ''];
  principal.querySelectorAll('[data-resumen]').forEach((s) => partes.push(textoDe(s)));
  return partes.filter(Boolean).join('. ');
}

// Trocea el texto en frases (máx. ~200 caracteres) para que el navegador no corte la lectura.
export function dividirEnTrozos(texto, maximo = 200) {
  const frases = texto.match(/[^.!?…]+[.!?…]*\s*/g) || [];
  const trozos = [];
  let actual = '';
  frases.forEach((frase) => {
    if ((actual + frase).length > maximo && actual) {
      trozos.push(actual.trim());
      actual = '';
    }
    if (frase.length > maximo) {
      const palabras = frase.split(' ');
      palabras.forEach((palabra) => {
        if ((actual + palabra).length > maximo && actual) {
          trozos.push(actual.trim());
          actual = '';
        }
        actual += `${palabra} `;
      });
    } else {
      actual += frase;
    }
  });
  if (actual.trim()) trozos.push(actual.trim());
  return trozos;
}
