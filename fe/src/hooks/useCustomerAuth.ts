import { useAuth } from "@/context/AuthContext";

export function useCustomerAuth() {
  const auth = useAuth();
  return {
    ...auth,
    isLoggedIn: !!auth.user,
    isAdmin: auth.user?.role === "admin",
  };
}
