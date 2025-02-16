import { useEffect } from "react";
import { useLocation } from "react-router";

const LoginContent = () => { 

    useEffect(() => { 
        //navigate to login
        window.location.href = `http://localhost:5000/api/auth/login?RelayState=http://localhost:5173/home`;
      }, [])

  
  return (
    <div>
      login
    </div>
  )
}

export default LoginContent
