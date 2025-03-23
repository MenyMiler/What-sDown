import i18next from "i18next";
import { useEffect } from "react";


const LoginContent = () => { 
  

    useEffect(() => { 
      // window.location.replace(`http://localhost:80/api/auth/login?RelayState=http://localhost:80/home`);
      // window.location.href = `http://localhost:80/api/auth/login?RelayState=${encodeURIComponent(window.location.href)}home`;
      window.location.href =  `${import.meta.env.VITE_BACKEND_BASE_ROUTE}/api/auth/login?RelayState=${encodeURIComponent(window.location.href)}home`;
  }, [])

  
  return (
    <div>
      {/* login */}
      {i18next.t("login")}
    </div>
  )
}

export default LoginContent

