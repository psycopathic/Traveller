import api from "./api";

export const loginUserRequest = async ({ email, password }) => {
  const response = await api.post("/users/login", { email, password });
  const rootData = response?.data ?? {};
  const nestedData = rootData?.data ?? {};

  const token = nestedData?.token ?? rootData?.token;
  const user = nestedData?.user ?? rootData?.user ?? null;

  if (!token) {
    throw new Error("Login succeeded but token was not returned.");
  }

  return {
    token,
    user,
  };
};
