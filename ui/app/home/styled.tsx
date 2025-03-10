import { Card } from "@mui/material";
import { styled } from "@mui/material/styles";



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




// העיצוב של המודל שמופיע על המסך
export const PromptOverlay = styled("div")(() => ({
  position: "fixed",
  top: 0,
  left: 0,
  width: "100%",
  height: "100%",
  backgroundColor: "rgba(0, 0, 0, 0.5)", // רקע כהה עם שקיפות
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
}));

export const CustomPrompt = styled("div")(() => ({
  width: "50%", 
  height: "50%", 
  backgroundColor: "white", 
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  borderRadius: "10px",
  boxShadow: "0px 4px 6px rgba(0, 0, 0, 0.1)",
}));

export const PromptTitle = styled("h2")(() => ({
  fontSize: "1.5rem",
  width: "100%",
  height: "10%", 
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  
  // backgroundColor: "blue",
}));


export const PromptMessage = styled("p")(() => ({
  fontSize: "1rem",
  width: "100%",
  height: "90%",
  overflowY: "scroll",
  padding: "10px",
  "&::-webkit-scrollbar": {
    display: "none", 
  },
  // backgroundColor: "#c4d683",
  display: "flex",  
  justifyContent: "center",
  alignItems: "center",
  flexDirection: "column",
  gap: "10px",
}));

export const AdminCardStyled = styled("div")(() => ({
  width: "300px",
  maxWidth: "80%",
  height: "100px",
  border: "1px solid gray",
  direction: "rtl",
  padding: "10px",

  
  // backgroundColor: "#fa0f0f",
  
}))





