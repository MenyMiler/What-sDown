import {
  typeUser,
  type IEntity,
  type ISystem,
  type NewSistem,
} from "./interfaces";
import { api } from "./axios";

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

export async function deleteSystem(systemId: string, type: typeUser) {
  if (type === typeUser.user || !systemId) return;
  try {
    const response = await api.delete(`/api/systems/${systemId}`);
    return response;
  } catch (err) {
    console.error(err);
  }
}

export async function getAllSystems() {
  try {
    const response = await api.get(`/api/systems/`);
    return response.data;
  } catch (err) {
    console.error(err);
  }
}

export const createSystem = async (system: NewSistem) => {
  try {
    const response = await api.post(`/api/systems/`, system);
    return response;
  } catch (err) {
    console.error(err);
  }
};

export const updateSystem = async (system: ISystem, type: typeUser) => {
  if (type === typeUser.user) return;
  try {
    const response = await api.put(`/api/systems/${system._id}`, system);
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

export const fetchEntities = async (
  page: number = 1,
  pageSize: number = 10
): Promise<any[]> => {
  try {
    const response = await api.get(
      `/api/users/notAdmins?page=${page}&pageSize=${pageSize}`
    );
    return response.data;
  } catch (error) {
    console.error("Failed to fetch entities:", error);
    return [];
  }
};

export const saveNewAdmin = async (user: IEntity) => {
  try {
    const response = await api.post(`/api/users/addAdmin/${user._id}`);
    return response;
  } catch (err) {
    console.error(err);
  }
};
