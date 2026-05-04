import { FormEvent, useEffect, useRef, useState } from "react";

type HistoryLine = {
  kind: "command" | "output" | "error";
  text: string;
};

type ThemeKey = "ubuntu" | "macos" | "powershell";

const AVAILABLE_COMMANDS = [
  "help",
  "whoami",
  "sobre",
  "experiencia",
  "exp",
  "skills",
  "stack",
  "certs",
  "clear",
];

const ABOUT_TEXT =
  "Lucas Henrique Souza de Santana da Rocha Santos - Engenheiro de Software | Full Stack | DevOps | Cloud (AWS, Azure, OCI). Especializado em automatizar infraestruturas complexas (Ansible, Terraform, Python) e desenvolver sistemas escaláveis (Golang, React).";

const EXPERIENCE_LINES = [
  "Projetos de Portfólio (Fevereiro/2026 - Presente): Criação do 'Fila Livre' (Go, React, MySQL via Aiven, Heurística Preditiva).",
  "Prefeitura de São Luís (Jun/2025 - Presente): Automação com Ansible/Terraform, SIEM Wazuh, scripts em Python/Bash pro GLPI e Proxmox VE.",
  "Subway Brasil: Suporte e automação de relatórios em Python.",
];

const SKILLS_TEXT =
  "Python, Golang, React.js, Bash, PowerShell, AWS, Azure, OCI, Docker, Ansible, Terraform, Proxmox, Wazuh, Zabbix.";

const CERTS_TEXT =
  "AWS Certified Cloud Practitioner, AZ-900, Oracle OCI Multicloud/AI/GenAI.";

const THEME_ORDER: ThemeKey[] = ["ubuntu", "macos", "powershell"];

const THEME_CONFIG: Record<
  ThemeKey,
  {
    prompt: string;
    shellBackground: string;
    pageBackground: string;
    containerBorder: string;
    headerBackground: string;
    headerBorder: string;
    promptColor: string;
    cursorColor: string;
    title: string;
    switcherLabel: string;
    switcherPosition: "left" | "right";
  }
> = {
  ubuntu: {
    prompt: "lucas@portfolio:~$",
    shellBackground: "bg-[#300a24]",
    pageBackground: "bg-zinc-950",
    containerBorder: "border-zinc-800",
    headerBackground: "bg-zinc-800",
    headerBorder: "border-zinc-700",
    promptColor: "text-green-500",
    cursorColor: "bg-green-500",
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
    title: "Windows PowerShell",
    switcherLabel: "Tema: PowerShell",
    switcherPosition: "left",
  },
};

