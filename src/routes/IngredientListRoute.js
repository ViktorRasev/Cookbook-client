import { useState, useEffect } from "react";
import { db } from "../utils/firebase"
import {collection, getDocs, getDoc, doc} from "firebase/firestore";
import styles from "../css/Ingredients.module.css";

function IngredientsList() {
  const [ingredientList, setIngredientList] = useState([]);
  const [fetchIngState, setFetchIngState] = useState("loading")

  useEffect(() => {
    const getIngredientsData = async () => {
      try {
        const querySnapshot = await getDocs(collection(db, "ingredients"))
        const docs = []
        querySnapshot.forEach((ingredient) => {
          docs.push({...ingredient.data()})
        })
        setIngredientList(docs)
        setFetchIngState("success")
      } catch(error) {
        setFetchIngState("error")
      }
    }
    getIngredientsData()
  }, [])


  const displayIngredients = () => {
    if (fetchIngState === "success") {
      return ingredientList.map((item) => {
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
