import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Routes, Route, Link } from 'react-router-dom';
import { styled, useTheme, Theme, CSSObject } from '@mui/material/styles';
import {
  Toolbar,
  IconButton,
  Typography,
  List,
  Button,
  Grid,
  Card,
  CardContent,
  Slide,
} from '@mui/material';
import CssBaseline from '@mui/material/CssBaseline';
import MuiDrawer from '@mui/material/Drawer';
import MuiAppBar, { AppBarProps as MuiAppBarProps } from '@mui/material/AppBar';
import Divider from '@mui/material/Divider';
import MenuIcon from '@mui/icons-material/Menu';
import ChevronLeftIcon from '@mui/icons-material/ChevronLeft';
import ChevronRightIcon from '@mui/icons-material/ChevronRight';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import InboxIcon from '@mui/icons-material/MoveToInbox';
import MailIcon from '@mui/icons-material/Mail';

import HomeIcon from '@mui/icons-material/Home';
import AssignmentIcon from '@mui/icons-material/Assignment';
import PersonIcon from '@mui/icons-material/Person';
import { auth } from './Firebase';

const drawerWidth = 240;
const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: 'hidden',
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create('width', {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: 'hidden',
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up('sm')]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled('div')(({ theme }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== 'open',
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(['width', 'margin'], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(['width', 'margin'], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));
const Drawer = styled(MuiDrawer, { shouldForwardProp: (prop) => prop !== 'open' })(
  ({ theme, open }) => ({
    width: drawerWidth,
    flexShrink: 0,
    whiteSpace: 'nowrap',
    boxSizing: 'border-box',
    ...(open && {
      ...openedMixin(theme),
      '& .MuiDrawer-paper': openedMixin(theme),
    }),
    ...(!open && {
      ...closedMixin(theme),
      '& .MuiDrawer-paper': closedMixin(theme),
    }),
  }),
);
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
  card: {
    height: '200px',
    width: '300px',
    margin: '20px',
    padding: '20px',
    textAlign: 'center',
    boxShadow: '0px 0px 10px rgba(0, 0, 0, 0.2)',
  },
  cardContent: {
    height: '80%',
    display: 'flex',
    flexDirection: 'column',
    justifyContent: 'center',
  },
};

function FlashCard({ title, content }) {
  const [flipped, setFlipped] = useState(false);

  const handleFlip = () => {
    setFlipped(!flipped);
  };

  return (
    <Grid item>
      <Card sx={styles.card} onClick={handleFlip}>
        <CardContent sx={styles.cardContent}>
          <Typography variant="h5" component="h2">
            {flipped ? content : title}
          </Typography>
        </CardContent>
      </Card>
    </Grid>
  );
}

function Home() {
  const [open, setOpen] = useState(false);
  const navigate = useNavigate();

  const theme = useTheme();

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
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
          <Typography variant="h6" style={{ flexGrow: 1 }}>
            El-Learn
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer variant="permanent" open={open}>
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === 'rtl' ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <List>
          {['Inbox', 'Starred', 'Send email', 'Drafts'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
        <List>
          {['All mail', 'Trash', 'Spam'].map((text, index) => (
            <ListItem key={text} disablePadding sx={{ display: 'block' }}>
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? 'initial' : 'center',
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : 'auto',
                    justifyContent: 'center',
                  }}
                >
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} sx={{ opacity: open ? 1 : 0 }} />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
      </Drawer>
      <main className={styles.content}>
        <Grid container justifyContent="center" alignItems="center" spacing={2}>
          <FlashCard
            title="Learn Swedish"
            content="Swedish is a North Germanic language spoken natively by 10 million people, predominantly in Sweden and in parts of Finland, where it has equal legal standing with Finnish."
          />
          <FlashCard
            title="Learn English"
            content="English is a West Germanic language that was first spoken in early medieval England and eventually became a global lingua franca. It is widely used in business, science, and entertainment."
          />
          <FlashCard
            title="My Progress"
            content="You have completed 50% of the course. Keep up the good work!"
          />
          <FlashCard
            title="Random Content"
            content="Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed euismod, sapien vel bibendum bibendum, nisl sapien bibendum sapien, vel bibendum sapien sapien vel bibendum bibendum."
          />
        </Grid>
        <Routes>
          <Route path="/" element={<div>Welcome to the home page!</div>} />
          <Route path="/my-progress" element={<div>My Progress Page</div>} />
          <Route path="/my-profile" element={<div>My Profile Page</div>} />
        </Routes>
      </main>
    </div>
  );
}

export default Home;
