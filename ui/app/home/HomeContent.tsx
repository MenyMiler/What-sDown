import { useEffect, useState } from "react";
import SystemCard from "./SystemCard";
import { useGetAllAdmins, useShragaUser, useSystems } from "utils/Hooks";
import { updateUser } from "utils";
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
import { ToastContainer, toast } from "react-toastify";
import { useAdminsStore, useSystemStore, useUserStore } from "stores/user";
import { typeUser, type IEntity, type ISystem } from "utils/interfaces";
import AdminCard from "./AdminCard";
import { Button } from "@mui/material";
import EntityNewAdmin from "./EntityNewAdmin";
import i18next from "i18next";
import "./styled";
import {
  handleCreateSystem,
  handleDeleteSystem,
  handleSaveNewAdmin,
  updateSystemStatus,
  updateUserStatus,
} from "utils/handles";

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
    if (shragaUser.type == "USER")
      return toast.error(i18next.t("toast_messages.no_permission"));
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
              alert("logout");
            }}
          >
            {i18next.t("buttons.logout")}
          </Button>
          <Button
            variant="outlined"
            color="inherit"
            onClick={() => handleCreateSystem(shragaUser, setAllSystems)}
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
                      handleDeleteSystem(
                        system._id,
                        system.name,
                        shragaUser,
                        setAllSystems
                      );
                    }}
                    updateSystemStatus={(system: ISystem) => {
                      updateSystemStatus(system, shragaUser, setAllSystems);
                    }}
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
                          updateUserStatus(
                            { ...admin, type: typeUser.user },
                            shragaUser,
                            updateUser,
                            setAdmins
                          )
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
                  onClick={() =>
                    handleSaveNewAdmin(selectedAdmin as IEntity, setAdmins)
                  }
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
