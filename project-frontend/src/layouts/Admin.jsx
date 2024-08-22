import React, { useState } from "react";
import { Outlet, useNavigate } from "react-router-dom";

import {
  Box,
  Toolbar,
  CssBaseline,
  useMediaQuery,
  Drawer,
  Button,
  FormControl,
  List,
  ListItemText,
  ListItemButton,
  ListItemIcon,
  ListItem,
  Switch,
  Typography,
} from "@mui/material";
import { styled, ThemeProvider } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

import PeopleIcon from '@mui/icons-material/People';
import CollectionsIcon from '@mui/icons-material/Collections';
import AppsIcon from '@mui/icons-material/Apps';

import Authentication from "../views/authentication";
import { activeRoutesArray } from "../routes.js";
import { getTheme, isDarkThemeEnabled, switchTheme } from "../themes";
import { AlertProvider } from "../components/Alert";
import MyAppBar from "../components/AppBar/index.jsx";
import Search from "../views/public/search/app-bar-search.jsx";

const SidebarContainer = styled(Box)(({ theme }) => ({
  overflow: "auto",
  height: '100%',
  "&::-webkit-scrollbar": {
    width: "5px", // Width of the scrollbar
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor:
      theme.palette.mode === "dark"
        ? theme.palette.primary.dark
        : theme.palette.primary.light, // Color of the scrollbar thumb
    borderRadius: "1px", // Rounded corners for the scrollbar thumb
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: "transparent", // Color of the scrollbar track (transparent)
  },
  "&::-webkit-scrollbar-button": {
    display: "none", // Hide the top and bottom arrows
  },
}));

export default function PublicLayout() {
  const theme = useTheme();
  const navigate = useNavigate();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [darkMode, setDarkMode] = useState(isDarkThemeEnabled());

  const loggedIn = activeRoutesArray[0].path !== "/login";

  return (
    <ThemeProvider theme={getTheme()}>
      <CssBaseline />
      {loggedIn ? (
        <Box display="flex">
          <MyAppBar isAdmin darkMode={darkMode} isMobile={isMobile} loggedIn={loggedIn} setDarkMode={setDarkMode} key={'foikdjsfiksdjfk'} />
          <Drawer
            variant="permanent"
            sx={{
              width: 300,
              flexShrink: 0,
              [`& .MuiDrawer-paper`]: {
                width: 300,
                boxSizing: "border-box",
              },
            }}
          >
            <Toolbar />
            <SidebarContainer sx={{ overflow: "auto" }}>
              <Box sx={{ display: 'flex', flexDirection: 'column', justifyContent: 'space-between', height: '100%' }}>
                <List>
                  <ListItem>
                    <Search width="100%" />
                  </ListItem>
                  <ListItemButton onClick={() => navigate('/users')}>
                    <ListItemIcon>
                      <PeopleIcon />
                    </ListItemIcon>
                    <ListItemText>
                      All Users
                    </ListItemText>
                  </ListItemButton>
                  <ListItemButton onClick={() => navigate('/collections')}>
                    <ListItemIcon>
                      <CollectionsIcon />
                    </ListItemIcon>
                    <ListItemText>
                      All Collections
                    </ListItemText>
                  </ListItemButton>
                  <ListItemButton onClick={() => navigate(`/collections/${5}`)}>
                    <ListItemIcon>
                      <AppsIcon />
                    </ListItemIcon>
                    <ListItemText>
                      My Collections
                    </ListItemText>
                  </ListItemButton>
                </List>

                <Box padding={2}>
                  <Box display={'flex'} justifyContent={'center'} alignItems={'center'}>
                    <Typography variant="body2">Light</Typography>
                    <Switch
                      checked={isDarkThemeEnabled()}
                      onChange={(event) => {
                        switchTheme(event.target.checked, setDarkMode);
                      }}
                      inputProps={{ 'aria-label': 'theme toggle' }}
                    />
                    <Typography>Dark</Typography>
                  </Box>
                  <FormControl fullWidth>
                    <Button variant="contained" color="error">
                      LOGOUT
                    </Button>
                  </FormControl>
                </Box>
              </Box>
            </SidebarContainer>
          </Drawer>
          <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
            <Toolbar />
            <Outlet />
          </Box>
        </Box>
      ) : (
        <Authentication />
      )}
    </ThemeProvider>
  );
}
