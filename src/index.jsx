import React from 'react';
import ReactDOM from 'react-dom/client';
import '@fontsource-variable/inter';
import '@fontsource-variable/fraunces';
import './estilos/base.css';
import './estilos/componentes.css';
import App from './App';
import { AvisosProvider } from './contextos/AvisosContext';
import { VozProvider } from './contextos/VozContext';
import { DatosProvider } from './contextos/DatosContext';
import { ApiProvider } from './contextos/ApiContext';

const raiz = ReactDOM.createRoot(document.getElementById('root'));
raiz.render(
  <React.StrictMode>
    <AvisosProvider>
      <VozProvider>
        <DatosProvider>
          <ApiProvider>
            <App />
          </ApiProvider>
        </DatosProvider>
      </VozProvider>
    </AvisosProvider>
  </React.StrictMode>
);
