import React, { useState, useEffect, useContext } from "react";
import "./App.css";
import { db } from "./utils/firebase"
import { collection, getDocs} from "firebase/firestore"
import "bootstrap/dist/css/bootstrap.min.css";
import Icon from "@mdi/react";
import { mdiLoading, mdiAlertOctagonOutline } from "@mdi/js";
import UserContext from "./UserProvider";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import Container from "react-bootstrap/Container";
import Offcanvas from "react-bootstrap/Offcanvas";
import "bootstrap/dist/css/bootstrap.min.css";
import { Outlet, useNavigate } from "react-router-dom";
import { NavLink } from "react-bootstrap";
import RecipeEditedContext from "./RecipeEditedContext";


function App() {
  const {isAuthorized, setIsAuthorized}  = useContext(UserContext);
  const [recipeList, setRecipeList] = useState([])
  const [fetchDataState, setFetchDataState] = useState("loading")
  const { recipeEdited } = useContext(RecipeEditedContext);

  let navigate = useNavigate();

  useEffect(() => {
    const getRecipesData = async () => {
      try {
      const querySnapshot = await getDocs(collection(db, "recipes"))
      const docs = []
      querySnapshot.forEach((recipe) => {
        docs.push({...recipe.data()})
      })
        setRecipeList(docs)
        setFetchDataState("success")
      } catch(error) {
        console.error(error)
        setFetchDataState("error")
      }
    }
    getRecipesData()
  }, [recipeEdited])

  function getRecipesListDropdown() {
    if (fetchDataState === "loading") {
      return (
        <Nav.Link disabled={true}>
          <Icon size={2} path={mdiLoading} spin={true} /> Recipes List
        </Nav.Link>
      );
    } else if (fetchDataState === "success") {
      return (
        <>
          <NavLink onClick={() => setIsAuthorized(!isAuthorized)}>
            {isAuthorized ? "Přihlášen" : "Nepřihlášen"}
          </NavLink>
          <NavDropdown title="Vyberte recept" id="navbarScrollingDropdown">
            {recipeList.map((recipe) => {
              return (
                <NavDropdown.Item
                  key={recipe.id}
                  onClick={() =>
                    navigate("/recipeDetail?id=" + recipe.id)
                  }
                >
                  {recipe.name}
                </NavDropdown.Item>
              );
            })}
          </NavDropdown>
        </>
      );
    } else if (fetchDataState === "error") {
      return (
        <div>
          <Icon size={1} path={mdiAlertOctagonOutline} /> Error
        </div>
      );
    } else {
      return null;
    }
  }

  return (
    <div className="App">
      <Navbar
        fixed="top"
        expand={"sm"}
        className="mb-3"
        bg="light"
        variant="light"
      >
        <Container fluid>
          <Nav.Link onClick={() => navigate("/")} style={{ fontSize: "1.5rem" }}>Kucharka</Nav.Link>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm`} />
          <Navbar.Offcanvas id={`offcanvasNavbar-expand-sm`}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-sm`}>
                Kucharka
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                {getRecipesListDropdown()}
                <Nav.Link onClick={() => navigate("/ingredientList")}>
                  Ingredience
                </Nav.Link>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      <Outlet />
    </div>
  );
}

export default App;
