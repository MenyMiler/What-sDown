import axios from "axios";
import { typeUser, type IEntity, type IShragaUser, type ISystem, type NewSistem } from "./interfaces";

export function getCookie(name: string): string | null {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

const api = axios.create({
  baseURL: import.meta.env.VITE_BACKEND_BASE_ROUTE,

  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});

export async function deleteSystem(systemId: string, type: typeUser) {
  if (type === typeUser.user || !systemId) return;
  try {
    const response = await api.delete(`/api/features/${systemId}`);
    return response;
  } catch (err) {
    console.error(err);
  }
}

export async function getAllSystems() {
  try {
    const response = await api.get(`/api/features/`);
    return response.data;
  } catch (err) {
    console.error(err);
  }
}

export const createSystem = async (system: NewSistem) => {
  try {
    const response = await api.post(`/api/features/`, system);
    return response;
  } catch (err) {
    console.error(err);
  }
};

export const updateSystem = async (system: ISystem, type: typeUser) => {
  if (type === typeUser.user) return;
  try {
    const response = await api.put(`/api/features/${system._id}`, system);
    return response;
  } catch (err) {
    console.error(err);
  }
};

export const updateUser = async (user: IEntity, type: typeUser) => {
  if (type === typeUser.user) return;
  try {
    const response = await api.put(`/api/users/genesisId/${user._id}`, {
      type: user.type,
    });
    return response;
  } catch (err) {
    console.error(err);
  }
};

export const getAllAdmins = async () => {
  try {
    const response = await api.get(`/api/users/admins`);
    return response.data;
  } catch (error: any) {
    console.log(error);
  }
};



export const fetchEntities = async (page: number = 1, pageSize: number = 10): Promise<any[]> => {
  try {
    const response = await api.get(`/api/users/notAdmins?page=${page}&pageSize=${pageSize}`);
    return response.data;
  } catch (error) {
    console.error("Failed to fetch entities:", error);
    return [];
  }
}


export const saveNewAdmin = async (user: IEntity) => {
  try {
    const response = await api.post(`/api/users/addAdmin/${user._id}`);
    return response;
  } catch (err) {
    console.error(err);
  }
};
