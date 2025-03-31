import cookies from "js-cookie";

export class AuthService {
  static logout = () => {
    cookies.remove("vision-access-token");
    cookies.remove("connect.sid");
    window.location.replace(
      `${'/api/auth/login'}?RelayState=${window.location.href}`
    );
  };
}
