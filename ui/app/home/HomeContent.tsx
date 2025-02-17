import SystemCard from "./SystemCard";
import { useShragaUser, useSystems, useSystemUser } from "utils/Hooks";



// http://localhost:5000/api/auth/login?RelayState=http://localhost:5174/home



export function HomeContent() {
  const systemUser = useSystemUser();
  const shragaUser = useShragaUser();
  const allSystems = useSystems(systemUser);
  



  if (!systemUser) {
    return (
      <div className="home">
        <div className="center">
          <h1>היי עליך להתחבר</h1>
        </div>
      </div>
    );
  }

  if(!allSystems || !systemUser || !shragaUser) {
    return (
      <div className="home">
        <div className="center">
          <h1>loading...</h1>
        </div>
      </div>
    );
  }


  return (
<div className="home">
  <h1>Hello {shragaUser.name.firstName} {shragaUser.name.lastName}</h1>
  <div className="center">
  {allSystems.map((system: { _id: string; name: string; status: boolean}) => (
    <SystemCard system={system} user={systemUser} key={system._id} />
  ))}
  </div>
</div>

  );
}



