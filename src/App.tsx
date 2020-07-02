/**
 * Para utilização de um contexto, colocamos ele por volta de todo componente que irá
 * utilizar esse contexto, no formato abaixo: Contexto.Provider;
 */

import React from 'react';

import { BrowserRouter as Router } from 'react-router-dom';

import GlobalStyle from './styles/global';
import AppProvider from './hooks/index';

import Routes from './routes';

const App: React.FC = () => (
  <Router>
    <AppProvider>
      <Routes />
    </AppProvider>

    <GlobalStyle />
  </Router>
);

export default App;
