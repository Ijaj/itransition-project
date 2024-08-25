import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import {
  Box,
  Toolbar,
  CssBaseline,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";

import { getTheme, isDarkThemeEnabled } from "../themes";
import { AlertProvider } from "../components/Alert";
import MyAppBar from "../components/AppBar/index.jsx";

export default function PublicLayout({ user }) {
  const [darkMode, setDarkMode] = useState(isDarkThemeEnabled());

  const loggedIn = user !== null;

  return (
    <ThemeProvider theme={getTheme()}>
      <CssBaseline />
      <AlertProvider>
        <Box display="flex">
          <MyAppBar user={user} darkMode={darkMode} loggedIn={loggedIn} setDarkMode={setDarkMode} key={'foikdjsfiksdjfk'} />
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Outlet />
          </Box>
        </Box>
      </AlertProvider>
    </ThemeProvider>
  );
}
