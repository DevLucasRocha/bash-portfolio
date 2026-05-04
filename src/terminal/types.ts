import type { ReactNode } from "react";

// Representar cada linha exibível no histórico do terminal.
export type HistoryLine = {
  kind: "command" | "output" | "error";
  text: ReactNode;
};

// Enumerar temas disponíveis para simular shells reais.
export type ThemeKey = "ubuntu" | "macos" | "powershell";
