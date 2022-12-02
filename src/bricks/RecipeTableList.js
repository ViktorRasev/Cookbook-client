import React from "react";
import Table from "react-bootstrap/Table";

function RecipeTableList({ filteredRecipeList }) {


  return (
    <Table>
      <thead>
        <tr>
          <th>Název</th>
          <th>Postup</th>
        </tr>
      </thead>
      <tbody>
        {filteredRecipeList.map((recipe) => {
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