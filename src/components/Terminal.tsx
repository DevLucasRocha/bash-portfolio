import { useState, useRef, useEffect } from "react";
import Typewriter from "typewriter-effect";

type Line = {
  type: "command" | "output" | "prompt" | "comment";
  text: string;
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

export default function Terminal() {
  const [bootDone, setBootDone] = useState(false);
  const [history, setHistory] = useState<Line[]>([]);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    scrollRef.current?.scrollTo({ top: scrollRef.current.scrollHeight });
  }, [history, bootDone]);

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
            return <p key={i} className="text-green-400">{line.text}</p>;
          })}

          {/* Menu */}
          {bootDone && (
            <div className="mt-6 space-y-2">
              <p className="text-gray-500"># Comandos disponíveis:</p>
              <div className="flex flex-wrap gap-3">
                {["./ver-stack.sh", "./ver-projetos.sh", "./limpar-tela"].map((cmd) => (
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