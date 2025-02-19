import axios from "axios";


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


export interface IShragaUser {
    id: string;
    adfsId: string;
    genesisId: string;
    name: { firstName: string; lastName: string; },
    email: string;
    displayName: string;
    upn: string;
    provider: string;
    personalNumber: string;
    entityType: string;
    job: string;
    phoneNumbers: any[];
    photo: string;
    identityCard: string;
  }

export interface ISystem  {
    _id: string;
    name: string;
    status: boolean;
}

export interface IMyUser {
    _id: string;
    status: boolean;
    genesisId: string
}


const api = axios.create({
  baseURL: "http://localhost:5000",
  // baseURL: "http://backend:5000",
  // baseURL: "http://my-nginx/api",


  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});


export async function deleteSystem(systemId: string, isAdmin: boolean)  {
  if (!isAdmin || !systemId) return;
  try {
    const response = await api.delete(`/api/features/${systemId}`);
    return response.data;
  } catch (err) {
    console.error(err);
  }
}


export async function getAllSystems()  {
  try {
    const response = await api.get(`/api/features/`);
    return response.data;
  } catch (err) {
    console.error(err);
  }
}