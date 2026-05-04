import { createFileRoute } from "@tanstack/react-router";
import Terminal from "@/components/terminal/Terminal";

// Declarar a rota principal e configurar metadados para SEO e compartilhamento.
export const Route = createFileRoute("/")({
  component: Index,
  head: () => ({
    meta: [
      { title: "Bash Portfolio - Lucas Rocha" },
      { name: "description", content: "Portfólio em estilo terminal: Cloud, Automação, Go e React." },
    ],
  }),
});

// Renderizar a experiência principal do portfólio em formato de terminal.
function Index() {
  return <Terminal />;
}
