import AboutContent from "../About/AboutContent";
import type { Route } from "./+types/about";

export function meta({}: Route.MetaArgs) {
  return [
    { title: "About Us" },
    { name: "description", content: "Learn more about us." },
  ];
}

export default function About() {
  return <AboutContent />;
}
