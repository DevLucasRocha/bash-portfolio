import type { ReactNode } from "react";
import { Outlet, Link, createRootRoute, HeadContent, Scripts } from "@tanstack/react-router";

import appCss from "../styles.css?url";

function NotFoundComponent() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-zinc-950 px-4 text-zinc-100">
      <div className="max-w-md text-center">
        <h1 className="text-7xl font-bold text-zinc-100">404</h1>
        <h2 className="mt-4 text-xl font-semibold text-zinc-200">Página não encontrada</h2>
        <p className="mt-2 text-sm text-zinc-400">
          A rota solicitada não existe ou foi movida.
        </p>
        <div className="mt-6">
          <Link
            to="/"
            className="inline-flex items-center justify-center rounded-md bg-emerald-600 px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-emerald-500"
          >
            Voltar ao terminal
          </Link>
        </div>
      </div>
    </div>
  );
}

export const Route = createRootRoute({
  head: () => ({
    meta: [
      { charSet: "utf-8" },
      { name: "viewport", content: "width=device-width, initial-scale=1" },
      { title: "Lucas Rocha — Terminal Portfolio" },
      {
        name: "description",
        content: "Portfólio interativo em estilo terminal: DevOps, Cloud e Engenharia de Software.",
      },
      { property: "og:title", content: "Lucas Rocha — Terminal Portfolio" },
      { property: "og:type", content: "website" },
    ],
    links: [
      {
        rel: "stylesheet",
        href: appCss,
      },
    ],
  }),
  shellComponent: RootShell,
  component: RootComponent,
  notFoundComponent: NotFoundComponent,
});

function RootShell({ children }: { children: ReactNode }) {
  return (
    <html lang="pt-BR">
      <head>
        <HeadContent />
      </head>
      <body className="antialiased">{children}<Scripts /></body>
    </html>
  );
}

function RootComponent() {
  return <Outlet />;
}
