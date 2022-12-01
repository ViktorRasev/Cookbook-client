import React from "react";
import Recipe from "./Recipe";
import "../App.css";

function RecipeGridList(props) {

  const recipeList = props.recipeList

  return (
    <div class="row">
      {recipeList.map((recipe) => {
        return (
          <div className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
            <Recipe
              isLarge={props.isLargeProp}
              key={recipe.id}
              recipe={recipe}
              allIngredients={props.allIngredients}
            />
          </div>
        );
      })}
      ;
    </div>
  );
}

export default RecipeGridList;
