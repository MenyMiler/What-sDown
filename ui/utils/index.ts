import axios from "axios";
import type { IEntity, IShragaUser, ISystem, NewSistem } from "./interfaces";

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

export async function deleteSystem(systemId: string, isAdmin: boolean) {
  if (!isAdmin || !systemId) return;
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

export const updateSystem = async (system: ISystem, isAdmin: boolean) => {
  if (!isAdmin) return;
  try {
    const response = await api.put(`/api/features/${system._id}`, system);
    return response;
  } catch (err) {
    console.error(err);
  }
};

export const updateUser = async (user: IEntity, isAdmin: boolean) => {
  if (!isAdmin) return;
  try {
    const response = await api.put(`/api/users/genesisId/${user._id}`, {
      status: user.status,
    });
    return response;
  } catch (err) {
    console.error(err);
  }
};

export const getAllAdmins = async () => {
  // let allAdmins: IEntity[] = [];
  // try {
  //   const response = await api.get(`/api/users/admins`);
  //   console.log({ response });
  //   for (const admin of response.data) {
  //     // const user = await axios.get(`/api/entities/${admin.genesisId}`);  // השתמש ב-Proxy המקומי
  //     const user = await axios.get(`https://kartoffel.branch-yesodot.org/api/entities/${admin.genesisId}`);
  //     allAdmins.push({ ...user.data, status: true });
  //   }
  //   return allAdmins;
  try {
    const response = await api.get(`/api/users/admins`);
    return response.data;
  } catch (error: any) {
    console.log(error);
  }
};