export default function Terminal() {
  const [theme, setTheme] = useState<ThemeKey>("ubuntu");
  const [history, setHistory] = useState<HistoryLine[]>([
    { kind: "output", text: "Terminal Portfolio carregado. Digite 'help' para ver os comandos." },
  ]);
  const [command, setCommand] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const currentTheme = THEME_CONFIG[theme];

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const cycleTheme = () => {
    setTheme((previous) => {
      const nextIndex = (THEME_ORDER.indexOf(previous) + 1) % THEME_ORDER.length;
      return THEME_ORDER[nextIndex];
    });
    inputRef.current?.focus();
  };

  const runCommand = (rawCommand: string) => {
    const normalized = rawCommand.trim().toLowerCase();

    if (!normalized) {
      setHistory((prev) => [...prev, { kind: "command", text: `${currentTheme.prompt} ` }]);
      return;
    }

    if (normalized === "clear") {
      setHistory([]);
      return;
    }

    const nextLines: HistoryLine[] = [{ kind: "command", text: `${currentTheme.prompt} ${normalized}` }];

    switch (normalized) {
      case "help":
        nextLines.push({
          kind: "output",
          text: `Comandos: ${AVAILABLE_COMMANDS.join(", ")}`,
        });
        break;
      case "whoami":
      case "sobre":
        nextLines.push({ kind: "output", text: ABOUT_TEXT });
        break;
      case "experiencia":
      case "exp":
        EXPERIENCE_LINES.forEach((line) => nextLines.push({ kind: "output", text: `- ${line}` }));
        break;
      case "skills":
      case "stack":
        nextLines.push({ kind: "output", text: SKILLS_TEXT });
        break;
      case "certs":
        nextLines.push({ kind: "output", text: CERTS_TEXT });
        break;
      default:
        nextLines.push({
          kind: "error",
          text: `Comando não encontrado: ${normalized}. Digite 'help'.`,
        });
        break;
    }

    setHistory((prev) => [...prev, ...nextLines]);
  };

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runCommand(command);
    setCommand("");
  };

  return (
    <div
      className={`min-h-screen ${currentTheme.pageBackground} font-mono p-3 sm:p-6 transition-colors duration-200`}
    >
      <div
        className={`mx-auto w-full max-w-5xl h-[92vh] border ${currentTheme.containerBorder} rounded-md ${currentTheme.shellBackground} flex flex-col overflow-hidden transition-colors duration-200`}
        onClick={() => inputRef.current?.focus()}
      >
        <div
          className={`px-4 py-2 border-b ${currentTheme.headerBorder} ${currentTheme.headerBackground} text-zinc-200 text-xs sm:text-sm flex items-center justify-between gap-2`}
        >
          <div className="flex items-center gap-2 min-w-[92px]">
            {theme === "macos" && (
              <>
                <span className="h-3 w-3 rounded-full bg-red-500" />
                <span className="h-3 w-3 rounded-full bg-yellow-400" />
                <span className="h-3 w-3 rounded-full bg-green-500" />
              </>
            )}
            {theme === "ubuntu" && <span className="text-zinc-300">Ubuntu</span>}
            {theme === "powershell" && <span className="text-zinc-200">PowerShell</span>}
          </div>

          <div className="text-center text-zinc-100">{currentTheme.title}</div>

          <div className="flex items-center justify-end gap-2 min-w-[140px]">
            {theme === "powershell" && (
              <div className="text-zinc-300 tracking-wider select-none">[ - ] [ □ ] [ x ]</div>
            )}
            <button
              type="button"
              onClick={cycleTheme}
              className={`rounded border border-zinc-500/60 px-2 py-0.5 text-[11px] sm:text-xs text-zinc-100 hover:bg-zinc-200/15 ${
                currentTheme.switcherPosition === "left" ? "order-first" : ""
              }`}
            >
              {currentTheme.switcherLabel}
            </button>
          </div>
        </div>

        <div
          ref={scrollRef}
          className="terminal-scroll flex-1 overflow-y-auto px-4 py-3 text-xs sm:text-sm"
        >
          {history.map((line, index) => (
            <p
              key={`${line.kind}-${index}`}
              className={
                line.kind === "command"
                  ? `${currentTheme.promptColor}`
                  : line.kind === "error"
                    ? "text-red-400 mb-4"
                    : "text-zinc-200 mb-4"
              }
            >
              {line.text}
            </p>
          ))}

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span className={`${currentTheme.promptColor} shrink-0`}>{currentTheme.prompt}</span>
            <input
              ref={inputRef}
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              className="flex-1 bg-transparent outline-none border-none text-zinc-100 placeholder:text-zinc-400"
              autoComplete="off"
              spellCheck={false}
              aria-label="Comando do terminal"
            />
            <span className={`inline-block h-4 w-2 ${currentTheme.cursorColor} animate-pulse`} />
          </form>
        </div>
      </div>

      <style>{`
        .terminal-scroll {
          scrollbar-width: thin;
          scrollbar-color: rgba(90, 90, 90, 0.45) transparent;
        }

        .terminal-scroll::-webkit-scrollbar {
          width: 6px;
          height: 6px;
        }

        .terminal-scroll::-webkit-scrollbar-track {
          background: transparent;
        }

        .terminal-scroll::-webkit-scrollbar-thumb {
          background: rgba(70, 70, 70, 0.55);
          border-radius: 999px;
        }

        .terminal-scroll::-webkit-scrollbar-thumb:hover {
          background: rgba(110, 110, 110, 0.7);
        }
      `}</style>
    </div>
  );
}