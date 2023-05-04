import React, {useState} from 'react';
import {useNavigate} from 'react-router-dom';
import {Routes, Route, Link} from 'react-router-dom';
import {AppBar, Toolbar, IconButton, Typography, List, ListItem, ListItemIcon, ListItemText, Drawer, Button} from '@mui/material';
import MenuIcon from '@mui/icons-material/Menu';
import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import { auth } from './Firebase';
const drawerWidth = 240;

const styles = {
  root: {
    display: 'flex',
  },
  drawer: {
    width: drawerWidth,
    flexShrink: 0,
  },
  drawerPaper: {
    width: drawerWidth,
  },
  content: {
    flexGrow: 1,
    padding: '24px',
  },
  listItem: {
    textDecoration: 'none',
    color: '#212121',
  },
  listItemIcon: {
    minWidth: '40px',
  },
  listItemSelected: {
    backgroundColor: '#f4f4f4',
    '&:hover': {
      backgroundColor: '#f4f4f4',
    },
  },
};

function Home() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    // perform logout actions
    auth.signOut();
    localStorage.removeItem('user');
    navigate('/login');
  };

  const sideMenu = (
    <div>
      <List>
        <ListItem button component={Link} to="/" className={styles.listItem}>
          <ListItemIcon className={styles.listItemIcon}>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItem>
      </List>
      {/* <Divider /> */}
      <List>
        <ListItem
          button
          component={Link}
          to="/my-progress"
          className={styles.listItem}
          selected={window.location.pathname === '/my-progress'}
          classes={{
            selected: styles.listItemSelected,
          }}
        >
          <ListItemIcon className={styles.listItemIcon}>
            <AssignmentIcon />
          </ListItemIcon>
          <ListItemText primary="My Progress" />
        </ListItem>
        <ListItem
          button
          component={Link}
          to="/my-profile"
          className={styles.listItem}
          selected={window.location.pathname === '/my-profile'}
          classes={{
            selected: styles.listItemSelected,
          }}
        >
          <ListItemIcon className={styles.listItemIcon}>
            <PersonIcon />
          </ListItemIcon>
          <ListItemText primary="My Profile" />
        </ListItem>
      </List>
    </div>
  );

  return (
    <div className={styles.root}>
      <AppBar position="static">
        <Toolbar>
          <IconButton edge="start" color="inherit" aria-label="menu" onClick={handleDrawerOpen}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" style={{flexGrow: 1}}>
            App Name
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        className={styles.drawer}
        variant="temporary"
        anchor="left"
        open={open}
        onClose={handleDrawerClose}
        classes={{
          paper: styles.drawerPaper,
        }}
      >
        {sideMenu}
      </Drawer>
      <main className={styles.content}>
        <Routes>
          {/* <Route path="/" element={<HomeLate />} />
          <Route path="/my-progress" element={<MyProgress />} />
          <Route path="/my-profile" element={<MyProfile />} /> */}
        </Routes>
      </main>
    </div>
  );
}

export default Home;
