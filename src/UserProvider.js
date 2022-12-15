import { createContext, useState } from "react";

const UserContext = createContext();

export function UserProvider({ children }) {
  const [isAuthorized, setIsAuthorized] = useState(true);

  return <UserContext.Provider value={{ isAuthorized, setIsAuthorized }}>{children}</UserContext.Provider>;
}

export default UserContext;
