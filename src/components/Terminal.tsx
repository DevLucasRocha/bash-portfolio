import { FormEvent, ReactNode, useEffect, useRef, useState } from "react";

// Definir o formato de cada linha exibida no histórico do terminal.
type HistoryLine = {
  kind: "command" | "output" | "error";
  text: ReactNode;
};

// Definir os temas visuais disponíveis para simular terminais reais.
type ThemeKey = "ubuntu" | "macos" | "powershell";

// Declarar os comandos aceitos para orientar o help e a validação da CLI.
const AVAILABLE_COMMANDS = [
  "help",
  "perfil",
  "sobre",
  "experiencia",
  "exp",
  "skills",
  "stack",
  "certs",
  "links",
  "curriculo",
  "cv",
  "clear",
];

// Centralizar o texto de apresentação profissional para reutilizar no comando whoami/sobre.
const ABOUT_TEXT =
  "Lucas Henrique Souza de Santana da Rocha Santos - Engenheiro de Software | Full Stack | DevOps | Cloud (AWS, Azure, OCI). Especializado em automatizar infraestruturas complexas (Ansible, Terraform, Python) e desenvolver sistemas escaláveis (Golang, React).";

// Estruturar os itens de experiência para renderizar respostas em múltiplas linhas.
const EXPERIENCE_LINES = [
  "Projetos de Portfólio (Fevereiro/2026 - Presente): Criação do 'Fila Livre' (Go, React, MySQL via Aiven, Heurística Preditiva).",
  "Prefeitura de São Luís (Jun/2025 - Presente): Automação com Ansible/Terraform, SIEM Wazuh, scripts em Python/Bash pro GLPI e Proxmox VE.",
  "Subway Brasil: Suporte e automação de relatórios em Python.",
];

// Consolidar as competências técnicas em um único retorno de comando.
const SKILLS_TEXT =
  "Python, Golang, React.js, Bash, PowerShell, AWS, Azure, OCI, Docker, Ansible, Terraform, Proxmox, Wazuh, Zabbix.";

// Consolidar as certificações para exibir no comando certs.
const CERTS_TEXT =
  "AWS Certified Cloud Practitioner, AZ-900, Oracle OCI Multicloud/AI/GenAI.";

// Definir a ordem de rotação do botão de alternância de tema.
const THEME_ORDER: ThemeKey[] = ["ubuntu", "macos", "powershell"];

// Mapear as propriedades visuais e comportamentais específicas de cada tema.
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
    linkColor: string;
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

export default function Terminal() {
  // Inicializar o estado do tema com Ubuntu como padrão da aplicação.
  const [theme, setTheme] = useState<ThemeKey>("ubuntu");
  // Inicializar o histórico com uma mensagem de orientação para o primeiro acesso.
  const [history, setHistory] = useState<HistoryLine[]>([
    { kind: "output", text: "Terminal Portfolio carregado. Digite 'help' para ver os comandos." },
  ]);
  // Controlar o valor digitado no prompt atual.
  const [command, setCommand] = useState("");
  // Referenciar a área rolável para manter o foco na última saída.
  const scrollRef = useRef<HTMLDivElement>(null);
  // Referenciar o input para manter interação contínua sem cliques extras.
  const inputRef = useRef<HTMLInputElement>(null);
  // Resolver o objeto de tema ativo para simplificar o uso no JSX.
  const currentTheme = THEME_CONFIG[theme];

  // Sincronizar a rolagem automática sempre que o histórico receber novas linhas.
  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history]);

  // Garantir o foco inicial no input ao montar o componente.
  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  // Alternar ciclicamente entre Ubuntu, macOS e PowerShell no cabeçalho.
  const cycleTheme = () => {
    setTheme((previous) => {
      const nextIndex = (THEME_ORDER.indexOf(previous) + 1) % THEME_ORDER.length;
      return THEME_ORDER[nextIndex];
    });
    inputRef.current?.focus();
  };

  // Interpretar o comando digitado e transformar em saídas de histórico.
  const runCommand = (rawCommand: string) => {
    // Normalizar a entrada para simplificar comparação de aliases e comandos.
    const normalized = rawCommand.trim().toLowerCase();

    // Registrar uma linha de prompt vazia quando o usuário apenas pressionar Enter.
    if (!normalized) {
      setHistory((prev) => [...prev, { kind: "command", text: `${currentTheme.prompt} ` }]);
      return;
    }

    // Limpar o histórico completamente quando receber o comando clear.
    if (normalized === "clear") {
      setHistory([]);
      return;
    }

    // Registrar o comando executado antes de anexar a resposta correspondente.
    const nextLines: HistoryLine[] = [{ kind: "command", text: `${currentTheme.prompt} ${normalized}` }];

    // Renderizar um link externo com comportamento consistente entre os temas.
    const renderExternalLink = (label: string, href: string) => (
      <a
        href={href}
        target="_blank"
        rel="noreferrer"
        className={`${currentTheme.linkColor} hover:underline`}
      >
        {label}
      </a>
    );

    // Direcionar a resposta conforme o comando informado pelo usuário.
    switch (normalized) {
      case "help":
        nextLines.push({
          kind: "output",
          text: `Comandos: ${AVAILABLE_COMMANDS.join(", ")}`,
        });
        break;
      case "perfil":
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
      case "links":
        nextLines.push({
          kind: "output",
          text: (
            <>
              LinkedIn:{" "}
              {renderExternalLink("https://www.linkedin.com/in/lucas-hssrs", "https://www.linkedin.com/in/lucas-hssrs")}
            </>
          ),
        });
        nextLines.push({
          kind: "output",
          text: (
            <>
              GitHub: {renderExternalLink("https://github.com/DevLucasRocha", "https://github.com/DevLucasRocha")}
            </>
          ),
        });
        break;
      case "curriculo":
      case "cv":
        nextLines.push({
          kind: "output",
          text: (
            <>
              📄 Baixe meu currículo clicando aqui:{" "}
              <a href="/cv-lucas.pdf" download className={`${currentTheme.linkColor} hover:underline`}>
                [ Download CV ]
              </a>
            </>
          ),
        });
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

  // Interceptar o submit do formulário para executar comandos sem recarregar a página.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    runCommand(command);
    setCommand("");
  };

  return (
    // Renderizar a área externa do terminal com transição de cores por tema.
    <div
      className={`min-h-screen ${currentTheme.pageBackground} font-mono p-3 sm:p-6 transition-colors duration-200`}
    >
      <div
        // Renderizar o contêiner principal e recuperar foco ao clicar em qualquer área.
        className={`mx-auto w-full max-w-5xl h-[92vh] border ${currentTheme.containerBorder} rounded-md ${currentTheme.shellBackground} flex flex-col overflow-hidden transition-colors duration-200`}
        onClick={() => inputRef.current?.focus()}
      >
        <div
          // Renderizar o cabeçalho dinâmico com controles e botão de troca de tema.
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
          {/* Renderizar cada linha do histórico com cor e espaçamento apropriados por tipo. */}
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
            {/* Exibir o prompt ativo, capturar o texto e manter cursor piscante no final. */}
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
        /* Estilizar a barra de rolagem para preservar a imersão visual do terminal. */
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