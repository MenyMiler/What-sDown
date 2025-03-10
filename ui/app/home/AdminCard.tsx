import { CardActions, CardContent, Typography } from "@mui/material";
import { CardWrapper } from "./styled";
import type { IEntity } from "utils/interfaces";

interface Props {
  user: IEntity;
}

const AdminCard = ({ user }: Props) => {
  return (
    <div style={{ width: "300px" }}>
      <CardWrapper variant="outlined">
        <CardContent>
          <Typography variant="h6" component="div">
            {user.firstName + " " + user.lastName}
            Role : Admin
          </Typography>
        </CardContent>
        <CardActions>CardActions</CardActions>
      </CardWrapper>
    </div>
  );
};

export default AdminCard;
