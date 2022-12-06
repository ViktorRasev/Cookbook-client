import React, { useState, useMemo } from "react";
import RecipeGridList from "./RecipeGridList";
import RecipeTableList from "./RecipeTableList";
import "../App.css";
import CreateNewRecipeModal from "./CreateNewRecipeModal";
import { Container, Navbar, Button, Form } from "react-bootstrap";
import Icon from "@mdi/react";
import { mdiTable, mdiViewGridOutline, mdiMagnify } from "@mdi/js";
import styles from "../css/RecipeList.module.css";

function Header({ recipeList, allIngredients, onComplete }) {
  const [viewType, setViewType] = useState("grid");
  const isGrid = viewType === "grid";

  const [viewSize, setViewSize] = useState("large");
  const isLarge = viewSize === "large";

  const [searchBy, setSearchBy] = useState("");

  const filteredRecipeList = useMemo(() => {
    return recipeList.filter((item) => {
      return (
        item.name.toLocaleLowerCase().includes(searchBy.toLocaleLowerCase()) ||
        item.description.toLocaleLowerCase().includes(searchBy.toLocaleLowerCase())
      );
    });
  }, [searchBy, recipeList]);

  function handleSearch(event) {
    event.preventDefault();
    setSearchBy(event.target["searchInput"].value);
  }

  function handleSearchDelete(event) {
    if (!event.target.value) setSearchBy("");
  }

  return (
    <div>
      <Navbar bg="light">
        <Container fluid className={styles.header_container}>
          <div className={styles.header_buttons}>
            <Form className={styles.search_form} onSubmit={handleSearch}>
              <Form.Control
                id={"searchInput"}
                // style={{ maxWidth: "150px" }}
                type="search"
                placeholder="Hledat"
                aria-label="Search"
                onChange={handleSearchDelete}
              />
              <Button variant="outline-success" type="submit">
                <Icon size={1} path={mdiMagnify} />
              </Button>
            </Form>

            <Button
              className={styles.table_grid_button}
              variant="outline-primary"
              onClick={() =>
                setViewType((currentState) => {
                  if (currentState === "grid") return "table";
                  else return "grid";
                })
              }
            >
              <Icon size={1} path={isGrid ? mdiTable : mdiViewGridOutline} /> {isGrid ? "Tabulka" : "Grid"}
            </Button>
            {viewType === "grid" ? (
              <Button
                className={styles.size_button}
                onClick={() => {
                  setViewSize((currentState) => {
                    if (currentState === "large") return "small";
                    else return "large";
                  });
                }}
              >
                {isLarge ? "Velký detail" : "Malý detail"}
              </Button>
            ) : null}
          </div>

          <CreateNewRecipeModal allIngredients={allIngredients} onComplete={onComplete} />
        </Container>
      </Navbar>

      {isGrid ? (
        <RecipeGridList isLarge={isLarge} filteredRecipeList={filteredRecipeList} allIngredients={allIngredients} />
      ) : (
        <RecipeTableList filteredRecipeList={filteredRecipeList} />
      )}
    </div>
  );
}

export default Header;
