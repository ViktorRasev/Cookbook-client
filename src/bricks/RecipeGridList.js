import React from "react";
import Recipe from "./Recipe";
import "../App.css";
import { Container, Row, Col } from "react-bootstrap";


function RecipeGridList({ isLarge, filteredRecipeList, allIngredients }) {
  return (
    <Container>
      <Row>
        {filteredRecipeList.map((recipe) => {
          return (
            <Col key={recipe.id} sm={6} md={4} lg={3} lx={3}>
              <Recipe key={recipe.id} isLarge={isLarge} recipe={recipe} allIngredients={allIngredients} />
            </Col>
          );
        })}
      </Row>
    </Container>
  );
}

export default RecipeGridList;
