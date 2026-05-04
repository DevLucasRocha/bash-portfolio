import { createFileRoute } from "@tanstack/react-router";
import Terminal from "@/components/Terminal";

export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Lucas — Portfólio | Engenheiro de Software & Infra" },
      { name: "description", content: "Portfólio em estilo terminal: Cloud, Automação, Go e React." },
    ],
  }),
});

function Index() {
  return <Terminal />;
}
