import { useState, useEffect } from "react";


import styles from "../css/Ingredients.module.css";

function IngredientsList() {
  const [ingredientsLoadCall, setIngredientsLoadCall] = useState({
    state: "pending",
  });

  useEffect(() => {
    fetch(
      `http://localhost:3000/ingredient/list`,
      // `https://cookbook-server-nu.vercel.app/ingredient/list`,
      {
        method: "GET",
      }
    ).then(async (response) => {
      const responseJson = await response.json();
      if (response.status >= 400) {
        setIngredientsLoadCall({ state: "error", error: responseJson });
      } else {
        setIngredientsLoadCall({ state: "success", data: responseJson });
      }
    });
  }, []);

  const displayIngredients = () => {
    if (ingredientsLoadCall.state === "success") {
      return ingredientsLoadCall.data.map((item) => {
        return <div className={styles.ingredient} key={item.id}>{item.name}</div>;
      });
    }
  };

  return (
    <>
      <h1 className={styles.title}>Seznam ingredienci</h1>
      <div className={styles.wrapper}>{displayIngredients()}</div>
    </>
  );
}

export default IngredientsList;
