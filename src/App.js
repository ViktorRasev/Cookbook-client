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
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import styles from "./css/App.module.css"


function App() {
  const {isAuthorized, setIsAuthorized}  = useContext(UserContext);
  const [recipeList, setRecipeList] = useState([])
  const [fetchDataState, setFetchDataState] = useState("loading")
  const [showOffCanvas, setShowOffCanvas] = useState(false)
  const { recipeEdited } = useContext(RecipeEditedContext);

  let navigate = useNavigate();

  const handleShowOffCanvas = () => setShowOffCanvas(true)
  const handleCloseOffCanvas = () => setShowOffCanvas(false)

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


  const navigateHome = () => {
    navigate("/")
    handleCloseOffCanvas()
  }
  const navigateToIngredients = () => {
    navigate("/ingredientList")
    handleCloseOffCanvas()
  }
  const navigateToRecipe = (recipeId) => {
    navigate("/recipeDetail?id=" + recipeId)
    handleCloseOffCanvas()
  }
  const switchAuthorizedState = () => {
    setIsAuthorized(!isAuthorized)
    handleCloseOffCanvas()
  }
  function getRecipesListDropdown() {
    if (fetchDataState === "loading") {
      return (
        <Nav.Link disabled={true}>
          <Icon size={2} path={mdiLoading} spin={true} /> Recipes List
        </Nav.Link>
      );
    } else if (fetchDataState === "success") {
      return (
          <NavDropdown title="Vyberte recept" id="navbarScrollingDropdown">
            {recipeList.map((recipe) => {
              return (
                <NavDropdown.Item
                  className={styles.dropdown_item}
                  key={recipe.id}
                  onClick={() => navigateToRecipe(recipe.id)}
                >
                  {recipe.name}
                </NavDropdown.Item>
              );
            })}
          </NavDropdown>
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
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm`} onClick={handleShowOffCanvas}/>
          <Navbar.Offcanvas id={`offcanvasNavbar-expand-sm`} show={showOffCanvas} >
            <Offcanvas.Header closeButton onHide={handleCloseOffCanvas}>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-sm`} onClick={navigateHome}>
                Kucharka
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                {getRecipesListDropdown()}
                <Nav.Link onClick={navigateToIngredients}>
                  Ingredience
                </Nav.Link>
                <NavLink onClick={switchAuthorizedState}>
                  {isAuthorized ? "Přihlášen" : "Nepřihlášen"}
                </NavLink>
              </Nav>
            </Offcanvas.Body>
          </Navbar.Offcanvas>
        </Container>
      </Navbar>
      <Outlet />
      <ToastContainer autoClose={2000}/>
    </div>
  );
}

export default App;




