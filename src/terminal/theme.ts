import type { ThemeKey } from "./types";

// Definir a ordem da rotação do theme switcher.
export const THEME_ORDER: ThemeKey[] = ["ubuntu", "macos", "powershell"];

export type ThemeDefinition = {
  prompt: string;
  shellBackground: string;
  pageBackground: string;
  containerBorder: string;
  headerBackground: string;
  headerBorder: string;
  promptColor: string;
  cursorColor: string;
  linkColor: string;
  title: string;
  switcherLabel: string;
  switcherPosition: "left" | "right";
};

// Mapear classes Tailwind e textos específicos de cada tema visual.
export const THEME_CONFIG: Record<ThemeKey, ThemeDefinition> = {
  ubuntu: {
    prompt: "lucas@portfolio:~$",
    shellBackground: "bg-[#300a24]",
    pageBackground: "bg-zinc-950",
    containerBorder: "border-zinc-800",
    headerBackground: "bg-zinc-800",
    headerBorder: "border-zinc-700",
    promptColor: "text-green-500",
    cursorColor: "bg-green-500",
    linkColor: "text-blue-300",
    title: "Terminal",
    switcherLabel: "Tema: Ubuntu",
    switcherPosition: "right",
  },
  macos: {
    prompt: "lucas@macbook ~ %",
    shellBackground: "bg-[#1c1c1e]",
    pageBackground: "bg-zinc-900",
    containerBorder: "border-zinc-700",
    headerBackground: "bg-zinc-600",
    headerBorder: "border-zinc-500",
    promptColor: "text-zinc-100",
    cursorColor: "bg-zinc-100",
    linkColor: "text-blue-300",
    title: "Terminal",
    switcherLabel: "Tema: macOS",
    switcherPosition: "right",
  },
  powershell: {
    prompt: "PS C:\\Users\\Lucas>",
    shellBackground: "bg-[#012456]",
    pageBackground: "bg-[#001a3d]",
    containerBorder: "border-blue-800",
    headerBackground: "bg-blue-900",
    headerBorder: "border-blue-700",
    promptColor: "text-amber-300",
    cursorColor: "bg-amber-300",
    linkColor: "text-cyan-300",
    title: "Windows PowerShell",
    switcherLabel: "Tema: PowerShell",
    switcherPosition: "left",
  },
};
