import React, { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { clearAuthError, loginUser } from "../slices/authSlice";

const UserLogin = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const { loading, error, isAuthenticated } = useSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated) {
      navigate("/home");
    }
  }, [isAuthenticated, navigate]);

  useEffect(() => {
    return () => {
      dispatch(clearAuthError());
    };
  }, [dispatch]);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await dispatch(loginUser({ email, password })).unwrap();
      setEmail("");
      setPassword("");
      navigate("/home");
    } catch {
      // Error text is handled from Redux state.
    }
  };

  return (
    <div className="relative min-h-screen bg-slate-100 px-4 py-6 sm:px-8 md:px-10 lg:px-14 flex items-center justify-center">
      <img
        className="absolute top-4 left-4 w-28 sm:top-6 sm:left-6 sm:w-32 md:top-8 md:left-8 md:w-36"
        src="/traveller.png"
        alt="Traveller logo"
      />

      <div className="w-full max-w-md rounded-2xl bg-white p-5 sm:p-7 md:p-8 shadow-xl border border-slate-200">
        <form onSubmit={submitHandler}>
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-800">Login</h2>
          <h3 className="text-base sm:text-lg font-semibold mb-2 text-slate-800">What's your email</h3>
          <input
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            className="bg-slate-100 mb-6 rounded-lg px-4 py-2.5 border border-slate-300 w-full text-base sm:text-lg placeholder:text-sm sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-slate-500"
            type="email"
            placeholder="email@example.com"
          />

          <h3 className="text-base sm:text-lg font-semibold mb-2 text-slate-800">Enter Password</h3>
          <input
            required
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="bg-slate-100 mb-6 rounded-lg px-4 py-2.5 border border-slate-300 w-full text-base sm:text-lg placeholder:text-sm sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-slate-500"
            type="password"
            placeholder="password"
          />

          {error && (
            <p className="mb-4 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 whitespace-pre-line leading-relaxed">
              {error}
            </p>
          )}

          <button
            type="submit"
            disabled={loading}
            className="bg-slate-900 text-white font-semibold mb-3 rounded-lg px-4 py-2.5 w-full text-base sm:text-lg cursor-pointer transition-colors hover:bg-slate-800 disabled:cursor-not-allowed disabled:bg-slate-500"
          >
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        <p className="text-center text-sm sm:text-base text-slate-700 mt-1">
          New here?{" "}
          <Link to="/signup" className="text-blue-600 font-medium hover:underline">
            Create new Account
          </Link>
        </p>

        <div className="mt-5">
          <Link
            to="/captain-login"
            className="bg-emerald-600 flex items-center justify-center text-white font-semibold rounded-lg px-4 py-2.5 w-full text-base sm:text-lg transition-colors hover:bg-emerald-500"
          >
            Sign in as Captain
          </Link>
        </div>
      </div>
    </div>
  );
};

export default UserLogin;
