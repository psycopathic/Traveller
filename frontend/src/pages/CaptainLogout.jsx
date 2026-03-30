import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { clearStoredAuthTokens } from "../services/tokenStorage";

const CaptainLogout = () => {
  const navigate = useNavigate();

  useEffect(() => {
    let isMounted = true;

    const logout = async () => {
      try {
        await api.get("/captains/logout");
      } catch {
        // Always clear local tokens even if backend logout fails.
      } finally {
        clearStoredAuthTokens();
        if (isMounted) {
          navigate("/captain-login", { replace: true });
        }
      }
    };

    logout();

    return () => {
      isMounted = false;
    };
  }, [navigate]);

  return (
    <div className="flex min-h-screen items-center justify-center bg-slate-100 p-6">
      <div className="rounded-xl border border-slate-200 bg-white px-5 py-4 text-sm text-slate-700 shadow-sm sm:text-base">
        Logging captain out...
      </div>
    </div>
  );
};

export default CaptainLogout;
