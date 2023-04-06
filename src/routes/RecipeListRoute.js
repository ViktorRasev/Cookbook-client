import { useEffect, useState, useContext } from "react";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";
import Header from "../bricks/Header";
import RecipeEditedContext from "../RecipeEditedContext";
import { db } from "../utils/firebase"
import { collection, getDocs} from "firebase/firestore"

function RecipeListRoute() {
  const { recipeEdited } = useContext(RecipeEditedContext);
  const [recipeList, setRecipeList] = useState([])
  const [ingredientList, setIngredientList] = useState([])
  const [fetchRecipeState, setFetchRecipeState] = useState("loading")
  const [fetchIngState, setFetchIngState] = useState("loading")

  useEffect(() => {
    const getRecipesData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "recipes"))
        const docs = []
        querySnapshot.forEach((recipe) => {
          docs.push({...recipe.data()})
        })
        setRecipeList(docs)
        setFetchRecipeState("ready")
      } catch(error) {
        console.error(error)
        setFetchRecipeState("error")
      }
    }
    const getIngredientsData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ingredients"))
        const docs = []
        querySnapshot.forEach((ingredient) => {
          docs.push({...ingredient.data()})
        })
        setIngredientList(docs)
        setFetchIngState("ready")
      } catch(error){
        console.error(error)
        setFetchIngState("ready")
      }
    }
    getRecipesData()
    getIngredientsData()
  }, [recipeEdited])

  function getChild() {
    if (fetchRecipeState && fetchIngState === "loading") {
      return (
        <div>
          <Icon size={2} path={mdiLoading} spin={true} />
        </div>
      );
    } else if (fetchRecipeState && fetchIngState === "ready") {
      return (
        <>
          <Header recipeList={recipeList} allIngredients={ingredientList} />
        </>
      );
    } else if (fetchRecipeState && fetchIngState === "error") {
      return (
        <div>
          <div>Recepty se nepodařilo načíst!</div>
          <br />
          <pre>{JSON.stringify(recipeList.error, null, 2)}</pre>
        </div>
      );
    } else {
      return null;
    }
  }

  return <div>{getChild()}</div>;
}

export default RecipeListRoute;
