import Icon from "@mdi/react";
import "../App.css";
import { mdiPlus, mdiLoading, mdiPencilOutline } from "@mdi/js";
import { useState, useEffect, useContext } from "react";
import UserContext from "../UserProvider";
import { Button, Modal, Form, Col, Row } from "react-bootstrap";

function CreateNewRecipeModal(props) {
  const { isAuthorized } = useContext(UserContext);
  const onComplete = props.onComplete;
  const [isModalShown, setIsModalShown] = useState(false);
  const [validated, setValidated] = useState(false);
  const [addRecipeCall, setAddRecipeCall] = useState({
    state: "inactive",
  });
console.log(isAuthorized)
  const defaultForm = {
    name: "",
    description: "",
    ingredients: [],
  };
  const [formData, setFormData] = useState(defaultForm);

  useEffect(() => {
    if (props.recipe) {
      setFormData({
        name: props.recipe.name,
        description: props.recipe.description,
        ingredients: props.recipe.ingredients,
      });
    }
  }, [props.recipe]);

  const handleShowModal = (data) => setIsModalShown({ state: true, data });
  const handleCloseModal = () => {
    setIsModalShown({ state: false });
    !props.recipe && setFormData(defaultForm);
  };

  const setField = (name, val) => {
    return setFormData((formData) => {
      const newData = { ...formData };
      newData[name] = val;
      return newData;
    });
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
      id: props.recipe ? props.recipe.id : null,
    };

    setAddRecipeCall({ state: "pending" });

    const res = await fetch(
      `http://localhost:3000/recipe/${props.recipe ? "update" : "create"}`,
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
      if (typeof onComplete === "function") {
        onComplete(data);
      }
    }
    handleCloseModal(data);
  };

  return (
    <>
      <Modal show={isModalShown.state} onHide={handleCloseModal}>
        <Modal.Header closeButton={true}>
          <Modal.Title>
            {props.recipe ? "Úprava receptu" : "Nový recept"}
          </Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form
            noValidate
            validated={validated}
            onSubmit={(e) => handleSubmit(e)}
          >
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
              <Form.Control.Feedback type="invalid">
                Zadejte popis s minimální délkou 3 znaky
              </Form.Control.Feedback>
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
            </Form.Group>
            <Row>
              <Form.Group as={Col} className="mb-3">
                <Form.Label>Ingredience</Form.Label>
                <Form.Select value={formData.ingredients.id} required>
                  <option value=""></option>

                  {props.allIngredients.map((opt) => {
                    return <option value={opt.id}>{opt.name}</option>;
                  })}
                </Form.Select>
                {}
                <Form.Control.Feedback type="invalid">
                  Zadejte jednu z možností
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} className="mb-3">
                <Form.Label>Počet</Form.Label>
                <Form.Control
                  value={formData.ingredients.amount}
                  type="number"
                  min="1"
                  rows={1}
                  placeholder="0"
                  required
                />
                <Form.Control.Feedback type="invalid">
                  Zadejte počet
                </Form.Control.Feedback>
              </Form.Group>

              <Form.Group as={Col} className="mb-3">
                <Form.Label>Jednotka</Form.Label>
                <Form.Select value={formData.ingredients.unit} required>
                  <option></option>
                  <option>ks</option>
                  <option>g</option>
                  <option>ml</option>
                </Form.Select>
                <Form.Control.Feedback type="invalid">
                  Zadejte jednu z možností
                </Form.Control.Feedback>
              </Form.Group>
            </Row>
            <Modal.Footer>
              <div className="d-flex flex-row justify-content-between align-items-center w-100">
                {addRecipeCall.state === "error" && (
                  <div className="text-danger">
                    Error: {addRecipeCall.error.errorMessage}
                  </div>
                )}
              </div>
              <Button
                style={{ float: "right", background: "green" }}
                variant="secondary"
                class="btn btn-success btn-sm"
                type="submit"
                disabled={addRecipeCall.state === "pending"}
              >
                {" "}
                {addRecipeCall.state === "pending" ? (
                  <Icon path={mdiLoading} size={0.8} spin={true} />
                ) : (
                  <>
                    <Icon
                      path={props.recipe ? mdiPencilOutline : mdiPlus}
                      size={1}
                    />
                    {props.recipe ? "Upravit recept" : "Pridat recept"}
                  </>
                )}
              </Button>
            </Modal.Footer>
          </Form>
        </Modal.Body>
      </Modal>

      {props.recipe ? (
       isAuthorized && <Button
          style={{ cursor: "pointer", float: "right", height: "2.7rem" }}
          onClick={() => handleShowModal()}
        >
          <Icon size={0.8} path={mdiPencilOutline} />
        </Button>
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
          <Icon
            path={mdiPlus}
            style={{ cursor: "pointer" }}
            size={1}
          />
          Pridat recept
        </Button>
      )}
    </>
  );
}

export default CreateNewRecipeModal;
