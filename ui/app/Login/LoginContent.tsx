import { useEffect } from "react";


const LoginContent = () => { 
  
    useEffect(() => { 
        //navigate to login
        const port = window.location.port;
        if (!port) return;
        window.location.href = `http://localhost:5000/api/auth/login?RelayState=http://localhost:${port}/home`;
      }, [])

  
  return (
    <div>
      login
    </div>
  )
}

export default LoginContent
