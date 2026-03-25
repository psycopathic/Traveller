import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api, { getApiErrorMessage } from "../services/api";
import { setStoredAuthTokens } from "../services/tokenStorage";

const CaptainSignup = () => {
  const navigate = useNavigate();

  const [firstName, setFirstName] = useState("");
  const [lastName, setLastName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [vehicleColor, setVehicleColor] = useState("");
  const [vehiclePlate, setVehiclePlate] = useState("");
  const [vehicleCapacity, setVehicleCapacity] = useState("");
  const [vehicleType, setVehicleType] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const submitHandler = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);

    try {
      const response = await api.post("/captains/register", {
        fullname: {
          firstname: firstName,
          lastname: lastName,
        },
        email,
        password,
        vehicle: {
          color: vehicleColor,
          plate: vehiclePlate,
          capacity: Number(vehicleCapacity),
          vehicleType,
        },
      });

      const payload = response?.data?.data ?? response?.data ?? {};
      const token = payload?.token;

      if (!token) {
        throw new Error("Captain signup succeeded but token was not returned.");
      }

      setStoredAuthTokens({ token });

      setFirstName("");
      setLastName("");
      setEmail("");
      setPassword("");
      setVehicleColor("");
      setVehiclePlate("");
      setVehicleCapacity("");
      setVehicleType("");

      navigate("/captain-login");
    } catch (signupError) {
      setError(getApiErrorMessage(signupError));
    } finally {
      setLoading(false);
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
          <h2 className="text-2xl sm:text-3xl font-bold mb-2 text-slate-800">Captain Signup</h2>

          <h3 className="text-base sm:text-lg font-semibold mb-2 text-slate-800">What's your name</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <input
              required
              className="bg-slate-100 rounded-lg px-4 py-2.5 border border-slate-300 w-full text-base sm:text-lg placeholder:text-sm sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-slate-500"
              type="text"
              placeholder="First name"
              value={firstName}
              onChange={(e) => setFirstName(e.target.value)}
            />
            <input
              required
              className="bg-slate-100 rounded-lg px-4 py-2.5 border border-slate-300 w-full text-base sm:text-lg placeholder:text-sm sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-slate-500"
              type="text"
              placeholder="Last name"
              value={lastName}
              onChange={(e) => setLastName(e.target.value)}
            />
          </div>

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
            className="bg-slate-100 mb-6 rounded-lg px-4 py-2.5 border border-slate-300 w-full text-base sm:text-lg placeholder:text-sm sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-slate-500"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            type="password"
            placeholder="password"
          />

          <h3 className="text-base sm:text-lg font-semibold mb-2 text-slate-800">Vehicle Information</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
            <input
              required
              className="bg-slate-100 rounded-lg px-4 py-2.5 border border-slate-300 w-full text-base sm:text-lg placeholder:text-sm sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-slate-500"
              type="text"
              placeholder="Vehicle Color"
              value={vehicleColor}
              onChange={(e) => setVehicleColor(e.target.value)}
            />
            <input
              required
              className="bg-slate-100 rounded-lg px-4 py-2.5 border border-slate-300 w-full text-base sm:text-lg placeholder:text-sm sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-slate-500"
              type="text"
              placeholder="Vehicle Plate"
              value={vehiclePlate}
              onChange={(e) => setVehiclePlate(e.target.value)}
            />
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
            <input
              required
              min="1"
              className="bg-slate-100 rounded-lg px-4 py-2.5 border border-slate-300 w-full text-base sm:text-lg placeholder:text-sm sm:placeholder:text-base focus:outline-none focus:ring-2 focus:ring-slate-500"
              type="number"
              placeholder="Vehicle Capacity"
              value={vehicleCapacity}
              onChange={(e) => setVehicleCapacity(e.target.value)}
            />
            <select
              required
              className="bg-slate-100 rounded-lg px-4 py-2.5 border border-slate-300 w-full text-base sm:text-lg focus:outline-none focus:ring-2 focus:ring-slate-500"
              value={vehicleType}
              onChange={(e) => setVehicleType(e.target.value)}
            >
              <option value="" disabled>
                Select Vehicle Type
              </option>
              <option value="car">Car</option>
              <option value="auto">Auto</option>
              <option value="motorcycle">Moto</option>
            </select>
          </div>

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
            {loading ? "Creating account..." : "Create Captain Account"}
          </button>
        </form>

        <p className="text-center text-sm sm:text-base text-slate-700 mt-1">
          Already have an account?{" "}
          <Link to="/captain-login" className="text-blue-600 font-medium hover:underline">
            Login here
          </Link>
        </p>

        <div className="mt-5">
          <p className="text-[10px] leading-tight text-slate-600">
            This site is protected by reCAPTCHA and the <span className="underline">Google Privacy Policy</span> and{" "}
            <span className="underline">Terms of Service apply</span>.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CaptainSignup;
