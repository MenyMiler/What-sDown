import { useEffect, useState } from "react";
import { jwtDecode } from "jwt-decode";
import axios from "axios";
import SystemCard from "./SystemCard";



// http://localhost:5000/api/auth/login?RelayState=http://localhost:5174/home

function getCookie(name: string): string | null {
  const cookies = document.cookie.split("; ");
  for (const cookie of cookies) {
    const [cookieName, cookieValue] = cookie.split("=");
    if (cookieName === name) {
      return decodeURIComponent(cookieValue);
    }
  }
  return null;
}

export function HomeContent() {
  const [vision_access_token, setVisionAccessToken] = useState('');
  const [curUser, setCurUser] = useState<{ _id: string; name: string; status: boolean} | null>();
  const [allSystems, setAllSystems] = useState([]);

  const api = axios.create({
    baseURL: 'http://localhost:5000',
    headers: {
      'Content-Type': 'application/json',
    },
    withCredentials: true, // מאפשר שליחת עוגיות לכל בקשה
  });

  

  useEffect(() => { 
    // setVisionAccessToken(document.cookie);

    // const token = getCookie("vision-access-token");
    const token = getCookie("userToken");
    if (token) {
      setVisionAccessToken(token);
    }
  }, [])

  useEffect(() => { 
    if (vision_access_token !== '' ) {
        // console.log('vision_access_token', vision_access_token);
        const decoded: any = jwtDecode(vision_access_token);
        if (decoded) {
          // console.log({decoded})
          setCurUser(decoded);
        }
    }
  }, [vision_access_token])

  useEffect(() => { 
    if (curUser) {
      console.log('curUser', curUser);
      // to get the features
      const getSystems = async () => {
        try {
          const response = await api.get('/api/features');
          const features = response.data;
          console.log('features', features);
          setAllSystems(features);
        } catch (error) {
          console.error(error);
        }
      }
      getSystems();
    }
  }, [curUser])
  



  if (!curUser) {
    return (
      <div className="home">
        <div className="center">
          <h1>היי עליך להתחבר</h1>
        </div>
      </div>
    );
  }

  if(!allSystems) {
    return (
      <div className="home">
        <div className="center">
          <h1>loading...</h1>
        </div>
      </div>
    );
  }


  return (
<div className="home">
  <div className="center">
  {allSystems.map((system: { _id: string; name: string; status: boolean}) => (
    <SystemCard system={system} user={curUser} key={system._id} />
  ))}
  </div>
</div>

  );
}



