import { HomeContent } from "~/home/HomeContent";
import type { Route } from "../+types/root";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "New React Router App" },
    { name: "description", content: "Welcome to React Routerscgcrs!wqer" },
  ];
}

export default function Home() {
  return <HomeContent />;
}

