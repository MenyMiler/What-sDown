import { useEffect, useState } from "react";
import SystemCard from "./SystemCard";
import { useGetAllAdmins, useShragaUser, useSystems } from "utils/Hooks";
import {
  createSystem,
  deleteSystem,
  getAllAdmins,
  getAllSystems,
  saveNewAdmin,
  updateSystem,
  updateUser,
} from "utils";
import {
  HomeCard,
  HomeCenter,
  HomeNav,
  CustomPrompt,
  PromptOverlay,
  PromptTitle,
  PromptMessage,
  PlusButton,
  CloseButton,
  FlexDirectionColumn,
} from "./styled";
import { AuthService } from "services/authService";
import { ToastContainer, toast } from "react-toastify";
import Swal from "sweetalert2";
import { useAdminsStore, useSystemStore, useUserStore } from "stores/user";
import { typeUser, type IEntity, type ISystem } from "utils/interfaces";
import AdminCard from "./AdminCard";
import { Button } from "@mui/material";
import EntityNewAdmin from "./EntityNewAdmin";
import i18next from "i18next";
import "./styled";

export function HomeContent() {
  const shragaUser = useUserStore((state) => state.user);
  const allSystems = useSystemStore((state) => state.systems);
  const allAdmins = useAdminsStore((state) => state.admins);
  const setAllSystems = useSystemStore((state) => state.setSystems);
  const setAdmins = useAdminsStore((state) => state.setAdmins);
  const [openNewPopup, setOpenNewPopup] = useState(false);
  useShragaUser();
  useSystems();
  useGetAllAdmins();
  const [loginUrl, setLoginUrl] = useState("");
  const [openAdminsPopUp, setOpenAdminsPopUp] = useState(false);
  const [selectedAdmin, setSelectedAdmin] = useState<IEntity | null>(null);


  const handleOpenAdminsPopUp = () => {
    if(shragaUser.type == "USER") return toast.error(i18next.t("toast_messages.no_permission"));
    setOpenAdminsPopUp(true);
  };

  const handlePlusClick = () => {
    setOpenAdminsPopUp(false);
    setOpenNewPopup(true);
  };

  const handleBackClick = () => {
    setOpenNewPopup(false);
    setOpenAdminsPopUp(true);
  };

  useEffect(() => {
    setLoginUrl(
      `${
        import.meta.env.VITE_BACKEND_BASE_ROUTE
      }/api/auth/login?RelayState=${encodeURIComponent(window.location.href)}`
    );
  }, []);

  useEffect(() => {
    if (allAdmins) {
      console.log(allAdmins);
    }
    if (shragaUser) {
      console.log(shragaUser);
    }
  }, [allAdmins, shragaUser]);

  const handleDeleteSystem = async (systemId: string, systemName: string) => {
    const res = await deleteSystem(systemId, shragaUser?.type!);
    if (res?.status === 200) {
      toast.success(
        i18next.t("toast_messages.system_deleted", { name: systemName })
      );
      setAllSystems(await getAllSystems());
    }
  };

  const handleCreateSystem = async () => {
    if(shragaUser.type == "USER") return toast.error(i18next.t("toast_messages.no_permission"));
    const { value: formValues } = await Swal.fire({
      title: i18next.t("headings.new_system"),
      html: `
      <div style="display: flex; flex-direction: column; align-items: center; direction: rtl">
        <input id="swal-input" class="swal2-input" placeholder="${i18next.t(
          "labels.Name_for_system"
        )}">
        <label style="display: flex; align-items: center; gap: 5px; margin-top: 10px;">
          <input type="checkbox" id="swal-checkbox"> ${i18next.t(
            "labels.if_activate_system"
          )}
        </label>
      </div>
    `,
      focusConfirm: false,
      showCancelButton: true,
      confirmButtonText: i18next.t("buttons.create"),
      cancelButtonText: i18next.t("buttons.cancel"),
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

        if (res?.status === 200) {
          toast.success(
            i18next.t("toast_messages.system_created", {
              name: formValues.name,
            })
          );
          setAllSystems(await getAllSystems());
        }
      } catch (err) {
        console.error("Failed to create new system:", err);
      }
    }
  };

  const updateSystemStatus = async (system: ISystem) => {
    try {
      const res = await updateSystem(system, shragaUser?.type!);
      if (res?.status === 200) {
        toast.success(
          i18next.t("toast_messages.system_updated", { name: system.name })
        );
        setAllSystems(await getAllSystems());
      }
    } catch (err) {
      console.error("Failed to update system:", err);
    }
  };

  const updateUserStatus = async (user: IEntity) => {
    try {
      const res = await updateUser(user, shragaUser?.type!);
      if (res?.status === 200) {
        toast.success(
          i18next.t("toast_messages.user_updated", {
            firstName: user.firstName,
            lastName: user.lastName,
          })
        );
        const admins = (await getAllAdmins()) || [];
        setAdmins(admins);
      }
    } catch (err) {
      console.error("Failed to update system:", err);
    }
  };

  const handleSaveNewAdmin = async () => {
    if (selectedAdmin) {
      try {
        const response = await saveNewAdmin(selectedAdmin);
        if (response?.status === 200) {
          setAdmins(await getAllAdmins());
          toast.success(
            i18next.t("toast_messages.admin_added", {
              firstName: selectedAdmin.firstName,
              lastName: selectedAdmin.lastName,
            })
          );
        }
      } catch (error) {
        console.error("Error saving new admin:", error);
        alert("There was an error while adding the admin.");
      }
    }
  };

  if (shragaUser && allSystems.length === 0) {
    return (
      <div className="home">
        <div className="center">
          <h1>{i18next.t("labels.loading")}</h1>
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
            <a href={loginUrl}>{i18next.t("user_info.login")}</a>
          </HomeCenter>
        </HomeCard>
      </>
    );
  }

  return (
    <>
      <HomeCard>
        <HomeNav>
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              // AuthService.logout();
              alert("logout");
            }}
          >
            {i18next.t("buttons.logout")}
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => handleCreateSystem()}
          >
            {i18next.t("buttons.create_system")}
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => handleOpenAdminsPopUp()}
          >
            {i18next.t("buttons.all_admins")}
          </Button>
        </HomeNav>
        <h1>
          {i18next.t("user_info.welcome_user", {
            firstName: shragaUser.name.firstName,
            lastName: shragaUser.name.lastName,
          })}
        </h1>
        <HomeCenter>
          {allSystems &&
            allSystems.map(
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

      {openAdminsPopUp && (
        <PromptOverlay onClick={() => setOpenAdminsPopUp(false)}>
          <CustomPrompt onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <PromptTitle>{i18next.t("headings.allAdmins")}</PromptTitle>
            <PromptMessage>
              {allAdmins.length > 1 ? (
                allAdmins.map(
                  (admin) =>
                    admin._id !== shragaUser?.genesisId && (
                      <AdminCard
                        key={admin._id}
                        user={admin}
                        updateUserStatus={() =>
                          updateUserStatus({ ...admin, type: typeUser.user })
                        }
                      />
                    )
                )
              ) : (
                <p>{i18next.t("labels.no_admins")}</p>
              )}
              <CloseButton
                onClick={() => setOpenAdminsPopUp(false)}
                variant="contained"
                color="error"
              >
                X
              </CloseButton>
            </PromptMessage>
            <PlusButton onClick={handlePlusClick}>+</PlusButton>
          </CustomPrompt>
        </PromptOverlay>
      )}

      {openNewPopup && (
        <PromptOverlay onClick={handleBackClick}>
          <CustomPrompt onClick={(e: React.MouseEvent) => e.stopPropagation()}>
            <PromptTitle>{i18next.t("headings.newAdmin")}</PromptTitle>
            <PromptMessage>
              <EntityNewAdmin setSelectedAdmin={setSelectedAdmin} />
              <FlexDirectionColumn>
                <Button
                  onClick={handleBackClick}
                  variant="contained"
                  color="error"
                >
                  {i18next.t("buttons.back")}
                </Button>
                <Button
                  onClick={handleSaveNewAdmin}
                  variant="contained"
                  color="success"
                >
                  {i18next.t("buttons.save")}
                </Button>
              </FlexDirectionColumn>

              <CloseButton
                onClick={() => setOpenNewPopup(false)}
                variant="contained"
                color="error"
              >
                X
              </CloseButton>
            </PromptMessage>
          </CustomPrompt>
        </PromptOverlay>
      )}
    </>
  );
}
