import api from "./api";

const normalizeAuthPayload = (response) => {
  const rootData = response?.data ?? {};
  const nestedData = rootData?.data ?? {};

  const token = nestedData?.token ?? rootData?.token;
  const user = nestedData?.user ?? rootData?.user ?? null;

  if (!token) {
    throw new Error("Auth succeeded but token was not returned.");
  }

  return {
    token,
    user,
  };
};

export const loginUserRequest = async ({ email, password }) => {
  const response = await api.post("/users/login", { email, password });
  return normalizeAuthPayload(response);
};

export const signupUserRequest = async ({ firstName, lastName, email, password }) => {
  const response = await api.post("/users/register", {
    fullname: {
      firstname: firstName,
      lastname: lastName,
    },
    email,
    password,
  });

  return normalizeAuthPayload(response);
};
