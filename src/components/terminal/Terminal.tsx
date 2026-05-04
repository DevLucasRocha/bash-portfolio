import { FormEvent, KeyboardEvent, useEffect, useRef, useState } from "react";

import type { HistoryLine, ThemeKey } from "@/terminal/types";
import { runTerminalCommand } from "@/terminal/run-terminal-command";
import { THEME_CONFIG, THEME_ORDER } from "@/terminal/theme";

// Encapsular toda a experiência interativa do portfólio em formato CLI.
export default function Terminal() {
  // Inicializar o estado do tema com Ubuntu como padrão da aplicação.
  const [theme, setTheme] = useState<ThemeKey>("ubuntu");
  // Inicializar o histórico com uma mensagem de orientação para o primeiro acesso.
  const [history, setHistory] = useState<HistoryLine[]>([
    {
      kind: "output",
      text: "Bash Portfolio carregado. Digite 'help' para ver os comandos.",
    },
  ]);
  // Controlar o valor digitado no prompt atual.
  const [command, setCommand] = useState("");
  // Armazenar apenas comandos enviados com Enter (texto após trim) para navegação estilo shell.
  const [commandHistory, setCommandHistory] = useState<string[]>([]);
  // Rastrear qual entrada do commandHistory está sendo exibida no input (-1 = linha nova / presente).
  const [historyIndex, setHistoryIndex] = useState(-1);
  // Preservar a linha em edição antes de subir no histórico, para restaurar ao descer com seta.
  const pendingDraftRef = useRef("");
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

    const nextLines = runTerminalCommand(normalized, {
      prompt: currentTheme.prompt,
      linkColor: currentTheme.linkColor,
    });

    setHistory((prev) => [...prev, ...nextLines]);
  };

  // Navegar pelo histórico de comandos com setas, imitando Bash/Zsh.
  const handleInputKeyDown = (event: KeyboardEvent<HTMLInputElement>) => {
    if (event.key === "ArrowUp") {
      if (commandHistory.length === 0) return;
      event.preventDefault();
      if (historyIndex === -1) {
        pendingDraftRef.current = command;
        const nextIndex = commandHistory.length - 1;
        setHistoryIndex(nextIndex);
        setCommand(commandHistory[nextIndex]);
        return;
      }
      const nextIndex = Math.max(0, historyIndex - 1);
      setHistoryIndex(nextIndex);
      setCommand(commandHistory[nextIndex]);
      return;
    }

    if (event.key === "ArrowDown") {
      if (historyIndex === -1) return;
      event.preventDefault();
      if (historyIndex < commandHistory.length - 1) {
        const nextIndex = historyIndex + 1;
        setHistoryIndex(nextIndex);
        setCommand(commandHistory[nextIndex]);
        return;
      }
      setHistoryIndex(-1);
      setCommand(pendingDraftRef.current);
      pendingDraftRef.current = "";
    }
  };

  // Interceptar o submit do formulário para executar comandos sem recarregar a página.
  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const trimmed = command.trim();
    runCommand(command);
    setCommand("");
    setHistoryIndex(-1);
    pendingDraftRef.current = "";
    if (trimmed) {
      setCommandHistory((previous) => [...previous, trimmed]);
    }
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

        <div ref={scrollRef} className="terminal-scroll flex-1 overflow-y-auto px-4 py-3 text-xs sm:text-sm">
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
              onChange={(event) => {
                const next = event.target.value;
                setCommand(next);
                if (historyIndex !== -1) {
                  setHistoryIndex(-1);
                  pendingDraftRef.current = next;
                }
              }}
              onKeyDown={handleInputKeyDown}
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
