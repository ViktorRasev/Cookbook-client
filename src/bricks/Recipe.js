import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import CreateNewRecipeModal from "./CreateNewRecipeModal";
import styles from "../css/Recipe.module.css"
import {useNavigate} from "react-router-dom";

function matchIngredients(ingredientsInRecepies, ingredientsAll) {
  return ingredientsInRecepies.map((oneIngredient) => {
    return ingredientsAll.find(
      (singleRecipe) => singleRecipe.id === oneIngredient.id
    ).name;
  });
}

function Recipe({ isLarge,  recipe, allIngredients}) {
  const ingredientsMatched = matchIngredients(
    recipe.ingredients,
    allIngredients
  );
  const [recipeData, setRecipeData] = useState(recipe);

  let navigate = useNavigate();

  const navigateToRecipe = (recipeId) => {
    navigate("/recipeDetail?id=" + recipeId)
  }


  return (
    <Card className={styles.card}>
      <Card.Body className={isLarge ? styles.card_body : styles.card_body_large}>
        <div className={styles.single_meal}>
         {recipe.imgUri && <img
            className={styles.food_image}
            onClick={() => navigateToRecipe(recipe.id)}
            src={recipe.imgUri}
            alt="recipe result"
         />}
          <h1
              className={isLarge ? styles.title : styles.title_small}
              onClick={() => navigateToRecipe(recipe.id)}
          >
            {recipe.name}{" "}
            <CreateNewRecipeModal
              allIngredients={allIngredients}
              recipe={recipeData}
            />
          </h1>
          <Card.Text className={ isLarge ? "text-truncate": null} style={{padding:".8rem"}}>
            {recipe.description}
          </Card.Text>
          <ul className={styles.ingredient_list}>
            {ingredientsMatched.map((singleIngredient) => {
              return <li key={singleIngredient}>{singleIngredient}</li>;
            })}
          </ul>
        </div>
      </Card.Body>
    </Card>
  );
}

export default Recipe;
