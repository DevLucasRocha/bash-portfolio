/** Enumerar comandos aceitos pelo help e pela validação básica. */
export const AVAILABLE_COMMANDS = [
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
  "clear",
] as const;

export const LINKEDIN_URL = "https://www.linkedin.com/in/lucas-hssrs";

export const GITHUB_URL = "https://github.com/DevLucasRocha";

/** Nome do PDF servido pela pasta `public/` (servido como `/ arquivo`). */
export const CV_FILENAME = "Curriculo_Lucas_ATS.pdf";

/** Caminho público estável para o arquivo do currículo. */
export const CV_PUBLIC_HREF = `/${CV_FILENAME}`;

/** Centralizar o texto para os comandos `perfil` e `sobre`. */
export const ABOUT_TEXT =
  "Lucas Henrique Souza de Santana da Rocha Santos - Engenheiro de Software | Full Stack | DevOps | Cloud (AWS, Azure, OCI). Especializado em automatizar infraestruturas complexas (Ansible, Terraform, Python) e desenvolver sistemas escaláveis (Golang, React).";

export const EXPERIENCE_LINES = [
  "Projetos de Portfólio (Fevereiro/2026 - Presente): Criação do 'Fila Livre' (Go, React, MySQL via Aiven, Heurística Preditiva).",
  "Prefeitura de São Luís (Jun/2025 - Presente): Automação com Ansible/Terraform, SIEM Wazuh, scripts em Python/Bash pro GLPI e Proxmox VE.",
  "Subway Brasil: Suporte e automação de relatórios em Python.",
] as const;

export const SKILLS_TEXT =
  "Python, Golang, React.js, Bash, PowerShell, AWS, Azure, OCI, Docker, Ansible, Terraform, Proxmox, Wazuh, Zabbix.";

export const CERTS_TEXT =
  "AWS Certified Cloud Practitioner, AZ-900, Oracle OCI Multicloud/AI/GenAI.";
