import {
  CardActions,
  CardContent,
  IconButton,
  Switch,
  Typography,
} from "@mui/material";
import { CardWrapper } from "./styled";
import { typeUser, type IShragaUser, type ISystem } from "utils/interfaces";
import DeleteIcon from "./TrashIcon";

interface Props {
  system: ISystem;
  user: IShragaUser;
  onDelete: () => void;
  updateSystemStatus: (system: ISystem) => void;
}

const label = { inputProps: { "aria-label": "Switch demo" } };

const SystemCard = ({ system, user, onDelete, updateSystemStatus }: Props) => {
  return (
    <CardWrapper variant="outlined">
      <CardContent>
        <Typography variant="h5" component="div">
          {system.name}
        </Typography>
      </CardContent>
      <CardActions>
        {user.type === typeUser.admin ? (
          <Switch
            {...label}
            checked={system.status}
            onChange={() =>
              updateSystemStatus({ ...system, status: !system.status })
            }
          />
        ) : (
          <Switch {...label} disabled checked={system.status} />
        )}
        <IconButton onClick={onDelete} disabled={user.type === typeUser.user}>
          <DeleteIcon />
        </IconButton>
      </CardActions>
    </CardWrapper>
  );
};

export default SystemCard;
