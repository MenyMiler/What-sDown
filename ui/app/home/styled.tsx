import { Card } from "@mui/material";
import { styled } from "@mui/material/styles";



export const CustomPrompt = styled("div")(() => ({

}));

export const HomeCard = styled("div")(() => ({
  height: "100vh",
  width: "100vw",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
}));


export const HomeNav = styled("div")(() => ({
  width: "100%",
  height: "10%",
  display: "flex",
  justifyContent: "space-around",
  alignItems: "center",
  backgroundColor: "#DBDBDB",
}))



export const HomeCenter = styled("div")(() => ({
    width: "80%",
    height: "90%",
    minWidth: "300px",
    border: "1px solid black",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    flexWrap: "wrap",
    gap: "30px",
    overflowY: "scroll",
    paddingTop: "3px",
    paddingBottom: "3px",
    "&::-webkit-scrollbar": {
      display: "none", 
    },
}));




export const CardWrapper = styled(Card)(() => ({
  width: "300px",
  maxWidth: "80%",
  margin: "auto",
}));


export const TrashIcon = styled("svg")(() => ({
  width: "16px",
  height: "16px",
  fill: "currentColor",
}));


export const StyledYesodotIcon = styled("img")({ position: 'absolute', right: 0, height: '3rem', width: '3rem' });





