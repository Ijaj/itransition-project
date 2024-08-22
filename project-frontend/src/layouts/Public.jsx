import React, { useState } from "react";
import { Outlet } from "react-router-dom";

import {
  Box,
  Toolbar,
  CssBaseline,
  useMediaQuery,
} from "@mui/material";
import { ThemeProvider } from "@mui/material/styles";
import { useTheme } from "@mui/material/styles";

import Authentication from "../views/authentication";
import { activeRoutesArray } from "../routes.js";
import { getTheme, isDarkThemeEnabled } from "../themes";
import { AlertProvider } from "../components/Alert";
import MyAppBar from "../components/AppBar/index.jsx";

export default function PublicLayout() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const [darkMode, setDarkMode] = useState(isDarkThemeEnabled());

  const loggedIn = activeRoutesArray[0].path !== "/login";

  return (
    <ThemeProvider theme={getTheme()}>
      <CssBaseline />
      <AlertProvider>
        {loggedIn ? (
          <Box display="flex">
            {/* <AppBar
              position="fixed"
              sx={{ zIndex: (theme) => theme.zIndex.drawer + 1 }}
            >
              <Toolbar>
                <Typography
                  variant="h6"
                  noWrap
                  component="div"
                  color="whitesmoke"
                  sx={{ flexGrow: 1 }}
                >
                  <Link href={'/'} color="inherit" underline="none">{siteTitle}</Link>
                </Typography>
                {isMobile ? (
                  <>
                    <IconButton
                      size="large"
                      edge="end"
                      color="inherit"
                      aria-label="menu"
                      onClick={handleMenu}
                    >
                      <MenuIcon />
                    </IconButton>
                    <Menu
                      id="menu-appbar"
                      anchorEl={mobileAnchorEl}
                      anchorOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      keepMounted
                      transformOrigin={{
                        vertical: 'top',
                        horizontal: 'right',
                      }}
                      open={Boolean(mobileAnchorEl)}
                      onClose={handleClose}
                    >
                      <MenuItem onClick={(e) => e.stopPropagation()}>
                        <MaterialUISwitch
                          checked={darkMode}
                          onChange={(event) => {
                            event.stopPropagation();
                            switchTheme(event.target.checked, setDarkMode);
                          }}
                        />
                      </MenuItem>
                    </Menu>
                  </>
                ) : (
                  <Box
                    sx={{
                      display: 'flex',
                      alignItems: 'center',
                      flexGrow: 1,
                    }}
                  >
                    <Button
                      color="inherit"
                      variant="text"
                      size="large"
                      onClick={() => navigate('/collections')}
                    >
                      All Collections
                    </Button>
                    <Box width={40} />
                    <Search />
                    <Box>
                      <IconButton
                        size="large"
                        edge="end"
                        color="inherit"
                        aria-label="account"
                        aria-controls="menu-appbar"
                        aria-haspopup="true"
                        onClick={handleMenuOpen}
                      >
                        <AccountCircle />
                      </IconButton>
                      <Menu
                        id="menu-appbar"
                        anchorEl={anchorEl}
                        anchorOrigin={{
                          vertical: 'bottom',
                          horizontal: 'center',
                        }}
                        keepMounted
                        transformOrigin={{
                          vertical: 'top',
                          horizontal: 'right',
                        }}
                        open={Boolean(anchorEl)}
                        onClose={handleMenuClose}
                      >
                        {
                          menuItems
                        }
                        <Divider />
                        <MenuItem>
                          <Switch
                            checked={isDarkThemeEnabled()}
                            onChange={(event) => {
                              switchTheme(event.target.checked, setDarkMode);
                            }}
                            inputProps={{ 'aria-label': 'theme toggle' }}
                          />
                          {isDarkThemeEnabled() ? 'Dark Mode' : 'Light Mode'}
                        </MenuItem>
                      </Menu>
                    </Box>
                  </Box>
                )}
              </Toolbar>
            </AppBar> */}
            <MyAppBar darkMode={darkMode} isMobile={isMobile} loggedIn={loggedIn} setDarkMode={setDarkMode} key={'foikdjsfiksdjfk'} />
            <Box component="main" sx={{ flexGrow: 1, p: 3 }}>
              <Toolbar />
              <Outlet />
            </Box>
          </Box>
        ) : (
          <Authentication />
        )}
      </AlertProvider>
    </ThemeProvider>
  );
}
