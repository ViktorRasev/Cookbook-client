import { useEffect, useState, useContext } from "react";
import Icon from "@mdi/react";
import { mdiLoading } from "@mdi/js";
import Header from "../bricks/Header";
import RecipeEditedContext from "../RecipeEditedContext";

function RecipeListRoute() {
  const { recipeEdited } = useContext(RecipeEditedContext);
  const [ingredientsLoadCall, setIngredientsLoadCall] = useState({
    state: "pending",
  });
  const [cookbookLoadCall, setCookbookLoadCall] = useState({
    state: "pending",
  });

  useEffect(() => {
    fetch(`https://cookbook-server-nu.vercel.app/recipe/list`, {
      method: "GET",
    }).then(async (response) => {
      const responseJson = await response.json();
      if (response.status >= 400) {
        setCookbookLoadCall({ state: "error", error: responseJson });
      } else {
        setCookbookLoadCall({ state: "success", data: responseJson });
      }
    });
  }, [recipeEdited]);

  useEffect(() => {
    fetch(`https://cookbook-server-nu.vercel.app/ingredient/list`, {
      method: "GET",
    }).then(async (response) => {
      const responseJson = await response.json();
      if (response.status >= 400) {
        setIngredientsLoadCall({ state: "error", error: responseJson });
      } else {
        setIngredientsLoadCall({ state: "success", data: responseJson });
      }
    });
  }, [recipeEdited]);

  const isPending = cookbookLoadCall.state === "pending" || ingredientsLoadCall.state === "pending";
  const isLoaded = cookbookLoadCall.state === "success" || ingredientsLoadCall.state === "success";
  const isError = cookbookLoadCall.state === "error" || ingredientsLoadCall.state === "error";

  function getChild() {
    if (isPending) {
      return (
        <div>
          <Icon size={2} path={mdiLoading} spin={true} />
        </div>
      );
    } else if (isLoaded) {
      return (
        <>
          <Header recipeList={cookbookLoadCall.data} allIngredients={ingredientsLoadCall.data} />
        </>
      );
    } else if (isError) {
      return (
        <div>
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
