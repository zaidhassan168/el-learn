import { styled } from "@mui/material/styles";
import ListItem from "@mui/material/ListItem";

const CustomListItem = styled(ListItem)(({ theme }) => ({
  "&:hover": {
    backgroundColor: "#e0e0e0",
    transform: "scale(1.10)", // Apply zoom effect
    transition: "transform 0.3s", // Add transition animation
  },
}));

export {CustomListItem};
