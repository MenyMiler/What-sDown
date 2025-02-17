import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import { getCookie, type IShragaUser, type ISystem } from "utils";
import axios from "axios";


const api = axios.create({
    baseURL: "http://localhost:5000",
    headers: {
      "Content-Type": "application/json",
    },
    withCredentials: true,
  });



export function useSystemUser() {
  const [systemUser, setSystemUser] = useState<{ _id: string; status: boolean; genesisId: string } | null>(null);

  useEffect(() => {
    const getSystemUser = getCookie("systemUser");
    if (getSystemUser) {
      const decoded: any = jwtDecode(getSystemUser);
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



export function useSystems(systemUser: { _id: string; status: boolean; genesisId: string } | null) {
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


  return allSystems;
}


export function useSystemStatus(initialStatus: boolean, systemId: string) {
  const [checked, setChecked] = useState(initialStatus);

  const toggleStatus = (isUserAllowed: boolean) => {
    if (!isUserAllowed) return;
    setChecked((prev) => !prev);
  };

  useEffect(() => {
    console.log({ checked });
    api.put(`/api/features/${systemId}`, { status: checked }).catch(console.error);
  }, [checked, systemId]);

  return { checked, toggleStatus };
}

