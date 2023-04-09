import { createContext, useState } from "react";

const RecipeEditedContext = createContext({})

export const RecipeEditedProvider = ({ children }) => {
    const [recipeEdited, setRecipeEdited] = useState(false)

    return <RecipeEditedContext.Provider value={{recipeEdited, setRecipeEdited}}> { children }</RecipeEditedContext.Provider>
}
export default RecipeEditedContext