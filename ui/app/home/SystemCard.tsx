import {
  Card,
  CardActions,
  CardContent,
  IconButton,
  Switch,
  Typography,
} from "@mui/material";
import React, { useState } from "react";
import type { IMyUser, ISystem } from "utils";
import {  useSystemStatus } from "utils/Hooks";
import CustomPrompt from "~/CustomPrompt/CustomPrompt";

interface Props {
  system: ISystem;
  user: IMyUser;
  onDelete: () => void;
}

const label = { inputProps: { "aria-label": "Switch demo" } };

const SystemCard = ({ system, user, onDelete }: Props) => {
  const { checked, toggleStatus } = useSystemStatus(
    system.status,
    system._id,
    user.status
  );




  return (
    <>
      <Card
        variant="outlined"
        className="systemCard"
      >
        <React.Fragment>
          <CardContent>
            <Typography variant="h5" component="div">
              {system.name}
            </Typography>
          </CardContent>
          <CardActions>
            {user.status ? (
              <Switch
                {...label}
                checked={checked}
                onChange={() => toggleStatus()}
              />
            ) : (
              <Switch {...label} disabled checked={checked} />
            )}
            <IconButton onClick={onDelete} disabled={!user.status}>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="16"
                height="16"
                fill="currentColor"
                className="bi bi-trash3-fill"
                viewBox="0 0 16 16"
              >
                <path d="M11 1.5v1h3.5a.5.5 0 0 1 0 1h-.538l-.853 10.66A2 2 0 0 1 11.115 16h-6.23a2 2 0 0 1-1.994-1.84L2.038 3.5H1.5a.5.5 0 0 1 0-1H5v-1A1.5 1.5 0 0 1 6.5 0h3A1.5 1.5 0 0 1 11 1.5m-5 0v1h4v-1a.5.5 0 0 0-.5-.5h-3a.5.5 0 0 0-.5.5M4.5 5.029l.5 8.5a.5.5 0 1 0 .998-.06l-.5-8.5a.5.5 0 1 0-.998.06m6.53-.528a.5.5 0 0 0-.528.47l-.5 8.5a.5.5 0 0 0 .998.058l.5-8.5a.5.5 0 0 0-.47-.528M8 4.5a.5.5 0 0 0-.5.5v8.5a.5.5 0 0 0 1 0V5a.5.5 0 0 0-.5-.5" />
              </svg>
            </IconButton>
          </CardActions>
        </React.Fragment>
      </Card>
    </>
  );
};

export default SystemCard;
