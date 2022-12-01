import { createContext} from "react";

const UserContext = createContext();

export function UserProvider({ children }) {

     const value = {
         isAuthorized: true,
        }
        
    return (
        <UserContext.Provider
            value={value}
        >
            {children}
        </UserContext.Provider>
    )
}

export default UserContext;