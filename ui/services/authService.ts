import { environment } from "../utils/enve_";
import cookies from "js-cookie";
// import { jwtDecode } from 'jwt-decode';

export class AuthService {
//   static getUser = (): UserState['user'] | null => {
//       // only for npm run dev
//       if (import.meta.env.DEV && !import.meta.env.VITE_APP_IS_DOCKER) {
//           cookies.set(
//               environment.accessTokenName,
//               'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpZCI6IjVlNTY4ODMyNDIwM2ZjNDAwNDM1OTFhYSIsImFkZnNJZCI6InQyMzQ1ODc4OXNoQGplbGxvIiwiZ2VuZXNpc0lkIjoiNWU1Njg4MzI0MjAzZmM0MDA0MzU5MWFhIiwibmFtZSI6eyJmaXJzdE5hbWUiOiLXoNeZ15nXp9eZIiwibGFzdE5hbWUiOiLXkNeT15nXk9ehIn0sImVtYWlsIjoidDIzNDU4Nzg5QGplbGxvLmNvbSIsImRpc3BsYXlOYW1lIjoidDIzNDU4Nzg5QGplbGxvLmNvbSIsInVwbiI6InQyMzQ1ODc4OUBqZWxsby5jb20iLCJwcm92aWRlciI6IkdlbmVzaXMiLCJlbnRpdHlUeXBlIjoiZGlnaW1vbiIsImpvYiI6ImdvaW5nIHRvIHNvbWV0aGluZyBncmF0ZSIsInBob25lTnVtYmVycyI6WyIwMjY2NjY5OTgiLCIwNTIxMjM0NTY1Il0sImNsZWFyYW5jZSI6IjAiLCJwaG90byI6Imh0dHA6Ly9ub3Qtc3VwcG9ydGVkLW91dHNpZGUtYnkta2FydG9mZmVsIiwiaWF0IjoxNjYxMzI3MDU3LCJleHAiOjE2NjE0MTM0NTd9.VbrKBGrA6eZAr74N6Wg-kfo4dZ8jd5DwdV55V-jW018',
//           );
//           console.log('Development Environment, using default auth cookie'); // eslint-disable-line no-console
//       }

//       const accessToken = cookies.get(environment.accessTokenName);

//       if (!accessToken) {
//           AuthService.logout();
//           return null;
//       }

//       const decodedToken = AuthService.parseUserToken(accessToken);

//       if (!decodedToken) {
//           AuthService.logout();
//           return null;
//       }

//       return decodedToken;
//   };

  static logout = () => {
    cookies.remove(environment.accessTokenName);
    cookies.remove("connect.sid");
    window.location.replace(
      `${environment.api.login}?RelayState=${window.location.href}`
    );
  };

  // static parseUserToken = (token: string) => {
  //     try {
  //         return jwtDecode(token) as any;
  //     } catch (error) {
  //         return null;
  //     }
  // };
}
