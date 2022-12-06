import React, { useState } from "react";
import Card from "react-bootstrap/Card";
import CreateNewRecipeModal from "./CreateNewRecipeModal";

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
// console.log(recipe)
  return (
    <Card>
      <Card.Body>
        <div className="single-meal">
          <img
            className="food-image"
            src={recipe.imgUri}
            alt="recipe result"
          ></img>
          <h1 className={isLarge ? "title" : "title-small"}>
            {recipe.name}{" "}
            <CreateNewRecipeModal
              allIngredients={allIngredients}
              recipe={recipeData}
            />
          </h1>
          <Card.Text>
            {isLarge ? (
              <p className="text-truncate">{recipe.description}</p>
            ) : ( 
              <p>{recipe.description}</p>
            )}
          </Card.Text>
          <ul>
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
