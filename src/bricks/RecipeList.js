import React, { useState, useMemo } from "react";
import RecipeGridList from "./RecipeGridList";
import RecipeTableList from "./RecipeTableList";
import "../App.css";
import Navbar from "react-bootstrap/Navbar";
import Button from "react-bootstrap/Button";
import Form from "react-bootstrap/Form";
import CreateNewRecipeModal from "./CreateNewRecipeModal";

import Icon from "@mdi/react";
import { mdiTable, mdiViewGridOutline, mdiMagnify } from "@mdi/js";

function RecipeList(props) {
  const [viewType, setViewType] = useState("grid");
  const isGrid = viewType === "grid";

  const [viewSize, setViewSize] = useState("large");
  const isLarge = viewSize === "large";

  const [searchBy, setSearchBy] = useState("");


  const filteredRecipeList = useMemo(() => {
    return props.recipeList.filter((item) => {
      return (
        item.name.toLocaleLowerCase().includes(searchBy.toLocaleLowerCase()) ||
        item.description
          .toLocaleLowerCase()
          .includes(searchBy.toLocaleLowerCase())
      );
    });
  }, [searchBy, props.recipeList]);

  function handleSearch(event) {
    event.preventDefault();
    setSearchBy(event.target["searchInput"].value);
  }

  function handleSearchDelete(event) {
    if (!event.target.value) setSearchBy("");
  }

  // console.log(props.recipeList)


  return (
    <div>
      <Navbar bg="light">
        <div className="container-fluid">
          <Navbar.Brand>Seznam receptů</Navbar.Brand>
          <div>
            <Form className="d-flex" onSubmit={handleSearch}>
              <Form.Control
                id={"searchInput"}
                style={{ maxWidth: "150px" }}
                type="search"
                placeholder="Search"
                aria-label="Search"
                onChange={handleSearchDelete}
              />
              <Button
                style={{ marginRight: "8px" }}
                variant="outline-success"
                type="submit"
              >
                <Icon size={1} path={mdiMagnify} />
              </Button>
              <Button
                variant="outline-primary"
                style={{ marginRight: "8px" }}
                onClick={() =>
                  setViewType((currentState) => {
                    if (currentState === "grid") return "table";
                    else return "grid";
                  })
                }
              >
                <Icon size={1} path={isGrid ? mdiTable : mdiViewGridOutline} />{" "}
                {isGrid ? "Tabulka" : "Grid"}
              </Button>
              {viewType === "grid" ? (
                <Button
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
              <CreateNewRecipeModal 
                allIngredients={props.allIngredients}
                onComplete={props.onComplete}
              />
            </Form>
          </div>
        </div>
      </Navbar>

      {isGrid ? (
        <RecipeGridList
          isLargeProp={isLarge}
          recipeList={filteredRecipeList}
          allIngredients={props.allIngredients}
        />
      ) : (
        <RecipeTableList recipeList={filteredRecipeList} />
      )}
    </div>
  );
}

export default RecipeList;
