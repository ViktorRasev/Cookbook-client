import React from "react";
import Table from "react-bootstrap/Table";

function RecipeTableList(props) {

  const recipeList = props.recipeList

  return (
    <Table>
      <thead>
        <tr>
          <th>Název</th>
          <th>Postup</th>
        </tr>
      </thead>
      <tbody>
        {recipeList.map((recipe) => {
          return (
            <tr key={recipe.name}>
              <td>{recipe.name}</td>
              <td>{recipe.description}</td>
            </tr>
          );
        })}
      </tbody>
    </Table>
  );
}

export default RecipeTableList;