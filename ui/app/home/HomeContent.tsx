import { useEffect, useState } from "react";
import SystemCard from "./SystemCard";
import { useShragaUser, useSystems, useSystemUser } from "utils/Hooks";
import { deleteSystem, getAllSystems } from "utils";
import CustomPrompt from "~/CustomPrompt/CustomPrompt";

// http://localhost:5000/api/auth/login?RelayState=http://localhost:5173/home

export function HomeContent() {
  const systemUser = useSystemUser();
  const shragaUser = useShragaUser();
  const [allSystems, setAllSystems] = useSystems(systemUser);
  const [loginUrl, setLoginUrl] = useState("");
  const [isPromptOpen, setIsPromptOpen] = useState(false);
  const [deletedSystemName, setDeletedSystemName] = useState<string | null>(
    null
  );

  // useEffect(() => {
  //   const port = window.location.port;
  //   if (!port) return;
  //   setLoginUrl(
  //     `http://localhost:5000/api/auth/login?RelayState=http://localhost:${port}/home`
  //   );
  // }, []);
  
  useEffect(() => {
    const port = window.location.port;
    if (!port) return;
    setLoginUrl(
      `http://localhost:80/api/auth/login?RelayState=http://localhost:80/home`
    );
  }, []);
  

  // פונקציה למחיקת מערכת
  const handleDeleteSystem = async (systemId: string, systemName: string) => {
    await deleteSystem(systemId, systemUser?.status!);
    const allSys = await getAllSystems();
    setAllSystems(allSys);
    setDeletedSystemName(systemName);
    setIsPromptOpen(true);
  };

  if (!systemUser || !shragaUser) {
    return (
      <div className="home">
        <div className="center">
          <a href={loginUrl}>היי עליך להתחבר</a>
        </div>
      </div>
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
      <CustomPrompt
        Component={() => <>{deletedSystemName} deleted</>}
        isVisible={isPromptOpen}
        onClose={() => setIsPromptOpen(false)}
      />
      <div className="home">
        <h1>
          Hello {shragaUser.name.firstName} {shragaUser.name.lastName}
        </h1>
        <div className="center">
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
        </div>
      </div>
    </>
  );
}
