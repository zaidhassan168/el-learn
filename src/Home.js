import React, { useState } from "react";
import Drawer from "@mui/material/Drawer";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import HomeIcon from "@mui/icons-material/Home";
import AssignmentIcon from "@mui/icons-material/Assignment";
import PersonIcon from "@mui/icons-material/Person";
import {Routes, Route, Link } from "react-router-dom";
// import MyProgress from "./MyProgress";
// import MyProfile from "./MyProfile";
// import HomeLate from "./HomeLate";

const drawerWidth = 240;

const styles = {
  root: {
    display: "flex",
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
    padding: "24px",
  },
  listItem: {
    textDecoration: "none",
    color: "#212121",
  },
  listItemIcon: {
    minWidth: "40px",
  },
  listItemSelected: {
    backgroundColor: "#f4f4f4",
    "&:hover": {
      backgroundColor: "#f4f4f4",
    },
  },
};

function Home() {
  const [open, setOpen] = useState(false);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpen(open);
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
      <Divider />
      <List>
        <ListItem
          button
          component={Link}
          to="/my-progress"
          className={styles.listItem}
          selected={window.location.pathname === "/my-progress"}
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
          selected={window.location.pathname === "/my-profile"}
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
      <Drawer
        className={styles.drawer}
        variant="permanent"
        classes={{
          paper: styles.drawerPaper,
        }}
        anchor="left"
      >
        {sideMenu}
      </Drawer>
      <main className={styles.content}>
        <Routes>
          {/* <Route exact path="/" component={HomeLate} />
          <Route path="/my-progress" component={MyProgress} />
          <Route path="/my-profile" element = {} /> */}
          <Route path="/home" element={<Home />} />
        </Routes>
      </main>
    </div>
  );
}

export default Home;
