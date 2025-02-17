import { Card, CardActions, CardContent, Switch, Typography } from "@mui/material"
import React from "react";
import type { IMyUser, ISystem } from "utils";
import { useSystemStatus } from "utils/Hooks";


interface Props {
    system: ISystem
    user: IMyUser
}


const label = { inputProps: { 'aria-label': 'Switch demo' } };





const SystemCard = ({system, user}: Props) => {
  const { checked, toggleStatus } = useSystemStatus(system.status, system._id);


  return (
    <Card variant="outlined" className="systemCard">
        <React.Fragment>
      <CardContent>
        <Typography variant="h5" component="div">
          {system.name}
        </Typography>
        {/* <Typography variant="h5" component="div">
          גיף שמראה מכונה רצה או מושבתת
        </Typography> */}
      </CardContent>
      <CardActions>
        {user.status ? (
            <Switch {...label} checked={checked} onChange={() => toggleStatus(user.status)} />
          ) : (
            <Switch {...label} disabled />
          )}
      </CardActions>
    </React.Fragment>
    </Card>
  )
}

export default SystemCard
