import React from "react";
import Recipe from "./Recipe";
import "../App.css";

function RecipeGridList({isLarge, filteredRecipeList, allIngredients}) {

  return (
    <div className="row">
      {filteredRecipeList.map((recipe) => {
        return (
          <div key={recipe.id} className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
            <Recipe
              isLarge={isLarge}
              recipe={recipe}
              allIngredients={allIngredients}
            />
          </div>
        );
      })}
      ;
    </div>
  );
}

export default RecipeGridList;
