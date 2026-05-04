# Bash Portfolio - Lucas Rocha

Portfólio interativo em formato de terminal (**Bash Portfolio**), projetado para comunicar competências técnicas de forma prática e memorável.

---

## A Proposta

O **Bash Portfolio** simula a experiência de um terminal real para apresentar trajetória, stack e especialidades em uma interface não convencional e imersiva.

O objetivo é demonstrar, na prática, domínio em **Engenharia de Software**, **Cloud Computing** (**AWS**, **Azure**, **OCI**) e cultura **DevOps**, unindo experiência de produto, identidade técnica e execução front-end moderna.

---

## Principais Funcionalidades

- 🖥️ **Multi-Theme Switcher** com alternância dinâmica entre ambientes visuais de terminal:
  - Ubuntu
  - macOS
  - PowerShell
- ⚙️ **Boot simulado** para reforçar a experiência de terminal desde a inicialização.
- 📜 **Histórico de saída** no painel, com comandos semânticos de currículo.
- ⌨️ **Memória de comandos (estilo Bash/Zsh)** — após enviar com Enter, use **↑ / ↓** no input para recuperar linhas anteriores.
- ✨ **Autocomplete com Tab** para acelerar interação e descoberta de comandos *(planejado / documentação)*.
- 🧠 **Comandos semânticos** (`perfil`, `experiencia`, `skills`, `certs`, `links`, `curriculo`, etc.).

---

## Estrutura do código

```text
src/
├── components/
│   └── terminal/
│       └── Terminal.tsx      # Shell da UI, prompt e memória de comandos (↑/↓)
├── routes/
│   ├── __root.tsx           # Shell HTML, meta (título da aba) e página 404
│   └── index.tsx            # Rota `/` e meta da página inicial
├── terminal/
│   ├── constants.ts         # Textos, URLs e comandos expostos no help
│   ├── run-terminal-command.tsx # Regras de negócio da CLI (por comando)
│   ├── theme.ts             # Tokens visuais por tema (Ubuntu / macOS / PS)
│   └── types.ts             # Tipos compartilhados do histórico
├── router.tsx
├── routeTree.gen.ts          # Gerado pelo TanStack Router (não editar)
└── styles.css                # Entrada Tailwind v4 (`@tailwindcss/vite`)

public/
└── Curriculo_Lucas_ATS.pdf   # Arquivo estático servido como `/Curriculo_Lucas_ATS.pdf`
```

> **Título da aba do navegador:** este projeto usa **TanStack Start** (HTML gerenciado pelo router). O título canônico **Bash Portfolio - Lucas Rocha** está em `src/routes/__root.tsx` e em `src/routes/index.tsx` — não há `index.html` estático na raiz.

> **Observação:** as dependências foram enxugadas no `package.json`. Após atualizar o repositório, rode `npm install` para atualizar também o `package-lock.json` na sua máquina.

---

## Stack Tecnológica

- **React.js**
- **Vite**
- **Tailwind CSS**
- **TypeScript / JavaScript**

---

## Rodando Localmente

### 1) Clonar o repositório

```bash
git clone <url-do-repositorio>
cd bash-portfolio
```

*(Se a pasta local ainda se chamar `terminal-portfolio`, use esse nome no `cd`.)*

### 2) Instalar dependências

```bash
npm install
```

### 3) Iniciar ambiente de desenvolvimento

```bash
npm run dev
```

### 4) Acessar no navegador

Abra a URL exibida no terminal (normalmente `http://localhost:5173`).

---

## Build de Produção (Opcional)

```bash
npm run build
npm run preview
```

---

## Observações

- O **Bash Portfolio** prioriza legibilidade, manutenção e expansão incremental das interações de terminal.
- A arquitetura atual facilita adicionar novos comandos, temas e fluxos de UX sem acoplamento excessivo.

## 🌐 Contato

📧 [lucas_santos239@outlook.com](mailto:lucas_santos239@outlook.com)  
🔗 [LinkedIn](https://www.linkedin.com/in/lucas-hssrs/)
