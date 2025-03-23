import { HomeContent } from "~/home/HomeContent";
import type { Route } from "../+types/root";
import i18next from "i18next";

export function meta({}: Route.MetaArgs) {
  return [
    { title: i18next.t("headings.home") },
    { name: "description", content: "Welcome to React Routerscgcrs!wqer" },
  ];
}

export default function Home() {
  return <HomeContent />;
}

