import AddNewIngredientModal from "../bricks/AddNewIngredientModal";
import { useState, useEffect, useContext } from "react";
import { db } from "../utils/firebase"
import { collection, getDocs } from "firebase/firestore";
import styles from "../css/Ingredients.module.css";
import IngredientsEditedContext from "../IngredientsEditedContext";
import DeleteIngredientModal from "../bricks/DeleteIngredientModal";
import Icon from "@mdi/react";
import { mdiDeleteForever } from "@mdi/js";
import 'react-toastify/dist/ReactToastify.css';
import UserContext from "../UserProvider";

function IngredientsList() {
  const { isAuthorized } = useContext(UserContext);
  const {ingredientsEdited} = useContext(IngredientsEditedContext)
  const [ingredientList, setIngredientList] = useState([]);
  const [recipeList, setRecipeList] = useState([])
  const [fetchIngState, setFetchIngState] = useState("loading")
  const [recipesUsingIngredient , setRecipesUsingIngredient ] = useState([])
  const [ingredientToRemoveId, setIngredientToRemoveId] = useState("")
  const [showDeleteIngredientModal, setShowDeleteIngredientModal] = useState(false)

  useEffect(() => {
    const getIngredientsData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ingredients"))
        const docs = []
        querySnapshot.forEach((ingredient) => {
          docs.push({...ingredient.data()})
        })
        setIngredientList(docs)
        setFetchIngState("success")
      } catch(error) {
        setFetchIngState("error")
      }
    }
    getIngredientsData()
  }, [ingredientsEdited])

  useEffect(() => {
    const getRecipesData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "recipes"))
        const docs = []
        querySnapshot.forEach((recipe) => {
          docs.push({...recipe.data()})
        })
        setRecipeList(docs)
      } catch(error) {
        console.error(error)
      }
    }
    getRecipesData()
  }, [])

  const handleGoogleSearch = (value) => {
    window.open(`https://www.google.com/search?q=${value}`, "_blank")
  }

  const getRemoveBtnValue = (ingredientId) => {
    setIngredientToRemoveId(ingredientId)
    const ingredientsUsedInRecipe =  recipeList.filter((item) => {
       return item.ingredients.some(ing => ing.id === ingredientId)
       })
    const emptyArray = []
    ingredientsUsedInRecipe.forEach(i => emptyArray.push(i.name))
    setRecipesUsingIngredient(emptyArray)
    setShowDeleteIngredientModal(true)
  }

  const sortedIngredients = ingredientList.sort((a, b) => {
    if (a.name < b.name) return -1
    if (a.name < b.name) return 1;
    return 0;
  });

  const displayIngredients = () => {
    if (fetchIngState === "success") {
      return sortedIngredients.map((item) => {
        return (
            <div className={styles.ingredient_btn_group} key={item.id}>
              <button className={styles.ingredient_btn} onClick={() => handleGoogleSearch(item.name)}>{item.name}</button>
              <button
                  disabled={!isAuthorized}
                  className={isAuthorized ? styles.ingredient_remove_btn : styles.ingredient_remove_btn_disabled}
                  onClick={() => getRemoveBtnValue(item.id)}
              >
                <Icon path={ mdiDeleteForever } size={0.8}/></button>
            </div>
            )
      });
    }
  };

  return (
    <>
      <h1 className={styles.title}>Seznam ingredienci</h1>
      <div className={styles.wrapper}>
        <AddNewIngredientModal />
        {displayIngredients()}
        <DeleteIngredientModal
            recipesUsingIngredient={recipesUsingIngredient}
            ingredientToRemoveId={ingredientToRemoveId}
            showDeleteIngredientModal={showDeleteIngredientModal}
        />
      </div>
    </>
  );
}

export default IngredientsList;
