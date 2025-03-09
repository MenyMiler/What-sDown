import {  useEffect, useState } from "react";
import SystemCard from "./SystemCard";
import { useShragaUser, useSystems } from "utils/Hooks";
import { createSystem, deleteSystem, getAllSystems, updateSystem } from "utils";
import { HomeCard, HomeCenter, HomeNav } from "./styled";
import { AuthService } from "services/authService";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { useSystemStore, useUserStore } from "stores/user";
import type { ISystem } from "utils/interfaces";

export function HomeContent() {
  const shragaUser = useUserStore((state) => state.user);
  const allSystems = useSystemStore((state) => state.systems);
  const setAllSystems = useSystemStore((state) => state.setSystems);
  useShragaUser();
  useSystems();
  const [loginUrl, setLoginUrl] = useState("");

  useEffect(() => {
    setLoginUrl(
      `${
        import.meta.env.VITE_BACKEND_BASE_ROUTE
      }/api/auth/login?RelayState=${encodeURIComponent(window.location.href)}`
    );
  }, []);



  const handleDeleteSystem = async (systemId: string, systemName: string) => {
    const res = await deleteSystem(systemId, shragaUser?.status!);
    if (res?.status == 200) {
      toast.success(`המערכת ${systemName} נמחקה בהצלחה`);
      setAllSystems(await getAllSystems());
    }
  };

  const handleCreateSystem = async () => {
    const { value: formValues } = await Swal.fire({
      title: "Create new system",
      html: `
      <div style="display: flex; flex-direction: column; align-items: center;">
        <input id="swal-input" class="swal2-input" placeholder="Name for the new system">
        <label style="display: flex; align-items: center; gap: 5px; margin-top: 10px;">
          <input type="checkbox" id="swal-checkbox"> ?האם להפעיל את השירות מיד ביצירה
        </label>
      </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: "Create",
      showLoaderOnConfirm: true,
      preConfirm: () => {
        return {
          name: (document.getElementById("swal-input") as HTMLInputElement)
            ?.value,
          isActive: (
            document.getElementById("swal-checkbox") as HTMLInputElement
          )?.checked,
        };
      },
    });

    if (formValues?.name) {
      try {
        const res = await createSystem({
          name: formValues.name,
          status: formValues.isActive, 
        });

        if (res?.status == 200) {
          toast.success(`המערכת ${formValues.name} נוצרה בהצלחה`);
          setAllSystems(await getAllSystems());
        }
      } catch (err) {
        console.error("Failed to create new system:", err);
      }
    }
  };

  const updateSystemStatus = async (system: ISystem) => {
    try {
      const res = await updateSystem(system, shragaUser?.status!);
      if (res?.status == 200) {
        toast.success(`המערכת ${system.name} עודכנה בהצלחה`);
        setAllSystems(await getAllSystems());
      }
    } catch (err) {
      console.error("Failed to update system:", err);
    }
  };

  if (shragaUser && allSystems.length == 0) {
    return (
      <div className="home">
        <div className="center">
          <h1>loading...</h1>
        </div>
      </div>
    );
  }

  if (shragaUser === null) {
    return (
      <>
        <HomeCard>
          <HomeNav></HomeNav>
          <HomeCenter>
            <a href={loginUrl}>היי עליך להתחבר</a>
          </HomeCenter>
        </HomeCard>
      </>
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
          <button onClick={() => handleCreateSystem()}>create system</button>
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
                  user={shragaUser}
                  key={system._id}
                  onDelete={() => {
                    handleDeleteSystem(system._id, system.name);
                  }}
                  updateSystemStatus={updateSystemStatus}
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
