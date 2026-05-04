import {
  ABOUT_TEXT,
  AVAILABLE_COMMANDS,
  CERTS_TEXT,
  CV_FILENAME,
  CV_PUBLIC_HREF,
  EXPERIENCE_LINES,
  GITHUB_URL,
  LINKEDIN_URL,
  SKILLS_TEXT,
} from "./constants";
import type { HistoryLine } from "./types";

export type CommandRunContext = {
  prompt: string;
  linkColor: string;
};

// Acrescentar linhas de histórico após executar um comando já normalizado.
export function runTerminalCommand(normalized: string, ctx: CommandRunContext): HistoryLine[] {
  const nextLines: HistoryLine[] = [{ kind: "command", text: `${ctx.prompt} ${normalized}` }];

  // Renderizar um link externo com destaque alinhado ao tema ativo.
  const renderExternalLink = (label: string, href: string) => (
    <a href={href} target="_blank" rel="noreferrer" className={`${ctx.linkColor} hover:underline`}>
      {label}
    </a>
  );

  // Renderizar o link de download do currículo com atributos explícitos para o navegador.
  const renderCvDownloadLink = () => (
    <a
      href={CV_PUBLIC_HREF}
      download={CV_FILENAME}
      target="_blank"
      rel="noreferrer"
      className="text-blue-400 hover:underline"
    >
      [ Download CV ]
    </a>
  );

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
            LinkedIn: {renderExternalLink(LINKEDIN_URL, LINKEDIN_URL)}
          </>
        ),
      });
      nextLines.push({
        kind: "output",
        text: (
          <>
            GitHub: {renderExternalLink(GITHUB_URL, GITHUB_URL)}
          </>
        ),
      });
      break;
    case "curriculo":
      nextLines.push({
        kind: "output",
        text: (
          <>
            📄 Baixe meu currículo clicando aqui: {renderCvDownloadLink()}
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

  return nextLines;
}
