import styles from "../css/AddNewIngredientModal.module.css";
import Icon from "@mdi/react";
import { mdiPlus } from "@mdi/js";
import { Modal, Form } from "react-bootstrap";
import { useState, useContext } from "react"
import IngredientsEditedContext from "../IngredientsEditedContext";
import { nanoid } from 'nanoid'
import { db } from "../utils/firebase"
import { doc, setDoc } from "firebase/firestore"
import UserContext from "../UserProvider";
import { toast } from 'react-toastify';



const AddNewIngredientModal = () => {
    const { isAuthorized } = useContext(UserContext);
    const { setIngredientsEdited } = useContext(IngredientsEditedContext)
    const [showModal, setShowModal] = useState(false)
    const [ingredientToAdd, setIngredientToAdd] = useState({
        name: "",
        id: ""
    })

    const ingredientAddedMessage = (ingredient) => toast.success(`Ingredience ${ingredient} přidána`);
    const handleShowModal = () => setShowModal(true)
    const handleCloseModal = () => setShowModal(false)

    const setNewIngredient = (e) => {
            setIngredientToAdd((prevValue) => {
                const newData = {...prevValue}
                newData.name = e.toLowerCase()
                newData.id = nanoid(16)
                return newData
            })
    }

    const addNewIngredients  = async (ingToAdd) => {
        try{
            await setDoc(doc(db, "ingredients", ingToAdd.id),{
                ...ingToAdd
            })
            ingredientAddedMessage(ingToAdd.name)
            setIngredientsEdited(prevValue => !prevValue)
        }catch(e){
            console.error(e)
        }
    }

    const handleSubmit = (e) => {
        e.preventDefault()
        addNewIngredients(ingredientToAdd)
        setIngredientToAdd({
            name: "",
            id: ""
        })
        handleCloseModal()
    }

    return(
        <>
        <button
            className={isAuthorized ? styles.add_ingredient_btn : styles.add_ingredient_btn_disabled}
            onClick={handleShowModal}
            disabled={!isAuthorized}
        >
            <Icon path={mdiPlus} size={0.8} />
            Přidat ingredienci
        </button>
            <Modal show={showModal} onHide={handleCloseModal}>
                <Modal.Header closeButton={true}>
                    <Modal.Title>Přidat ingredienci</Modal.Title>
                </Modal.Header>
                <Form className={styles.form} onSubmit={(e) => handleSubmit(e)}>
                    <Form.Group className={styles.form_group} controlId="nazev">
                        <Form.Control
                            placeholder="Název nové ingredience"
                            value={ingredientToAdd.name}
                            type="text"
                            onChange={(e) => setNewIngredient(e.target.value)}
                            minLength={2}
                            maxLength={20}
                            required
                        />
                        <Form.Control.Feedback type="invalid">Zadejte název ingredience</Form.Control.Feedback>
                    </Form.Group>
                    <button className={styles.submit_ingredient_btn} type="submit" >Přidat</button>
                </Form>
            </Modal>
        </>
 )
}

export default AddNewIngredientModal