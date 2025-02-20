import { useEffect } from "react";


const LoginContent = () => { 
  
    // useEffect(() => { 
    //     //navigate to login
    //     const port = window.location.port;
    //     if (!port) return;
    //     // window.location.href = `http://localhost:5000/api/auth/login?RelayState=http://localhost:${port}/home`;
    //     // window.location.href = `http://backend/api/auth/login?RelayState=http://ui/home`;
    //     // window.location.href = `http://localhost:5000/api/auth/login?RelayState=${window.location.origin}:3000/home`;
    //     // window.location.href = `http://localhost:5000/api/auth/login?RelayState=localhost:3000/home`;
    //     window.location.href = `http://localhost:5000/api/auth/login?RelayState=localhost:3000/home`;

    //   }, [])

    useEffect(() => { 
      window.location.replace(`/api/auth/login?RelayState=/home`);
  }, [])

  
  return (
    <div>
      login
    </div>
  )
}

export default LoginContent
