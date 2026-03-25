import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { clearStoredAuthTokens, getStoredAuthToken } from "../services/tokenStorage";

const UserProtectWrapper = ({ children }) => {
  const token = getStoredAuthToken();
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    if (!token) {
      navigate("/login", { replace: true });
      return;
    }

    api
      .get("/users/profile", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((response) => {
        if (!isMounted) {
          return;
        }

        if (response.status === 200) {
          setIsLoading(false);
          return;
        }

        throw new Error("Unauthorized");
      })
      .catch(() => {
        if (!isMounted) {
          return;
        }

        clearStoredAuthTokens();
        navigate("/login", { replace: true });
      });

    return () => {
      isMounted = false;
    };
  }, [navigate, token]);

  if (isLoading) {
    return <div>Loading...</div>;
  }

  return <>{children}</>;
};

export default UserProtectWrapper;
