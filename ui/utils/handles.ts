import i18next from "i18next";
import type { IEntity, IShragaUser, ISystem } from "./interfaces";
import { toast } from "react-toastify";
import Swal from "sweetalert2";
import {
  createSystem,
  deleteSystem,
  getAllAdmins,
  getAllSystems,
  saveNewAdmin,
  updateSystem,
} from "utils";

export const handleCreateSystem = async (
  shragaUser: IShragaUser,
  setAllSystems: Function
) => {
  if (shragaUser.type == "USER")
    return toast.error(i18next.t("toast_messages.no_permission"));
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
        isActive: (document.getElementById("swal-checkbox") as HTMLInputElement)
          ?.checked,
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

export const handleDeleteSystem = async (
  systemId: string,
  systemName: string,
  shragaUser: IShragaUser,
  setAllSystems: Function
) => {
  const res = await deleteSystem(systemId, shragaUser?.type!);
  if (res?.status === 200) {
    toast.success(
      i18next.t("toast_messages.system_deleted", { name: systemName })
    );
    setAllSystems(await getAllSystems());
  }
};

export const handleSaveNewAdmin = async (
  selectedAdmin: IEntity,
  setAdmins: Function
) => {
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

export const updateUserStatus = async (
  user: IEntity,
  shragaUser: IShragaUser,
  updateUser: Function,
  setAdmins: Function
) => {
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

export const updateSystemStatus = async (
  system: ISystem,
  shragaUser: IShragaUser,
  setAllSystems: Function
) => {
  try {
    const res = await updateSystem(system, shragaUser?.type!);
    if (res?.status === 200) {
      toast.success(
        i18next.t("toast_messages.system_updated", { name: system.name })
      );
      const systems = (await getAllSystems()) || [];
      setAllSystems(systems);
      console.log({ systems });
    }
  } catch (err) {
    console.error("Failed to update system:", err);
  }
};
