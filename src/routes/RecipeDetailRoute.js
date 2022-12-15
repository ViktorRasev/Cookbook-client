import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import { Card, Container } from "react-bootstrap";
import styles from "../css/RecipeDetailRoute.module.css";


export default function RecipeDetailRoute() {
  const [recipeList, setRecipeList] = useState({
    state: "pending",
  });
  const [ingredientList, setIngredientList] = useState({
    state: "pending",
  });

  // console.log(recipeWithIngredients.ingredients.length)
  // fetch vsetky ingrediencie porovnat ich IDcka s IDckami konkretneho receptu a vyhodit ich do DOMu

  let [searchParams] = useSearchParams();

  let recipeId = searchParams.get("id");

  useEffect(() => {
    fetch(
      `http://localhost:3000/recipe/list`,
      // `https://cookbook-server-nu.vercel.app/recipe/list?id=${recipeId}`,

      {
        method: "GET",
      }
    ).then(async (response) => {
      const responseJson = await response.json();
      if (response.status >= 400) {
        setRecipeList({ state: "error", error: responseJson });
      } else {
        setRecipeList({ state: "success", data: responseJson });
      }
    });
  }, [recipeId]);

  useEffect(() => {
    fetch(
      `http://localhost:3000/ingredient/list`,
      // `https://cookbook-server-nu.vercel.app/ingredient/list`,
      {
        method: "GET",
      }
    ).then(async (response) => {
      const responseJson = await response.json();
      if (response.status >= 400) {
        setIngredientList({ state: "error", error: responseJson });
      } else {
        setIngredientList({ state: "success", data: responseJson });
      }
    });
  }, []);

  const isPending = recipeList.state === "pending" && ingredientList.state === "pending";
  const isLoaded = recipeList.state === "success" && ingredientList.state === "success";
  const isError = recipeList.state === "error" && ingredientList.state === "error";

  const getRecipe = () => {
    if (isLoaded) {
      let allIngredients = ingredientList.data;

      // prvy napad: vytvorit funkciu ktora bude mat ako prameter indexy a nejak to zarovnat netusim jak
      // druhy : vytvorit state alebo funkciu podobnu ako v componente CreateNewRecipeModal const emptyIngredient = () => {
      //   return { amount: "", unit: "", id: "" };
      // };
      // do ktoreho sa bude ukladat vsetko naraz a potom sa to bude az renderovat
      // alebo rovno cely objekt ktory bude mat meno description a array of ingredients

      const recipe = recipeList.data.find((oneRecipe) => {
        return oneRecipe.id === recipeId;
      });

      // const filteredIngredients = allIngredients.filter((ingredient) => {
      //   return recipe.ingredients.some((recipeIngredient) => {
      //     return ingredient.id === recipeIngredient.id;
      //   });
      // });

      const result = {
        ...recipe,
        ingredients: recipe.ingredients.map((ing) => ({
          ...ing,
          name: allIngredients.find((el) => el.id === ing.id),
        })),
      };

      return (
        <Container>
          <Card>
            <Card.Img variant="top" src={recipe.imgUri} />
            <Card.Body>
              <Card.Title>
                <h1>{result.name}</h1>
              </Card.Title>
              <Card.Text>{result.description}</Card.Text>
              <Card.Text className={styles.ingredients}>
            <h2>Ingredience</h2>
            <ul>
              {result.ingredients.map((ingredient, index) => { 
                return <li key={index}>{`${ingredient.amount} ${ingredient.unit} - ${ingredient.name.name}`}</li>
              })}
            </ul>
            </Card.Text>
            </Card.Body>
          </Card>
        </Container>
      );
    } else if (isPending) {
      return (
        <>
          <div>Loading</div>
          <div>Loading</div>
          <div>Loading</div>
          <div>Loading</div>
          <div>Loading</div>
          <div>Loading</div>
        </>
      );
    } 
    else if(isError){
      return (
        <>
          <h1>ERROR</h1>
        </>
      );
    }
  };

  return <div style={{ marginTop: "100px" }}>{getRecipe()}</div>;
}
