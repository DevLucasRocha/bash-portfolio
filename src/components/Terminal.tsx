import { FormEvent, useEffect, useRef, useState } from "react";

type HistoryLine = {
  kind: "command" | "output" | "error";
  text: string;
};

const PROMPT = "lucas@portfolio:~$";
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

export default function Terminal() {
  const [history, setHistory] = useState<HistoryLine[]>([
    { kind: "output", text: "Terminal Portfolio carregado. Digite 'help' para ver os comandos." },
  ]);
  const [command, setCommand] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [history]);

  useEffect(() => {
    inputRef.current?.focus();
  }, []);

  const runCommand = (rawCommand: string) => {
    const normalized = rawCommand.trim().toLowerCase();

    if (!normalized) {
      setHistory((prev) => [...prev, { kind: "command", text: `${PROMPT} ` }]);
      return;
    }

    if (normalized === "clear") {
      setHistory([]);
      return;
    }

    const nextLines: HistoryLine[] = [{ kind: "command", text: `${PROMPT} ${normalized}` }];

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
    <div className="min-h-screen bg-zinc-950 text-green-500 font-mono p-3 sm:p-6">
      <div
        className="mx-auto w-full max-w-5xl h-[92vh] border border-zinc-800 rounded-md bg-zinc-950 flex flex-col"
        onClick={() => inputRef.current?.focus()}
      >
        <div className="px-4 py-2 border-b border-zinc-800 text-zinc-300 text-xs sm:text-sm">
          {PROMPT}
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto px-4 py-3 space-y-2 text-xs sm:text-sm">
          {history.map((line, index) => (
            <p
              key={`${line.kind}-${index}`}
              className={line.kind === "error" ? "text-zinc-300" : "text-green-500"}
            >
              {line.text}
            </p>
          ))}

          <form onSubmit={handleSubmit} className="flex items-center gap-2">
            <span className="text-zinc-300 shrink-0">{PROMPT}</span>
            <input
              ref={inputRef}
              value={command}
              onChange={(event) => setCommand(event.target.value)}
              className="flex-1 bg-transparent outline-none border-none text-green-500 placeholder:text-zinc-500"
              autoComplete="off"
              spellCheck={false}
              aria-label="Comando do terminal"
            />
            <span className="inline-block h-4 w-2 bg-green-500 animate-pulse" />
          </form>
        </div>
      </div>
    </div>
  );
}