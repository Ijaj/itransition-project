import React, { useState } from "react";
import {
  Box,
  AppBar,
  Typography,
  Toolbar,
  Switch,
  IconButton,
  Menu,
  MenuItem,
  Link,
  Button,
  Divider,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { AccountCircle } from "@mui/icons-material";

import { isDarkThemeEnabled, switchTheme } from "../../themes";
import { siteTitle } from "../../helper/constants.js";
import Search from "../../views/public/search/app-bar-search.jsx";
import { setLogin } from "../../helper/helper.js";

export default function MyAppBar({ isMobile, user, setDarkMode, loggedIn, isAdmin = false }) {
  const navigate = useNavigate();
  const [anchorEl, setAnchorEl] = useState(null);

  function handleMenuOpen(event) {
    setAnchorEl(event.currentTarget);
  };

  function handleMenuClose() {
    setAnchorEl(null);
  };

  function handleLoginClick() {
    navigate('/authentication', { replace: true });
    handleMenuClose();
  };

  function handleLogoutClick() {
    setLogin(false);
    handleMenuClose();
    window.location.reload();
  };

  function handleMyCollection() {
    navigate('/collections/' + user.id, { replace: true });
    handleMenuClose();
  }

  const menuItems = [];
  if (loggedIn) {
    menuItems.push(<MenuItem key={0} onClick={handleMyCollection}>My Collections</MenuItem>)
    menuItems.push(<MenuItem key={1} onClick={handleLogoutClick}>Logout</MenuItem>)
  }
  else {
    menuItems.push(<MenuItem key={0} onClick={handleLoginClick}>Login / Register</MenuItem>)
  }

  console.log(user, loggedIn);

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
              {/* <MenuItem>{loggedIn ? `Logged In as: ${user.name}` : 'Not Logged In'}</MenuItem> */}
              <Box padding={2}>
                <Typography textAlign={'center'}>{loggedIn ? `Logged In as: ${user.name}` : 'Not Logged In'}</Typography>
              </Box>
              <Divider />
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
      </Toolbar>
    </AppBar>
  );
}