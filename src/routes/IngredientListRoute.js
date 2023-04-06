import { useState, useEffect } from "react";
import { db } from "../utils/firebase"
import {collection, getDocs } from "firebase/firestore";
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



  const handleGoogleSearch = (value) => {
    window.open(`https://www.google.com/search?q=${value}`, "_blank")
  }
  const displayIngredients = () => {
    if (fetchIngState === "success") {
      return ingredientList.map((item) => {
        return <button className={styles.ingredient} value={item.name} onClick={() => handleGoogleSearch(item.name)} key={item.id}>{item.name}</button>;
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
