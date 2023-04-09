import { Modal, Button } from "react-bootstrap"
import { useContext, useEffect, useState } from "react";
import IngredientsEditedContext from "../IngredientsEditedContext";
import { db } from "../utils/firebase"
import { deleteDoc, doc } from "firebase/firestore";
import { toast } from 'react-toastify';

const DeleteIngredientModal = ({recipesUsingIngredient, ingredientToRemoveId, showDeleteIngredientModal}) => {
    const {setIngredientsEdited} = useContext(IngredientsEditedContext)
    const [recipes, setRecipes] = useState("")
    const [showModal, setShowModal] = useState(false)

    const ingredientDeletedMessage = () => toast.info("Ingredience smazána");

    useEffect(() => {
        setShowModal(showDeleteIngredientModal)
        setRecipes(recipesUsingIngredient)
    },[recipesUsingIngredient])

    const handleCloseModal = () => setShowModal(false)

    const handleRemoveIngredient  = async () => {
          try{
            await deleteDoc(doc(db, "ingredients", ingredientToRemoveId))
              ingredientDeletedMessage()
          }catch(error) {
            console.error(error)
          }
          handleCloseModal()
          setIngredientsEdited(prevValue => !prevValue)
    }

    return (
        <>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header  closeButton={true}>
                    {recipes.length ?
                        <h4>Není možné vymazat ingredienci</h4>
                        :
                        <h4>Opravdu si přejete vymazat ingredienci?</h4>}
                    </Modal.Header>
                <Modal.Body>
                    {recipes.length ?
                        <>
                            <h5>Ingredience je použitá v:</h5>
                            <ul>{recipes.map((recipe, index) => <li key={index}>{recipe}</li>)}</ul>
                        </>
                        :
                        <div style={{display:"flex", justifyContent:'space-around'} }>
                            <Button variant="danger" onClick={handleRemoveIngredient}>Ano</Button>
                            <Button onClick={handleCloseModal}>Ne</Button>
                        </div>}
                </Modal.Body>
            </Modal>
        </>
    )
}

export default DeleteIngredientModal