import React, { useState } from "react";
import {
  Box,
  AppBar,
  Typography,
  Toolbar,
  CssBaseline,
  Switch,
  useMediaQuery,
  IconButton,
  Menu,
  MenuItem,
  Link,
  Button,
  Divider,
  styled
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AccountCircle, Menu as MenuIcon } from "@mui/icons-material";

import { isDarkThemeEnabled, switchTheme } from "../../themes";
import { siteTitle } from "../../helper/constants.js";
import Search from "../../views/public/search/app-bar-search.jsx";

const MaterialUISwitch = styled(Switch)(({ theme }) => ({
  width: 62,
  height: 34,
  padding: 7,
  "& .MuiSwitch-switchBase": {
    margin: 1,
    padding: 0,
    transform: "translateX(6px)",
    "&.Mui-checked": {
      color: "#fff",
      transform: "translateX(22px)",
      "& .MuiSwitch-thumb:before": {
        backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
          "#fff"
        )}" d="M4.2 2.5l-.7 1.8-1.8.7 1.8.7.7 1.8.6-1.8L6.7 5l-1.9-.7-.6-1.8zm15 8.3a6.7 6.7 0 11-6.6-6.6 5.8 5.8 0 006.6 6.6z"/></svg>')`,
      },
      "& + .MuiSwitch-track": {
        opacity: 1,
        backgroundColor: theme.palette.mode === "dark" ? "#b9b9b9" : "#ffc107",
      },
    },
  },
  "& .MuiSwitch-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#003892" : "#001e3c",
    width: 32,
    height: 32,
    "&::before": {
      content: "''",
      position: "absolute",
      width: "100%",
      height: "100%",
      left: 0,
      top: 0,
      backgroundRepeat: "no-repeat",
      backgroundPosition: "center",
      backgroundImage: `url('data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" height="20" width="20" viewBox="0 0 20 20"><path fill="${encodeURIComponent(
        "#fff"
      )}" d="M9.305 1.667V3.75h1.389V1.667h-1.39zm-4.707 1.95l-.982.982L5.09 6.072l.982-.982-1.473-1.473zm10.802 0L13.927 5.09l.982.982 1.473-1.473-.982-.982zM10 5.139a4.872 4.872 0 00-4.862 4.86A4.872 4.872 0 0010 14.862 4.872 4.872 0 0014.86 10 4.872 4.872 0 0010 5.139zm0 1.389A3.462 3.462 0 0113.471 10a3.462 3.462 0 01-3.473 3.472A3.462 3.462 0 016.527 10 3.462 3.462 0 0110 6.528zM1.665 9.305v1.39h2.083v-1.39H1.666zm14.583 0v1.39h2.084v-1.39h-2.084zM5.09 13.928L3.616 15.4l.982.982 1.473-1.473-.982-.982zm9.82 0l-.982.982 1.473 1.473.982-.982-1.473-1.473zM9.305 16.25v2.083h1.389V16.25h-1.39z"/></svg>')`,
    },
  },
  "& .MuiSwitch-track": {
    opacity: 1,
    backgroundColor: theme.palette.mode === "dark" ? "#3f51b5" : "#6c6c6c",
    borderRadius: 20 / 2,
  },
}));

export default function MyAppBar({ isMobile, darkMode, setDarkMode, loggedIn, isAdmin = false }) {
  const navigate = useNavigate();
  const [mobileAnchorEl, setMobileAnchorEl] = useState(null);
  const [anchorEl, setAnchorEl] = useState(null);

  function handleMenuOpen(event){
    setAnchorEl(event.currentTarget);
  };

  function handleMenuClose(){
    setAnchorEl(null);
  };

  function handleLoginClick(){
    handleMenuClose();
    // onLogin();
  };

  function handleLogoutClick(){
    handleMenuClose();
    // onLogout();
  };

  function handleMenu(event){
    setMobileAnchorEl(event.currentTarget);
  };

  function handleClose(){
    setMobileAnchorEl(null);
  };

  const menuItems = [];
  if (loggedIn) {
    menuItems.push(<MenuItem key={0} onClick={handleMenuClose}>Profile</MenuItem>)
    menuItems.push(<MenuItem key={1} onClick={handleLogoutClick}>Logout</MenuItem>)
  }
  else {
    menuItems.push(<MenuItem key={0} onClick={handleLoginClick}>Login</MenuItem>)
    menuItems.push(<MenuItem key={1} onClick={handleMenuClose}>Register</MenuItem>)
  }

  return (
    <AppBar
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
                    // handleClose();
                  }}
                />
              </MenuItem>
              {/* Add more menu items here if needed */}
            </Menu>
          </>
        ) : (
          <Box
            sx={{
              display: isAdmin ? 'none' : 'flex',
              alignItems: 'center',
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
            {/* <MaterialUISwitch
                      checked={darkMode}
                      onChange={(event) => {
                        switchTheme(event.target.checked, setDarkMode);
                      }}
                    /> */}
            <Box sx={{ ml: 2 }}>
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
    </AppBar>
  );
}