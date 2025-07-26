import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemButton, CssBaseline, Box, Divider, useTheme, useMediaQuery, Menu, MenuItem } from "@mui/material";
import { Home as HomeIcon, CalendarToday as BookingsIcon, ExitToApp as LogoutIcon, MoreVert as MoreVertIcon } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import { forceLogout } from "../utils/auth";
import AppTheme from "../template/AppTheme";
import ColorModeIconDropdown from "../template/ColorModeIconDropdown";

const drawerWidth = 260;

interface NavbarProps {
  children: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const [userMenuAnchor, setUserMenuAnchor] = React.useState<null | HTMLElement>(null);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();
  const user = authService.getStoredUser();

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  const handleNavigation = (path: string) => {
    navigate(path);
    if (isMobile) {
      setMobileOpen(false);
    }
  };

  const handleLogout = () => {
    try {
      // Clear all authentication data
      authService.clearAuth();
      
      // Force logout and redirect
      forceLogout();
      
      // Close user menu
      setUserMenuAnchor(null);
      
      // Force page reload to clear all state
      setTimeout(() => {
        window.location.reload();
      }, 100);
    } catch (error) {
      console.error('Logout error:', error);
      // Even if there's an error, still logout
      forceLogout();
    }
  };

  const handleUserMenuOpen = (event: React.MouseEvent<HTMLElement>) => {
    setUserMenuAnchor(event.currentTarget);
  };

  const handleUserMenuClose = () => {
    setUserMenuAnchor(null);
  };

  const menuItems = [
    { text: 'Home', path: '/homepage', icon: <HomeIcon /> },
    { text: 'My Bookings', path: '/mybookings', icon: <BookingsIcon /> },
  ];

  const drawer = (
    <Box sx={{ height: "100%", display: "flex", flexDirection: "column" }}>
      {/* Header */}
      <Box>
        <Toolbar>
          <Typography
            variant="h6"
            noWrap
          >
            RoomGPT
          </Typography>
          <ColorModeIconDropdown sx={{ ml: "auto" }} />
        </Toolbar>
        <Divider />
      </Box>

      {/* Menu Items */}
      <Box sx={{ flexGrow: 1 }}>
        <List sx={{ '& .MuiListItem-root': { mb: 1 } }}>
          {menuItems.map((item) => (
            <ListItem
              key={item.text}
              disablePadding
            >
              <ListItemButton 
                onClick={() => handleNavigation(item.path)}
                sx={{ 
                  borderRadius: 2,
                  py: 2,
                  px: 2
                }}
              >
                <Box sx={{ display: 'flex', alignItems: 'center', width: '100%' }}>
                  <Box sx={{ 
                    display: 'flex', 
                    alignItems: 'center', 
                    justifyContent: 'center',
                    mr: 2,
                    '& svg': {
                      width: '1.4rem !important',
                      height: '1.4rem !important'
                    }
                  }}>
                    {item.icon}
                  </Box>
                  <Typography
                    variant="h6"
                    sx={{
                      fontSize: '1rem',
                      fontWeight: 600,
                      letterSpacing: 0.3
                    }}
                  >
                    {item.text}
                  </Typography>
                </Box>
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Box>

      {/* Bottom Section - User Info */}
      {user && (
        <Box>
          <Divider />
          <Box sx={{ p: 2, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <Typography variant="subtitle1" fontWeight="bold">
              {user.name} {user.surname}
            </Typography>
            <IconButton 
              onClick={handleUserMenuOpen}
              size="small"
              sx={{ ml: 1 }}
            >
              <MoreVertIcon />
            </IconButton>
          </Box>
        </Box>
      )}
    </Box>
  );

  return (
    <AppTheme>
      <Box sx={{ display: "flex" }}>
        <CssBaseline />

        {/* AppBar */}
        {isMobile && (
          <AppBar
            position="fixed"
            sx={{
              width: { md: `calc(100% - ${drawerWidth}px)` },
              ml: { md: `${drawerWidth}px` },
            }}
          >
            <Toolbar>
              {isMobile && (
                <IconButton
                  color="inherit"
                  aria-label="open drawer"
                  edge="start"
                  onClick={handleDrawerToggle}
                  sx={{ mr: 2 }}
                >
                  <MenuIcon />
                </IconButton>
              )}
            </Toolbar>
          </AppBar>
        )}

        <Box
          component="nav"
          sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
          aria-label="sidebar menu"
        >
          <Drawer
            variant={isMobile ? "temporary" : "permanent"}
            open={isMobile ? mobileOpen : true}
            onClose={handleDrawerToggle}
            ModalProps={{ keepMounted: true }}
            sx={{
              "& .MuiDrawer-paper": {
                width: drawerWidth,
                boxSizing: "border-box",
              },
            }}
          >
            {drawer}
          </Drawer>
        </Box>

        <Box
          component="main"
          sx={{
            flexGrow: 1,
            width: { md: `calc(100% - ${drawerWidth}px)` },
          }}
        >
          {children}
        </Box>

        {/* User Menu */}
        <Menu
          anchorEl={userMenuAnchor}
          open={Boolean(userMenuAnchor)}
          onClose={handleUserMenuClose}
          anchorOrigin={{
            vertical: 'top',
            horizontal: 'right',
          }}
          transformOrigin={{
            vertical: 'bottom',
            horizontal: 'right',
          }}
        >
        
          <MenuItem onClick={() => { handleLogout(); handleUserMenuClose(); }}>
            <LogoutIcon sx={{ mr: 1 }} />
            Logout
          </MenuItem>
        </Menu>
      </Box>
    </AppTheme>
  );
};

export default Navbar;
