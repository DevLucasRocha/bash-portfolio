import * as React from "react";

// Definir o breakpoint que separa experiência mobile de desktop.
const MOBILE_BREAKPOINT = 768;

export function useIsMobile() {
  // Inicializar o estado responsivo com valor indefinido até a primeira medição.
  const [isMobile, setIsMobile] = React.useState<boolean | undefined>(undefined);

  // Escutar mudanças de viewport para manter o estado mobile sincronizado com a janela.
  React.useEffect(() => {
    const mql = window.matchMedia(`(max-width: ${MOBILE_BREAKPOINT - 1}px)`);
    // Atualizar o estado sempre que a largura ultrapassar o limite definido.
    const onChange = () => {
      setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    };
    mql.addEventListener("change", onChange);
    setIsMobile(window.innerWidth < MOBILE_BREAKPOINT);
    return () => mql.removeEventListener("change", onChange);
  }, []);

  // Retornar sempre um booleano para simplificar consumo nos componentes.
  return !!isMobile;
}
