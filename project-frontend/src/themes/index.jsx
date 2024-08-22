import { siteTheme } from "../helper/constants.js";
import { createTheme } from "@mui/material/styles";

const mainPalette = {
  primary: {
    main: "#d7a649",
    light: "#DFB76D",
    dark: "#6d5128",
    contrastText: "rgba(0,0,0,0.81)",
  },
  secondary: {
    main: "#f0242f",
    light: "#F34F58",
    dark: "#A81920",
    contrastText: "#fff",
  },
  background: {
    default: "#F5F5F5", // Light gray
    paper: "#FFFFFF", // White
  },
  text: {
    primary: "#333333", // Dark gray
    secondary: "#666666", // Lighter gray
  },
};

const lightPalette = {
  palette: {
    // ...mainPalette,
    mode: "light",
    primary: {
      main: '#3a4cb3',
    },
  },
};

// const darkPalette = {
//   palette: {
//     ...mainPalette,
//     mode: "dark",
//     primary: {
//       main: "#755723",
//       contrastText: "#fff",
//     },
//     secondary: {
//       main: "#BB373E",
//       contrastText: "#fff",
//     },
//     warning: {
//       main: "#F9EF39",
//     },
//     success: {
//       main: "#3a853d",
//     },
//     background: {
//       default: "#222222", // Dark gray
//       paper: "#333333", // Darker gray
//     },
//     text: {
//       primary: "#FFFFFF", // White
//       secondary: "#E5E5E5", // Light gray
//     },
//   },
// };

const darkPalette = {
  palette: {
    // ...mainPalette,
    mode: "dark",
  },
};

export function getTheme() {
  const darkTheme = localStorage.getItem(siteTheme.darkMode);
  return createTheme(darkTheme && darkTheme === "1" ? darkPalette : lightPalette);
}

export function switchTheme(checked, setDarkMode) {
  setDarkMode(checked);
  localStorage.setItem(siteTheme.darkMode, checked ? "1" : "0");
}

export function isDarkThemeEnabled() {
  return localStorage.getItem(siteTheme.darkMode) === '1';
}
