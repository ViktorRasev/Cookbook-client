import React, { useState, useEffect, useContext } from "react";
import "./App.css";
import { db } from "./utils/firebase"
import { collection, addDoc, getDocs } from "firebase/firestore"
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
  const {isAuthorized, setIsAuthorized}  = useContext(UserContext);
  const [cookbookLoadCall, setCookbookLoadCall] = useState({
    state: "pending",
  });

  let navigate = useNavigate();

  // FIREBASE TEST
  const [name, setName] = useState('')
  const [age, setAge] = useState('')
  const [newNames, setNewNames] = useState([])
  const saveName = (e) => {
    e.preventDefault()
    setName(e.target.value)
  }
  const saveAge = (e) => {
    e.preventDefault()
    setAge(e.target.value)

    console.log(age)
  }

  const handleFirebaseSubmit = () => {
    addFirebaseData()

    setAge("")
    setName("")

  }

  // GET REQUEST
  const fetchPost = async () => {

    await getDocs(collection(db, "names"))
        .then((querySnapshot)=>{
          const newData = querySnapshot.docs
              .map((doc) => ({...doc.data(), id:doc.id }));
          setNewNames(newData);
          console.log(newNames, "newName");
          console.log(newData, "newData");
        })

  }

  useEffect(() => {
    fetchPost()
  }, [])

  // POST REQUEST
  const addFirebaseData = async () => {
    try{
    const namesRef = await addDoc(collection(db, 'names'), {
      names: name,
    })
    const agesRef = await addDoc(collection(db, "ages"), {
      ages: age,
    })
    console.log("Document written with ID", namesRef.id, agesRef.id)
    } catch(e) {
      console.error("Error adding document", e)
    }
  }

  useEffect(() => {
    fetch(`https://cookbook-server-gamma.vercel.app/recipe/list`, {
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
          <NavLink onClick={() => setIsAuthorized(!isAuthorized)}>
            {isAuthorized ? "Přihlášen" : "Nepřihlášen"}
          </NavLink>
          <NavDropdown title="Vyberte recept" id="navbarScrollingDropdown">
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
      <div>
        <h1>Hello WOrld</h1>
        <input type="text" value={name} onChange={(e) => saveName(e)}/>
        <input type="number" value={age} onChange={(e) => saveAge(e)}/>
        <button onClick={handleFirebaseSubmit}>SendData to Firebase</button>
        <div>
          <ol>
          {newNames.map((singleName) => {
            return <li>{singleName.names}</li>
          })}
          </ol>
        </div>
      </div>
    </div>
  );
}

export default App;
