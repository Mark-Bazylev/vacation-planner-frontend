import React from "react";
import { RouterProvider } from "react-router-dom";
import { router } from "./router";
import { createTheme, IconButton, ThemeProvider } from "@mui/material";
import { closeSnackbar, SnackbarProvider } from "notistack";

import ErrorOutlineOutlinedIcon from "@mui/icons-material/ErrorOutlineOutlined";
import CloseOutlinedIcon from "@mui/icons-material/CloseOutlined";

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
  palette: {
    primary: {
      main: "#Da96EB",
      light: "#FFA69E",
      dark: "#D6403E",
      contrastText: "#FFFFFF", // White text for light backgrounds
    },
    secondary: {
      main: "#FFD166",
      light: "#FFE699",
      dark: "#D69E00",
      contrastText: "#333333", // Dark grey text for light backgrounds
    },
    success: {
      main: "#06D6A0",
      light: "#7FFFD4",
      dark: "#049F73",
      contrastText: "#FFFFFF", // White text for dark backgrounds
    },
    warning: {
      main: "#FF9F1C",
      light: "#FFC266",
      dark: "#D67700",
      contrastText: "#FFFFFF", // White text for dark backgrounds
    },
    error: {
      main: "#EF476F",
      light: "#FF709D",
      dark: "#BC004E",
      contrastText: "#FFFFFF", // White text for dark backgrounds
    },
    info: {
      main: "#118AB2",
      light: "#7DC4DD",
      dark: "#0E5A77",
      contrastText: "#FFFFFF", // White text for light backgrounds
    },
  },
});

export default App;
