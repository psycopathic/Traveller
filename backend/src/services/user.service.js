import User from "../models/user.model.js";

export const createUser = async (fullname, email, password) => {
  const user = await User.create({
    fullname: {
      firstName: fullname.firstName,
      lastName: fullname.lastName,
    },
    email,
    password,
  });

  return user;
};  

