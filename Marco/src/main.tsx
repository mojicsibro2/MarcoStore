import { Provider } from 'react-redux';
import { store } from './app/store';
import ReactDOM from 'react-dom/client';
import AppRouter from './router/AppRouter';
import React from 'react';
import './assets/style.css'

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <Provider store={store}>
      <AppRouter />
    </Provider>
  </React.StrictMode>,
);
