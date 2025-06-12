import { fetchTk } from "@/lib/helper";
import { createContext, ReactNode, useEffect, useMemo, useState } from "react";

type User = {
  email: string;
  name?: string;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  [key: string]: any;
};

type PageContextProps = {
  user: User | null;
  userId?: string;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleSignUp: (name: string, email: string, password: string) => Promise<void>;
  updateSessionId?: (id: string) => void;
  updateUser?: (user: User) => void;
};

export const PageContext = createContext<PageContextProps>({
  user: null,
  handleLogin: async () => {},
  handleSignUp: async () => {},
});

export const PageProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string>("");

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error("Login error:", err);
    }
  };

  const handleSignUp = async (name: string, email: string, password: string) => {
    try {
      const res = await fetch("/api/signup", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name, email, password }),
      });

      if (!res.ok) throw new Error("SignUp failed");

      const data = await res.json();
      setUser(data.user);
    } catch (err) {
      console.error("SignUp error:", err);
    }
  };

  const updateSessionId = (id: string) => setSessionId(id);
  const updateUser = (u: User) => setUser(u);

  const contextValue = useMemo(() => ({
    userId: sessionId,
    user,
    handleLogin,
    handleSignUp,
    updateSessionId,
    updateUser
  }), [user]);

  useEffect(() => {
    fetchTk("/api/pets", {
      method: "GET",
    });
  }, []);

  return (
    <PageContext.Provider value={contextValue}>
      {children}
    </PageContext.Provider>
  );
};
