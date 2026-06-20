import React from 'react';
import ReactDOM from 'react-dom/client';
import AppRoutes from './AppRoutes.jsx';
import { ThemeProvider } from './context/ThemeContext.jsx';
import { applyTheme, normalizeTheme } from './lib/theme.js';
import { getAuthUser, getThemePreference } from './lib/authStorage.js';
import './index.css';

const initialPreference = normalizeTheme(
  getAuthUser()?.theme ?? getThemePreference(),
);
applyTheme(initialPreference);

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <ThemeProvider>
      <AppRoutes />
    </ThemeProvider>
  </React.StrictMode>
);
