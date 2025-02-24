import { useEffect } from "react";


const LoginContent = () => { 
  

    useEffect(() => { 
      window.location.replace(`http://localhost:80/api/auth/login?RelayState=http://localhost:80/home`);
  }, [])

  
  return (
    <div>
      login
    </div>
  )
}

export default LoginContent
