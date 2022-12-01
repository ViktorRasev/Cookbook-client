import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";
import RecipeList from "../bricks/RecipeList";
import styles from "../css/classroom.module.css";

function RecipeListRoute() {
  const [ingredientsLoadCall, setIngredientsLoadCall] = useState({
    state: "pending",
  });
  const [cookbookLoadCall, setCookbookLoadCall] = useState({
    state: "pending",
  });

  const handleRecipeAdded = (recipe) => {
    if (cookbookLoadCall.state === "succes") {
      setCookbookLoadCall({
        state: "success",
        data: [...cookbookLoadCall.data, recipe],
      });
    }
  };

  let [searchParams] = useSearchParams();

  let recipeId = searchParams;

  useEffect(() => {
    fetch(`http://localhost:3000/recipe/list?id=${recipeId}`, {
      method: "GET",
    }).then(async (response) => {
      const responseJson = await response.json();
      if (response.status >= 400) {
        setCookbookLoadCall({ state: "error", error: responseJson });
      } else {
        setCookbookLoadCall({ state: "success", data: responseJson });
      }
    });
  }, [recipeId]);

  useEffect(() => {
    fetch(`http://localhost:3000/ingredient/list`, {
      method: "GET",
    }).then(async (response) => {
      const responseJson = await response.json();
      if (response.status >= 400) {
        setIngredientsLoadCall({ state: "error", error: responseJson });
      } else {
        setIngredientsLoadCall({ state: "success", data: responseJson });
      }
    });
  }, []);

  const isPending =
    cookbookLoadCall.state === "pending" ||
    ingredientsLoadCall.state === "pending";
  const isLoaded =
    cookbookLoadCall.state === "success" ||
    ingredientsLoadCall.state === "success";
  const isError =
    cookbookLoadCall.state === "error" || ingredientsLoadCall.state === "error";

  function getChild() {
    if (isPending) {
      return (
        <div className={styles.loading}>
          <Icon size={2} path={mdiLoading} spin={true} />
        </div>
      );
    } else if (isLoaded) {
      return (
        <>
          <RecipeList
            recipeList={cookbookLoadCall.data}
            allIngredients={ingredientsLoadCall.data}
            onComplete={(recipe) => handleRecipeAdded(recipe)}
          />
        </>
      );
    } else if (isError) {
      return (
        <div cookbook={styles.error}>
          <div>Recepty se nepodařilo načíst!</div>
          <br />
          <pre>{JSON.stringify(cookbookLoadCall.error, null, 2)}</pre>
        </div>
      );
    } else {
      return null;
    }
  }

  return <div>{getChild()}</div>;
}

export default RecipeListRoute;
