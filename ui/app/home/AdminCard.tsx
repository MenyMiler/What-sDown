import { Button, CardActions, CardContent, Typography } from "@mui/material";
import { AdminCardStyled, CardWrapper } from "./styled";
import type { IEntity } from "utils/interfaces";
import i18next from "i18next";

interface Props {
  user: IEntity;
  updateUserStatus: () => void;
}

const AdminCard = ({ user, updateUserStatus }: Props) => {
  return (
    <AdminCardStyled>
      <Typography variant="h6" component="div">
        {user.firstName + " " + user.lastName + " "}
        {i18next.t("user_info.role", { role: "מנהל" })}
      </Typography>
      <CardActions style={{ justifyContent: "center", gap: "10px" }}>
        <Button onClick={updateUserStatus} size="small" variant="outlined" color="error">{i18next.t("buttons.revoke_admin")}</Button>
      </CardActions>
    </AdminCardStyled>
  );
};

export default AdminCard;
