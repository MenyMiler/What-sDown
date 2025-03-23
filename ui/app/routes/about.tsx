import i18next from "i18next";
import type { Route } from "../+types/root";
import AboutContent from "../About/AboutContent";

export function meta({}: Route.MetaArgs) {
  return [
    { title: i18next.t("headings.about") }, 
    { name: "description", content: "Learn more about us." },
  ];
}

export default function About() {
  return <AboutContent />;
}

