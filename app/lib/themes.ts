'use client'

import { createTheme } from "@mui/material/styles";

export const theme = createTheme({
  palette: {
    primary: {
      main: "#155dfc",
    },
    secondary: {
      main: "#9810fa",
    }
  },
  shape: {
    borderRadius: 16,
  },
  typography: {
    fontFamily: "'Inter', sans-serif",
  },
});