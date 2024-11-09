import React, { createContext, useContext } from "react";

const UserContext = createContext();

export const useUserContext = () => useContext(UserContext);

const UserProvider = ({ children, userData }) => {
  return <UserContext.Provider value={userData}>{children}</UserContext.Provider>;
};

export default UserProvider;