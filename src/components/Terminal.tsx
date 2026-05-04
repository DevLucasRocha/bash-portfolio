import { useState, useRef, useEffect } from "react";
import Typewriter from "typewriter-effect";

type Line = {
  type: "command" | "output" | "prompt" | "comment" | "error" | "success" | "progress" | "link";
  text: string;
  id?: string;
  href?: string;
};

const STACK = [
  "AWS", "Azure", "OCI", "Linux", "Docker",
  "Terraform", "Ansible", "Python", "Golang", "React",
];

const PROJECT = {
  name: "Fila Livre",
  desc: "Monitoramento de filas em tempo real com Heurística Preditiva.",
  stack: "Go, React, MySQL, Multi-cloud",
};

const CONTACTS = [
  { label: "Email   ", value: "lucas@exemplo.com", href: "mailto:lucas@exemplo.com" },
  { label: "LinkedIn", value: "linkedin.com/in/lucas", href: "https://linkedin.com/in/lucas" },
  { label: "GitHub  ", value: "github.com/lucas", href: "https://github.com/lucas" },
];

export default function Terminal() {
  const [bootDone, setBootDone] = useState(false);
  const [history, setHistory] = useState<Line[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [history, bootDone]);

  const appendLines = (lines: Line[]) =>
    setHistory((h) => [...h, ...lines]);

  const updateLine = (id: string, patch: Partial<Line>) =>
    setHistory((h) => h.map((l) => (l.id === id ? { ...l, ...patch } : l)));

  const renderProgressBar = (pct: number) => {
    const width = 24;
    const filled = Math.round((pct / 100) * width);
    return `[${"█".repeat(filled)}${"░".repeat(width - filled)}] ${pct
      .toString()
      .padStart(3)}%`;
  };

  const downloadCV = async () => {
    const progressId = `dl-${Date.now()}`;
    appendLines([
      { type: "comment", text: "# Conectando ao servidor..." },
      { type: "output", text: "  → GET /cv-lucas.pdf" },
      { type: "progress", id: progressId, text: renderProgressBar(0) + " baixando..." },
    ]);

    try {
      const res = await fetch("/cv-lucas.pdf");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);

      const total = Number(res.headers.get("content-length")) || 0;
      const reader = res.body?.getReader();
      if (!reader) throw new Error("stream indisponível");

      const chunks: Uint8Array[] = [];
      let received = 0;
      let lastPct = -1;

      while (true) {
        const { done, value } = await reader.read();
        if (done) break;
        chunks.push(value);
        received += value.length;
        const pct = total
          ? Math.min(100, Math.round((received / total) * 100))
          : Math.min(99, lastPct + 5);
        if (pct !== lastPct) {
          lastPct = pct;
          updateLine(progressId, {
            text: renderProgressBar(pct) + ` ${(received / 1024).toFixed(1)} KB`,
          });
          // yield to React so the bar repaints
          await new Promise((r) => setTimeout(r, 30));
        }
      }

      updateLine(progressId, { text: renderProgressBar(100) + " concluído" });

      const blob = new Blob(chunks as BlobPart[], { type: "application/pdf" });
      const url = URL.createObjectURL(blob);
      const a = document.createElement("a");
      a.href = url;
      a.download = "cv-lucas.pdf";
      document.body.appendChild(a);
      a.click();
      a.remove();
      URL.revokeObjectURL(url);

      appendLines([
        {
          type: "success",
          text: `  ✔ Download concluído: cv-lucas.pdf (${(received / 1024).toFixed(1)} KB)`,
        },
      ]);
    } catch (err) {
      updateLine(progressId, { text: renderProgressBar(0) + " falhou" });
      const msg = err instanceof Error ? err.message : "erro desconhecido";
      appendLines([
        { type: "error", text: `  ✘ Erro ao baixar CV: ${msg}` },
        { type: "comment", text: "# Verifique sua conexão e tente novamente." },
      ]);
    }
  };

  const runCommand = (cmd: string) => {
    const newLines: Line[] = [
      { type: "command", text: `lucas@portfolio:~$ ${cmd}` },
    ];

    if (cmd === "./ver-stack.sh") {
      newLines.push({ type: "comment", text: "# Carregando stack técnica..." });
      STACK.forEach((s) => newLines.push({ type: "output", text: `  ✔ ${s}` }));
    } else if (cmd === "./ver-projetos.sh") {
      newLines.push({ type: "comment", text: "# Listando projetos..." });
      newLines.push({ type: "output", text: `  ➜ ${PROJECT.name}` });
      newLines.push({ type: "output", text: `    ${PROJECT.desc}` });
      newLines.push({ type: "output", text: `    Stack: ${PROJECT.stack}` });
    } else if (cmd === "./limpar-tela") {
      setHistory([]);
      return;
    } else if (cmd === "./baixar-cv.sh") {
      setHistory((h) => [...h, ...newLines]);
      void downloadCV();
      return;
    } else if (cmd === "./contatar.sh") {
      newLines.push({ type: "comment", text: "# Abrindo canais de contato..." });
      CONTACTS.forEach((c) =>
        newLines.push({
          type: "link",
          text: `  ➜ ${c.label}  ${c.value}`,
          href: c.href,
        }),
      );
      newLines.push({ type: "success", text: "  ✔ 3 contatos disponíveis. Clique para abrir." });
    }

    setHistory((h) => [...h, ...newLines]);
  };

  return (
    <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4 font-mono">
      <div className="w-full max-w-3xl rounded-lg overflow-hidden shadow-2xl border border-gray-700 bg-black">
        {/* Title bar */}
        <div className="flex items-center gap-2 px-4 py-2 bg-gray-800 border-b border-gray-700">
          <span className="w-3 h-3 rounded-full bg-red-500" />
          <span className="w-3 h-3 rounded-full bg-yellow-500" />
          <span className="w-3 h-3 rounded-full bg-green-500" />
          <span className="ml-3 text-xs text-gray-400">lucas@portfolio: ~</span>
        </div>

        {/* Body */}
        <div
          ref={scrollRef}
          className="p-5 h-[70vh] overflow-y-auto text-sm leading-relaxed text-green-400"
        >
          {!bootDone ? (
            <Typewriter
              onInit={(tw) => {
                tw
                  .changeDelay(35)
                  .typeString('<span class="text-blue-400">lucas@portfolio</span>:<span class="text-white">~</span>$ iniciando sistema... ')
                  .pauseFor(400)
                  .typeString('<span class="text-green-300">OK</span>')
                  .pauseFor(300)
                  .typeString("<br/>&gt; ")
                  .typeString('<span class="text-white">Engenheiro de Software & Analista de Infraestrutura.</span>')
                  .typeString("<br/>&gt; ")
                  .typeString('<span class="text-white">Foco em </span><span class="text-blue-300">Cloud, Automação e Go/React</span><span class="text-white">.</span>')
                  .pauseFor(400)
                  .callFunction(() => setBootDone(true))
                  .start();
              }}
              options={{ cursor: "▋", delay: 30 }}
            />
          ) : (
            <>
              <p>
                <span className="text-blue-400">lucas@portfolio</span>
                <span className="text-white">:~$</span> iniciando sistema...{" "}
                <span className="text-green-300">OK</span>
              </p>
              <p>
                &gt;{" "}
                <span className="text-white">
                  Engenheiro de Software & Analista de Infraestrutura.
                </span>
              </p>
              <p>
                &gt; <span className="text-white">Foco em </span>
                <span className="text-blue-300">Cloud, Automação e Go/React</span>
                <span className="text-white">.</span>
              </p>
            </>
          )}

          {/* Command history */}
          {history.map((line, i) => {
            if (line.type === "command")
              return (
                <p key={i} className="mt-2">
                  <span className="text-blue-400">{line.text.split(" ")[0]}</span>
                  <span className="text-white">{line.text.slice(line.text.indexOf(":"))}</span>
                </p>
              );
            if (line.type === "comment")
              return <p key={i} className="text-gray-500">{line.text}</p>;
            if (line.type === "error")
              return <p key={i} className="text-red-400">{line.text}</p>;
            if (line.type === "success")
              return <p key={i} className="text-green-300">{line.text}</p>;
            if (line.type === "progress")
              return <p key={i} className="text-blue-300 whitespace-pre">{line.text}</p>;
            if (line.type === "link")
              return (
                <p key={i} className="whitespace-pre">
                  <a
                    href={line.href}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-300 hover:text-green-300 underline underline-offset-2"
                  >
                    {line.text}
                  </a>
                </p>
              );
            return <p key={i} className="text-green-400">{line.text}</p>;
          })}

          {/* Menu */}
          {bootDone && (
            <div className="mt-6 space-y-2">
              <p className="text-gray-500"># Comandos disponíveis:</p>
              <div className="flex flex-wrap gap-3">
                {["./ver-stack.sh", "./ver-projetos.sh", "./baixar-cv.sh", "./contatar.sh", "./limpar-tela"].map((cmd) => (
                  <button
                    key={cmd}
                    onClick={() => runCommand(cmd)}
                    className="text-green-400 hover:text-black hover:bg-green-400 transition-colors px-2 py-0.5 border border-green-400/40 rounded"
                  >
                    [ {cmd} ]
                  </button>
                ))}
              </div>
              <p className="mt-4">
                <span className="text-blue-400">lucas@portfolio</span>
                <span className="text-white">:~$</span>{" "}
                <span className="inline-block w-2 h-4 bg-green-400 animate-pulse align-middle" />
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}