import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "utils";
import axios from "axios";
import type {  IShragaUser, ISystem } from "./interfaces";


const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_ROUTE,

  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


export function useShragaUser() {
  const [shragaUser, setShragaUser] = useState<IShragaUser | null>(null);
  useEffect(() => {
    const getShragaUser = getCookie("vision-access-token");
    if (getShragaUser) {
      const decodedShragaUser: IShragaUser = jwtDecode(getShragaUser);
      setShragaUser(decodedShragaUser);
    }
  }, []);

  return shragaUser;
}

export function useSystems(
  shragaUser: IShragaUser | null
) {


  const [allSystems, setAllSystems] = useState<ISystem[]>([]);


  useEffect(() => {
    if (shragaUser?._id) {
      const getSystems = async () => {
        try {
          const response = await api.get("/api/features");
          setAllSystems(response.data);
          console.log(response.data);
        } catch (error) {
          console.error(error);
        }
      };
      getSystems();
    }
  }, [shragaUser]);

  return [allSystems, setAllSystems] as const;
}

export function useSystemStatus(
  initialStatus: boolean,
  systemId: string,
  isAdmin: boolean
) {
  const [checked, setChecked] = useState(initialStatus);

  const toggleStatus = () => {
    if (!isAdmin) return;
    setChecked((prev) => !prev);
  };

  useEffect(() => {
    if (!isAdmin) return;
    api
      .put(`/api/features/${systemId}`, { status: checked })
      .catch(console.error);
  }, [checked, systemId]);

  return { checked, toggleStatus };
}





