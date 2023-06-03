import * as React from "react";
import { styled, useTheme } from "@mui/material/styles";
import Box from "@mui/material/Box";
import MuiDrawer from "@mui/material/Drawer";
import MuiAppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import List from "@mui/material/List";
import CssBaseline from "@mui/material/CssBaseline";
import Typography from "@mui/material/Typography";
import Divider from "@mui/material/Divider";
import IconButton from "@mui/material/IconButton";
import MenuIcon from "@mui/icons-material/Menu";
import ChevronLeftIcon from "@mui/icons-material/ChevronLeft";
import ChevronRightIcon from "@mui/icons-material/ChevronRight";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import ImportContactsRoundedIcon from '@mui/icons-material/ImportContactsRounded';
import RestoreRoundedIcon from "@mui/icons-material/RestoreRounded";
import LocalLibraryRoundedIcon from "@mui/icons-material/LocalLibraryRounded";
import HomeRoundedIcon from "@mui/icons-material/HomeRounded";
import AppSettingsAltRoundedIcon from "@mui/icons-material/AppSettingsAltRounded";

import { auth } from "../utils/Firebase";
import { useNavigate } from "react-router-dom";
import Button from "@mui/material/Button";
import Avatar from "@mui/material/Avatar";
import { deepPurple } from "@mui/material/colors";
import { useState, useEffect } from "react";
import WordCard from "../components/WordCard";
import Settings from "../components/Settings";
// import firebase from "firebase/compat/app";
import "firebase/compat/database";
import History from "../components/History";
import HomeDetails from "../components/HomeDetails";
import ChaptersList from "../components/ChaptersList";
import {initializeSpeech} from "../utils/Functions";
// import storeWords from "../utils/StoreWords";

const drawerWidth = 240;

const openedMixin = (theme) => ({
  width: drawerWidth,
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  overflowX: "hidden",
});

const closedMixin = (theme) => ({
  transition: theme.transitions.create("width", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  overflowX: "hidden",
  width: `calc(${theme.spacing(7)} + 1px)`,
  [theme.breakpoints.up("sm")]: {
    width: `calc(${theme.spacing(8)} + 1px)`,
  },
});

const DrawerHeader = styled("div")(({ theme }) => ({
  display: "flex",
  alignItems: "center",
  justifyContent: "flex-end",
  padding: theme.spacing(0, 1),
  // necessary for content to be below app bar
  ...theme.mixins.toolbar,
}));

const AppBar = styled(MuiAppBar, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  zIndex: theme.zIndex.drawer + 1,
  transition: theme.transitions.create(["width", "margin"], {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
  ...(open && {
    marginLeft: drawerWidth,
    width: `calc(100% - ${drawerWidth}px)`,
    transition: theme.transitions.create(["width", "margin"], {
      easing: theme.transitions.easing.sharp,
      duration: theme.transitions.duration.enteringScreen,
    }),
  }),
}));

const Drawer = styled(MuiDrawer, {
  shouldForwardProp: (prop) => prop !== "open",
})(({ theme, open }) => ({
  width: drawerWidth,
  flexShrink: 0,
  whiteSpace: "nowrap",
  boxSizing: "border-box",
  ...(open && {
    ...openedMixin(theme),
    "& .MuiDrawer-paper": openedMixin(theme),
  }),
  ...(!open && {
    ...closedMixin(theme),
    "& .MuiDrawer-paper": closedMixin(theme),
  }),
}));

export default function Home() {
  const theme = useTheme();
  const navigate = useNavigate();
  const [open, setOpen] = React.useState(false);
  const [selectedItem, setSelectedItem] = useState("home"); // set initial value to "home"
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    // const user = firebase.auth().currentUser;
    // if (user && user.displayName) {
    //   setDisplayName(user.displayName);
    // }
    const user = JSON.parse(localStorage.getItem("user"));
    if (user && user.displayName) {
      setDisplayName(user.displayName);
    }
    initializeSpeech();
    console.log(user);
  }, []);

  const handleDrawerOpen = () => {
    setOpen(true);
  };

  const handleDrawerClose = () => {
    setOpen(false);
  };

  const handleLogout = () => {
    auth.signOut();
    localStorage.removeItem("user");
    navigate("/login");
  };

  const handleItemClick = (item) => {
    setSelectedItem(item);
  };

  const renderContent = () => {
    switch (selectedItem) {
      case "home":
        return (
          <>
           <ChaptersList />
          </>
        );
      case "learn":
        return (
          <>
            <WordCard />
          </>
        );
      case "history":
        return (
          <>
            <History />
          </>
        );
      case "settings":
        return (
          <>
            <Settings />
          </>
        );
        case "chaptersList":
          return (
            <>
             <HomeDetails />

            </>
          );
      default:
        return null;
    }
  };

  return (
    <Box sx={{ display: "flex" }}>
      <CssBaseline />
      <AppBar position="fixed" open={open}>
        <Toolbar sx={{ display: "flex", justifyContent: "space-between" }}>
          <IconButton
            color="inherit"
            aria-label="open drawer"
            onMouseEnter={handleDrawerOpen}
            edge="start"
            sx={{
              marginRight: 5,
              ...(open && { display: "none" }),
            }}
          >
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" noWrap component="div">
            e-Learn
          </Typography>
          <Button color="inherit" onClick={handleLogout}>
            Logout
          </Button>
        </Toolbar>
      </AppBar>
      <Drawer
        variant="permanent"
        open={open}
        onMouseLeave={handleDrawerClose}
        onMouseOver={handleDrawerOpen}

      >
        <DrawerHeader>
          <IconButton onClick={handleDrawerClose}>
            {theme.direction === "rtl" ? (
              <ChevronRightIcon />
            ) : (
              <ChevronLeftIcon />
            )}
          </IconButton>
        </DrawerHeader>
        <Divider />
        <ListItem sx={{ display: "flex", justifyContent: "center" }}>
          <Avatar sx={{ bgcolor: deepPurple[500] }}>AT</Avatar>
        </ListItem>
        <ListItem sx={{ display: "flex", justifyContent: "center" }}>
          <ListItemText primary={displayName} />
        </ListItem>
        <Divider />
        <List>
          {[
            { label: "Home", icon: <HomeRoundedIcon />, item: "home" },
            {
              label: "Learn",
              icon: <LocalLibraryRoundedIcon />,
              item: "learn",
            },
            {
              label: "Chapter Word Details",
              icon: <ImportContactsRoundedIcon/>,
              item: "chaptersList",
            },
            { label: "History", icon: <RestoreRoundedIcon />, item: "history" },
            {
              label: "Settings",
              icon: <AppSettingsAltRoundedIcon color="blue">
                </AppSettingsAltRoundedIcon>,
              item: "settings",
            },
          ].map((item) => (
            <ListItem
              key={item.item}
              disablePadding
              sx={{ display: "block" }}
              onClick={() => handleItemClick(item.item)}
            >
              <ListItemButton
                sx={{
                  minHeight: 48,
                  justifyContent: open ? "initial" : "center",
                  px: 2.5,
                }}
              >
                <ListItemIcon
                  sx={{
                    minWidth: 0,
                    mr: open ? 3 : "auto",
                    justifyContent: "center",
                  }}
                >
                  {item.icon}
                </ListItemIcon>
                <ListItemText
                  primary={item.label}
                  sx={{ opacity: open ? 1 : 0 }}
                />
              </ListItemButton>
            </ListItem>
          ))}
        </List>
        <Divider />
      </Drawer>
      <Box component="main" sx={{ flexGrow: 1 }}>
        <DrawerHeader />
        {renderContent()}
      </Box>
    </Box>
  );
}
