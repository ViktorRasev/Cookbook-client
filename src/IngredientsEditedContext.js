import { createContext, useState } from "react";

const IngredientsEditedContext = createContext({})

export const IngredientsEditedProvider = ({ children }) => {
    const [ingredientsEdited, setIngredientsEdited] = useState(false)

    return <IngredientsEditedContext.Provider value={{ingredientsEdited, setIngredientsEdited}}> { children }</IngredientsEditedContext.Provider>
}
export default IngredientsEditedContext