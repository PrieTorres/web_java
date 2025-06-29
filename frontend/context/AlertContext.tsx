import { createContext, useCallback, useContext, useState, ReactNode } from "react";
import ClientPortal from "@/components/Portal";
import { AlertMessage } from "@/components/AlertMessage";

export type AlertType = "success" | "error" | "info";

type Alert = { message: string; type?: AlertType } | null;

interface AlertContextProps {
  showAlert: (message: string, type?: AlertType) => void;
}

const AlertContext = createContext<AlertContextProps>({
  // eslint-disable-next-line @typescript-eslint/no-empty-function
  showAlert: () => {},
});

export const useAlert = () => useContext(AlertContext);

export const AlertProvider = ({ children }: { children: ReactNode }) => {
  const [alert, setAlert] = useState<Alert>(null);

  const showAlert = useCallback((message: string, type: AlertType = "error") => {
    setAlert({ message, type });
    setTimeout(() => setAlert(null), 4000);
  }, []);

  return (
    <AlertContext.Provider value={{ showAlert }}>
      {children}
      <ClientPortal>
        {alert && <AlertMessage message={alert.message} type={alert.type} />}
      </ClientPortal>
    </AlertContext.Provider>
  );
};
