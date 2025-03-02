import { useEffect } from "react";
import SystemCard from "./SystemCard";
import { useShragaUser, useSystems, useSystemUser } from "utils/Hooks";
import { deleteSystem, getAllSystems } from "utils";
import { HomeCard, HomeCenter, HomeNav } from "./styled";
import { AuthService } from "services/authService";
import { ToastContainer, toast } from "react-toastify";

export function HomeContent() {
  const systemUser = useSystemUser();
  const shragaUser = useShragaUser();
  const [allSystems, setAllSystems] = useSystems(systemUser);

  useEffect(() => {
    if (systemUser) {
      console.log({ systemUser });
    }
  }, [systemUser]);

  const handleDeleteSystem = async (systemId: string, systemName: string) => {
    const res = await deleteSystem(systemId, systemUser?.status!);
    if (res?.status == 200) {
      toast.success(`המערכת ${systemName} נמחקה בהצלחה`);
      const allSys = await getAllSystems();
      setAllSystems(allSys);
    }
  };

  if (!systemUser || !shragaUser) {
    return (
      <>
        <HomeCard>
          <HomeNav></HomeNav>
          <HomeCenter>
            <a
              href={`http://localhost:80/api/auth/login?RelayState=http://localhost:80/home`}
            >
              היי עליך להתחבר
            </a>
          </HomeCenter>
        </HomeCard>
      </>
    );
  }

  if (!allSystems) {
    return (
      <div className="home">
        <div className="center">
          <h1>loading...</h1>
        </div>
      </div>
    );
  }

  return (
    <>
      <HomeCard>
        <HomeNav>
          <button
            onClick={() => {
              AuthService.logout();
            }}
          >
            log out
          </button>
          <button>create system</button>
        </HomeNav>
        <h1>
          Hello {shragaUser.name.firstName} {shragaUser.name.lastName}
        </h1>
        <HomeCenter>
          {allSystems.map(
            (system: { _id: string; name: string; status: boolean }) => (
              <div key={system._id}>
                <SystemCard
                  system={system}
                  user={systemUser}
                  key={system._id}
                  onDelete={() => {
                    handleDeleteSystem(system._id, system.name);
                  }}
                />
              </div>
            )
          )}
        </HomeCenter>
      </HomeCard>
      <ToastContainer />
    </>
  );
}

