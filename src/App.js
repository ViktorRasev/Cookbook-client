import React, { useState, useEffect, useContext } from "react";
import "./App.css";


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

function App() {
  const { isAuthorized } = useContext(UserContext);
  const [cookbookLoadCall, setCookbookLoadCall] = useState({
    state: "pending",
  });

  let navigate = useNavigate();

  useEffect(() => {
    fetch(`http://localhost:3000/recipe/list`, {
      method: "GET",
    }).then(async (response) => {
      const responseJson = await response.json();
      if (response.status >= 400) {
        setCookbookLoadCall({ state: "error", error: responseJson });
      } else {
        setCookbookLoadCall({ state: "success", data: responseJson });
      }
    });
  }, []);

  function getRecipesListDropdown() {
        const isPending = cookbookLoadCall.state === "pending";
    const isLoaded = cookbookLoadCall.state === "success";
    const isError = cookbookLoadCall.state === "error";

    if (isPending) {
      return (
        <Nav.Link disabled={true}>
          <Icon size={2} path={mdiLoading} spin={true} /> Recipes List
        </Nav.Link>
      );
    } else if (isLoaded) {
      return (
        <>
          <NavLink>{isAuthorized ? "Přihlášen" : "Nepřihlášen"}</NavLink>
          <NavDropdown title="Select Recipe" id="navbarScrollingDropdown">
            {cookbookLoadCall.data.map((singleRecipe) => {
              return (
                <NavDropdown.Item
                  key={singleRecipe.id}
                  onClick={() =>
                    navigate("/recipeDetail?id=" + singleRecipe.id)
                  }
                >
                  {singleRecipe.name}
                </NavDropdown.Item>
              );
            })}
          </NavDropdown>
        </>
      );
    } else if (isError) {
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
          <Navbar.Brand onClick={() => navigate("/")}>Kucharka</Navbar.Brand>
          <Navbar.Toggle aria-controls={`offcanvasNavbar-expand-sm`} />
          <Navbar.Offcanvas id={`offcanvasNavbar-expand-sm`}>
            <Offcanvas.Header closeButton>
              <Offcanvas.Title id={`offcanvasNavbarLabel-expand-sm`}>
                Simple School
              </Offcanvas.Title>
            </Offcanvas.Header>
            <Offcanvas.Body>
              <Nav className="justify-content-end flex-grow-1 pe-3">
                {getRecipesListDropdown()}
                <Nav.Link onClick={() => navigate("/recipeList")}>
                  Recepty
                </Nav.Link>
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
