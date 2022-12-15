import Icon from "@mdi/react";
import "../App.css";
import { mdiPlus, mdiLoading, mdiPencilOutline, mdiDeleteForever, mdiCarrot, mdiClose } from "@mdi/js";
import { useState, useEffect, useContext, useRef } from "react";
import { Button, Modal, Form, Popover, Overlay } from "react-bootstrap";
import UserContext from "../UserProvider";
import RecipeEditedContext from "../RecipeEditedContext";
import styles from "../css/CreateNewRecipeModal.module.css";

function CreateNewRecipeModal({ allIngredients, recipe }) {
  const { isAuthorized } = useContext(UserContext);
  const { recipeEdited, setRecipeEdited } = useContext(RecipeEditedContext);
  const [isModalShown, setIsModalShown] = useState(false);
  const [validated, setValidated] = useState(false);
  const [addRecipeCall, setAddRecipeCall] = useState({
    state: "inactive",
  });

  // state for saving from data
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    ingredients: [],
  });

  useEffect(() => {
    if (recipe) {
      setFormData({
        name: recipe.name,
        description: recipe.description,
        ingredients: recipe.ingredients,
      });
    }
  }, [recipe]);

  // for showing/ closing modal
  const handleShowModal = () => setIsModalShown(true);
  const handleCloseModal = () => setIsModalShown(false);

  const setField = (name, val) => {
    return setFormData((formData) => {
      const newData = { ...formData };
      console.log(newData[name]);
      newData[name] = val;
      return newData;
    });
  };

  const setIngredientField = (inputName, val, index) => {
    return setFormData((formData) => {
      const newData = { ...formData };
      newData.ingredients[index][inputName] = val;
      return newData;
    });
  };

  // sort ingredients in alphabetical order
  const sortedIngredients = allIngredients.sort((a, b) => {
    if (a.name < b.name) {
      return -1;
    }
    if (a.name < b.name) {
      return 1;
    }
    return 0;
  });

  // function to create new line of input group to add ingredient
  const ingredientInputGroup = (ingredient, index) => {
    return (
      <div key={index} className={styles.single_ingredient_to_add}>
        <Form.Group className="mb1 u-75" controlId="ingredients">
          {!index && <Form.Label>Ingredience</Form.Label>}
          <Form.Select value={ingredient.id} onChange={(e) => setIngredientField("id", e.target.value, index)} required>
            <option></option>
            {sortedIngredients.map((item) => {
              return (
                <option key={item.id} value={item.id}>
                  {item.name}
                </option>
              );
            })}
          </Form.Select>
        </Form.Group>

        <Form.Group className="mb-1" controlId="amount">
          {!index && <Form.Label>Počet</Form.Label>}
          <Form.Control
            type="number"
            value={ingredient.amount}
            onChange={(e) => setIngredientField("amount", parseInt(e.target.value), index)}
            required
          />
        </Form.Group>

        <Form.Group className="mb-1" controlId="unit">
          {!index && <Form.Label>Jednotka</Form.Label>}
          <Form.Control
            value={ingredient.unit}
            onChange={(e) => setIngredientField("unit", e.target.value, index)}
            placeholder="napr. kg, ml, kus"
            required
          />
        </Form.Group>

        {/* styles.remove_ing_btn */}
        <button
          onClick={() => removeIngredient(index)}
          className={`${styles.remove_ing_btn} ${styles["remove_ing_btn_" + index]}`}
        >
          <Icon path={mdiDeleteForever} size={0.9} />
        </button>
      </div>
    );
  };

  // default values when adding new ingredient (empty)
  const emptyIngredient = () => {
    return { amount: "", unit: "", id: "" };
  };

  // add new ingredient to an array of original ingredients
  const addEmptyIngredient = () => {
    const newFormData = {
      ...formData,
      ingredients: [...formData.ingredients, emptyIngredient()],
    };
    setFormData(newFormData);
  };

  const removeIngredient = (index) => {
    const newIngredients = [...formData.ingredients];
    newIngredients.splice(index, 1);

    const newFormData = {
      ...formData,
      ingredients: newIngredients,
    };
    setFormData(newFormData);
  };

  const handleSubmit = async (e) => {
    const form = e.currentTarget;
    e.preventDefault();

    if (!form.checkValidity()) {
      setValidated(true);
      return;
    }

    const newData = { ...formData };
    const payload = {
      ...newData,
      id: recipe ? recipe.id : null,
    };

    setAddRecipeCall({ state: "pending" });

    const res = await fetch(
      `https://cookbook-server-nu.vercel.app/recipe/${recipe ? "update" : "create"}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      }
    );
    const data = await res.json();
    if (res.status >= 400) {
      setAddRecipeCall({ state: "error", error: data });
    } else {
      setAddRecipeCall({ state: "success", data });
      setRecipeEdited(!recipeEdited);
    }
    handleCloseModal();
  };

  const handleDeleteRecipe = async () => {
    const res = await fetch(
      `https://cookbook-server-nu.vercel.app/recipe/delete`,
      // `http://localhost:3000/recipe/delete`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ id: recipe.id }),
      }
    );
    if (res.status >= 400) {
      console.log("ERROR");
    } else {
      setRecipeEdited(!recipeEdited);
    }
  };



  // Button for recipe delete and "are you sure?" popover
  function DeleteRecipeBtn() {
    const [showPopover, setShowPopover] = useState(false);
    const [target, setTarget] = useState(null);
    const ref = useRef(null);

    const handleClick = (event) => {
      setShowPopover(!showPopover);
      setTarget(event.target);
    };

    return (
      <div ref={ref}>
        <Button onClick={handleClick} variant="danger">
          <Icon path={mdiDeleteForever} size={0.8} />
          Vymazat recept
        </Button>

        <Overlay show={showPopover} target={target} placement="top" container={ref} containerPadding={20}>
          <Popover id="popover-contained">
            <Popover.Header as="h3" className={styles.popover_header}>
              Opravdu si přejete vymazat recept?<Button className={styles.close_popover_btn} onClick={() => handleClick()}><Icon path={mdiClose} size={1} /></Button>
            </Popover.Header>
            <Popover.Body className={styles.popover_body}>
              <Button variant="danger" onClick={() => handleDeleteRecipe()}>Ano</Button>
              <Button onClick={() => handleClick()}>Ne</Button>
            </Popover.Body>
          </Popover>
        </Overlay>
      </div>
    );
  }

  return (
    <>
      <Modal show={isModalShown} onHide={handleCloseModal}>
        <Modal.Header closeButton={true}>
          <Modal.Title>{recipe ? "Úprava receptu" : "Nový recept"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form noValidate validated={validated} onSubmit={(e) => handleSubmit(e)}>
            <Form.Group className="mb-3" controlId="nazev">
              <Form.Label>Název</Form.Label>
              <Form.Control
                value={formData.name}
                type="text"
                onChange={(e) => setField("name", e.target.value)}
                minLength={3}
                maxLength={15}
                required
              />
              <Form.Control.Feedback type="invalid">Zadejte popis s minimální délkou 3 znaky</Form.Control.Feedback>
            </Form.Group>

            <Form.Group className="mb-3" controlId="postup">
              <Form.Label>Postup</Form.Label>
              <Form.Control
                value={formData.description}
                as="textarea"
                rows={5}
                onChange={(e) => setField("description", e.target.value)}
                required
              />
              <Form.Control.Feedback type="invalid">Zadejte postup</Form.Control.Feedback>
            </Form.Group>

            {formData.ingredients.map((ing, index) => {
              return ingredientInputGroup(ing, index);
            })}

            <Button onClick={addEmptyIngredient} className={styles.add_ingredient_btn}>
              <Icon path={mdiCarrot} size={1} />
              Přidat ingredienci
            </Button>

            <Modal.Footer>
              <div className="d-flex flex-row justify-content-between align-items-center w-100">
                {addRecipeCall.state === "error" && (
                  <div className="text-danger">Error: {addRecipeCall.error.errorMessage}</div>
                )}
              </div>
              <Button
                style={{ float: "right", background: "green" }}
                variant="success"
                class="btn btn-success btn-sm"
                // className={styles.add_update_recipe}
                type="submit"
                disabled={addRecipeCall.state === "pending"}
              >
                {addRecipeCall.state === "pending" ? (
                  <Icon path={mdiLoading} size={0.8} spin={true} />
                ) : (
                  <>
                    <Icon path={recipe ? mdiPencilOutline : mdiPlus} size={0.8} />
                    {recipe ? "Upravit recept" : "Pridat recept"}
                  </>
                )}
              </Button>

              {recipe && <DeleteRecipeBtn />}
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      {recipe ? (
        isAuthorized && (
          <Button style={{ cursor: "pointer", float: "right", height: "2.5rem" }} onClick={() => handleShowModal()}>
            <Icon size={0.7} path={mdiPencilOutline} />
          </Button>
        )
      ) : (
        <Button
          disabled={!isAuthorized}
          className="add-recipe-btn"
          onClick={() => handleShowModal()}
          variant="outline-primary"
          style={{
            margin: "0 8px",
            background: isAuthorized ? "green" : "grey",
            color: "white",
            border: "none",
          }}
        >
          <Icon path={mdiPlus} style={{ cursor: "pointer" }} size={1} />
          Pridat recept
        </Button>
      )}
    </>
  );
}

export default CreateNewRecipeModal;
