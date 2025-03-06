import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getCookie } from "utils";
import axios from "axios";
import type { IMyUser, IShragaUser, ISystem } from "./interfaces";


const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_ROUTE,

  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export function useSystemUser() {
  const [systemUser, setSystemUser] = useState<{
    _id: string;
    status: boolean;
    genesisId: string;
  } | null>(null);

  useEffect(() => {
    const getSystemUser = getCookie("systemUser");
    if (getSystemUser) {
      const decoded: IMyUser = jwtDecode(getSystemUser);
      if (decoded) {
        setSystemUser(decoded);
      }
    }
  }, []);

  return systemUser;
}

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
  systemUser: { _id: string; status: boolean; genesisId: string } | null
) {
//   const [allSystems, setAllSystems] = useState<ISystem[]>([
//     {
//         "_id": "67bc2d0d7e2b1ab124f9df09",
//         "name": "23 feature",
//         "status": true
//     },
//     {
//         "_id": "67bc2d107e2b1ab124f9df0b",
//         "name": "24 feature",
//         "status": true
//     },
//     {
//         "_id": "67bc2d137e2b1ab124f9df0d",
//         "name": "25 feature",
//         "status": true
//     },
//     {
//         "_id": "67bc2d167e2b1ab124f9df0f",
//         "name": "26 feature",
//         "status": true
//     },
//     {
//         "_id": "67bc2d207e2b1ab124f9df1a",
//         "name": "27 feature",
//         "status": true
//     },
//     {
//         "_id": "67bc2d247e2b1ab124f9df1c",
//         "name": "28 feature",
//         "status": true
//     },
//     {
//         "_id": "67bc2d277e2b1ab124f9df1e",
//         "name": "29 feature",
//         "status": true
//     }
// ]);

  const [allSystems, setAllSystems] = useState<ISystem[]>([]);



  useEffect(() => {
    if (systemUser) {
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
  }, [systemUser]);

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





