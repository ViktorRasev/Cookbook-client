import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, Container } from "react-bootstrap";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";
import styles from "../css/RecipeDetailRoute.module.css";
import { db } from "../utils/firebase"
import {collection, getDocs, getDoc, doc} from "firebase/firestore";

export default function RecipeDetailRoute() {
  const [recipe, setRecipe] = useState([]);
  const [ingredientList, setIngredientList] = useState([]);
  const [fetchRecipeState, setFetchRecipeState] = useState("loading")
  const [fetchIngState, setFetchIngState] = useState("loading")

  let [searchParams] = useSearchParams();
  let recipeId = searchParams.get("id");

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
  }, [])

  useEffect(() => {
    const getRecipesData = async () => {
      try {
        const docRef = doc(db, "recipes", recipeId);
        const docSnap = await getDoc(docRef)
        setRecipe(docSnap.data())
        setFetchRecipeState("success")
      } catch(error) {
        setFetchRecipeState("error")
      }
    }
    getRecipesData()
  },[recipeId])

    const matchedRecipeIngredients = () => {
        const recipeIngredientsIds = recipe.ingredients.map(ing => ing.id)
        const recipeIngredients = ingredientList.filter(ing => recipeIngredientsIds.includes(ing.id))
        const newData = {
          ...recipe,
          ingredients: recipe.ingredients.map((ing) => {
            const ingredientsMatch = recipeIngredients.find(i => i.id === ing.id)
            return {
              ...ing,
              name: ingredientsMatch.name
            }
          })
        }
        return newData
      }


  const isPending = fetchIngState === "pending" && fetchRecipeState === "pending";
  const isLoaded = fetchIngState === "success" && fetchRecipeState === "success";
  const isError = fetchIngState === "error" && fetchRecipeState === "error";

if(isLoaded){
      return (
        <Container>
          <Card className={styles.card}>
            <Card.Img variant="top" src={recipe.imgUri} />
            <Card.Body>
              <Card.Title className={styles.title}>
                <h1>{recipe.name}</h1>
              </Card.Title>
              <Card.Text className={styles.description}>{recipe.description}</Card.Text>
                <h3 className={styles.ingredients}>Ingredience</h3>
                <ul>
                  {matchedRecipeIngredients().ingredients.map((ingredient, index) => {
                    return <li key={index}>{`${ingredient.amount} ${ingredient.unit} - ${ingredient.name}`}</li>;
                  })}
                </ul>
            </Card.Body>
          </Card>
        </Container>
      );
    }
    else if (isPending)
    {
      return (
        <div className={styles.loading_icon}>
          <Icon path={mdiLoading} spin={true} size={2}/>
          <h3>Loading</h3>
        </div>
      );
    } else if (isError) {
      return (
        <>
          <h1>ERROR</h1>
        </>
      );
    }
}
