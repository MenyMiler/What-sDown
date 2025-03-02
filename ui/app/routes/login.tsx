import LoginContent from "../Login/LoginContent";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "Login" },
    { name: "description", content: "Learn more about us." },
  ];
}

export default function Login() {
  return <LoginContent />;
}

