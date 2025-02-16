import { Card, CardActions, CardContent, Switch, Typography } from "@mui/material"
import React from "react";


interface Props {
    system: {
        _id: string;
        name: string;
        status: boolean;
    }
    user: {
        status: boolean;
        name: string;
        _id: string;
    }
}


const label = { inputProps: { 'aria-label': 'Switch demo' } };






const SystemCard = ({system, user}: Props) => {
  return (
    <Card variant="outlined" className="systemCard">
        <React.Fragment>
      <CardContent>
        <Typography variant="h5" component="div">
          {system.name}
        </Typography>
        <Typography variant="h5" component="div">
          גיף שמראה מכונה רצה אן מושבתת
        </Typography>
      </CardContent>
      <CardActions>
        {user.status ? system.status ? <Switch {...label} defaultChecked/> : <Switch {...label} /> : <Switch {...label} disabled/>}
       {/* <Switch {...label} />
       <Switch {...label} disabled/>
       <Switch {...label} defaultChecked /> */}
      </CardActions>
    </React.Fragment>
    </Card>
  )
}

export default SystemCard
