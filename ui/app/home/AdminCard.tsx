import { Button, CardActions, CardContent, Typography } from "@mui/material";
import { AdminCardStyled, CardWrapper } from "./styled";
import type { IEntity } from "utils/interfaces";

interface Props {
  user: IEntity;
  updateUserStatus: () => void;
}

const AdminCard = ({ user, updateUserStatus }: Props) => {
  return (
    <AdminCardStyled>
      <Typography variant="h6" component="div">
        {user.firstName + " " + user.lastName}
        Role : Admin
      </Typography>
      <CardActions style={{ justifyContent: "center", gap: "10px" }}>
        <Button onClick={updateUserStatus} size="small" variant="outlined" color="error">update Role</Button>
      </CardActions>
    </AdminCardStyled>
  );
};

export default AdminCard;
