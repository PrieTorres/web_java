import { createContext, ReactNode, useMemo, useState } from "react";

type PageContextProps = object;

export const PageContext = createContext<PageContextProps>({});

export const PageProvider = ({ children }: { children: ReactNode; }) => {
  const [pageState, setPageState] = useState<PageContextProps>({});

  const contextValue = useMemo(() => (
    { ...pageState }
  ), [pageState]);

  return (
    <PageContext.Provider value={contextValue}>
      {children}
    </PageContext.Provider>
  );
};