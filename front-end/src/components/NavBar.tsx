import React from "react";
import { AppBar, Toolbar, Typography, IconButton, Drawer, List, ListItem, ListItemButton, ListItemText, CssBaseline, Box, Divider, useTheme, useMediaQuery } from "@mui/material";
import { Home as HomeIcon, CalendarToday as BookingsIcon, ExitToApp as LogoutIcon } from "@mui/icons-material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import { authService } from "../services/authService";
import AppTheme from "../template/AppTheme";
import ColorModeIconDropdown from "../template/ColorModeIconDropdown";

const drawerWidth = 240;

interface NavbarProps {
  children: React.ReactNode;
}

const Navbar: React.FC<NavbarProps> = ({ children }) => {
  const [mobileOpen, setMobileOpen] = React.useState(false);
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("md"));
  const navigate = useNavigate();

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
    authService.logout();
  };

  const menuItems = [
    { text: 'Ana Sayfa', path: '/homepage', icon: <HomeIcon /> },
    { text: 'Rezervasyonlarım', path: '/mybookings', icon: <BookingsIcon /> },
  ];

  const drawer = (
    <div>
      <Toolbar>
        <Typography
          variant="h6"
          noWrap
        >
          Oda Rezervasyon
        </Typography>
      </Toolbar>
      <Divider />
      <List>
        {menuItems.map((item) => (
          <ListItem
            key={item.text}
            disablePadding
          >
            <ListItemButton onClick={() => handleNavigation(item.path)}>
              {item.icon}
              <ListItemText primary={item.text} sx={{ ml: 1 }} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
      <List>
        <ListItem disablePadding>
          <ListItemButton onClick={handleLogout}>
            <LogoutIcon />
            <ListItemText primary="Çıkış Yap" sx={{ ml: 1 }} />
          </ListItemButton>
        </ListItem>
      </List>
      <ColorModeIconDropdown></ColorModeIconDropdown>
    </div>
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
      </Box>
    </AppTheme>
  );
};

export default Navbar;
