import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getAllAdmins, getCookie } from "utils";
import axios from "axios";
import type {  IEntity, IShragaUser, ISystem } from "./interfaces";
import { useAdminsStore, useSystemStore, useUserStore } from "stores/user";


const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_ROUTE,

  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


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

export function useSystems(
) {
  const shragaUser = useUserStore((state) => state.user);
  const setAllSystems = useSystemStore((state) => state.setSystems);
  useEffect(() => {
    if (shragaUser?._id) {
      const getSystems = async () => {
        try {
          const response = await api.get("/api/features");
          // setAllSystems(response.data);
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

// export function useSystemStatus(
//   initialStatus: boolean,
//   systemId: string,
//   isAdmin: boolean
// ) {
//   const [checked, setChecked] = useState(initialStatus);

//   const toggleStatus = () => {
//     if (!isAdmin) return;
//     setChecked((prev) => !prev);
//   };

//   useEffect(() => {
//     if (!isAdmin) return;
//     api
//       .put(`/api/features/${systemId}`, { status: checked })
//       .catch(console.error);
//   }, [checked, systemId]);

//   return { checked, toggleStatus };
// }





