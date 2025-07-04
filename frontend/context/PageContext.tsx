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
  token?: string;
  handleLogin: (email: string, password: string) => Promise<void>;
  handleSignUp: (name: string, email: string, password: string) => Promise<void>;
  updateSessionId?: (id: string) => void;
  updateUser?: (user: User | null) => void;
  updateToken?: (token: string) => void;
};

export const PageContext = createContext<PageContextProps>({
  user: null,
  token: undefined,
  handleLogin: async () => {},
  handleSignUp: async () => {},
  updateSessionId: undefined,
  updateUser: undefined,
  updateToken: undefined,
});

export const PageProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [sessionId, setSessionId] = useState<string>("");
  const [token, setToken] = useState<string>("");

  useEffect(() => {
    if (typeof window === 'undefined') return;
    const storedToken = localStorage.getItem('token');
    const storedSession = localStorage.getItem('sessionId');
    if (storedToken) setToken(storedToken);
    if (storedSession) setSessionId(storedSession);
  }, []);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (token) {
      localStorage.setItem('token', token);
    } else {
      localStorage.removeItem('token');
    }
  }, [token]);

  useEffect(() => {
    if (typeof window === 'undefined') return;
    if (sessionId) {
      localStorage.setItem('sessionId', sessionId);
    } else {
      localStorage.removeItem('sessionId');
    }
  }, [sessionId]);

  const handleLogin = async (email: string, password: string) => {
    try {
      const res = await fetch("/api/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });

      if (!res.ok) throw new Error("Login failed");

      const data = await res.json();
      setSessionId(data.userId);
      setToken(data.token);
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
  const updateUser = (u: User | null) => setUser(u);
  const updateToken = (t: string) => setToken(t);

  const contextValue = useMemo(() => ({
    userId: sessionId,
    token,
    user,
    handleLogin,
    handleSignUp,
    updateSessionId,
    updateUser,
    updateToken
  }), [user, sessionId, token]);

  useEffect(() => {
    if (!token) return;
    fetchTk("/api/pets", {
      method: "GET",
      headers: { Authorization: token },
    });
  }, [token]);

  return (
    <PageContext.Provider value={contextValue}>
      {children}
    </PageContext.Provider>
  );
};
