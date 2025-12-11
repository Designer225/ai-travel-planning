'use client';

import { createTheme } from '@mui/material/styles';

export const theme = createTheme({
  palette: {
    primary: {
      main: '#2563eb', // blue-600
      dark: '#1d4ed8', // blue-700
      light: '#dbeafe', // blue-50
    },
    secondary: {
      main: '#6b7280', // gray-600
    },
    error: {
      main: '#dc2626', // red-600
    },
    background: {
      default: '#ffffff',
      paper: '#f9fafb', // gray-50
    },
    text: {
      primary: '#111827', // gray-900
      secondary: '#6b7280', // gray-600
    },
  },
  typography: {
    fontFamily: 'Arial, Helvetica, sans-serif',
    h1: {
      fontSize: '3.75rem',
      fontWeight: 600,
    },
    h2: {
      fontSize: '2.25rem',
      fontWeight: 600,
    },
    h3: {
      fontSize: '1.5rem',
      fontWeight: 600,
    },
  },
  shape: {
    borderRadius: 8,
  },
});
