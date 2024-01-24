import React from "react";
import "./App.css";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { Button, createTheme, IconButton, ThemeProvider } from "@mui/material";
import { closeSnackbar, SnackbarProvider } from "notistack";

import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";
//TODO: expand theme Styling
function App() {
  return (
    <ThemeProvider theme={theme}>
      <SnackbarProvider
        iconVariant={{ error: <ErrorOutlineOutlinedIcon sx={{ mr: 1 }} /> }}
        action={(snackbarId) => (
          <IconButton
            sx={{ color: "white", textTransform: "none" }}
            onClick={() => closeSnackbar(snackbarId)}
          >
            <CloseOutlinedIcon />
          </IconButton>
        )}
      >
        <RouterProvider router={router} />
      </SnackbarProvider>
    </ThemeProvider>
  );
}
const theme = createTheme({
  palette: {},
  typography: {},
});

export default App;
