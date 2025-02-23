import { styled } from "@mui/material/styles";

const HomeCard = styled("div")(() => ({
  height: "100vh",
  width: "100vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  "& .center": {
    width: "80%",
    height: "80%",
    minWidth: "800px",
    border: "1px solid black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "30px",
  },
  "& .systemCard": {
    width: "300px",
    maxWidth: "80%",
  },
}));

export default HomeCard;


