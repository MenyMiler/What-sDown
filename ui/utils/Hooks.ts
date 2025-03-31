import { useEffect } from "react";
import { jwtDecode } from "jwt-decode";
import { getAllAdmins, getCookie } from "utils";
import type { IShragaUser } from "./interfaces";
import { useAdminsStore, useSystemStore, useUserStore } from "stores/user";
import { api } from "./axios";

export function useShragaUser() {
  const setUser = useUserStore((state) => state.setUser);

  useEffect(() => {
    const getShragaUser = getCookie("vision-access-token");
    if (getShragaUser) {
      const decodedShragaUser: IShragaUser = jwtDecode(getShragaUser);
      setUser(decodedShragaUser);
    }
  }, []);
}

export function useSystems() {
  const shragaUser = useUserStore((state) => state.user);
  const setAllSystems = useSystemStore((state) => state.setSystems);
  useEffect(() => {
    if (shragaUser?._id) {
      const getSystems = async () => {
        try {
          const response = await api.get("/api/systems");
          setAllSystems(response.data);
          console.log(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      getSystems();
    }
  }, [shragaUser]);
}

export function useGetAllAdmins() {
  const setAllAdmins = useAdminsStore((state) => state.setAdmins);
  useEffect(() => {
    async function fetchAdmins() {
      const admins = await getAllAdmins();
      setAllAdmins(admins!);
    }
    fetchAdmins();
  }, []);
}
