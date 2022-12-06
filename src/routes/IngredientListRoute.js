import {useState, useEffect} from "react"
import {Container, Card } from "react-bootstrap";





function IngredientsList() {

  const [ingredientsLoadCall, setIngredientsLoadCall] = useState({
    state: "pending",
  });

  useEffect(() => {
    fetch(`http://localhost:3000/ingredient/list`,
      // `https://cookbook-server-nu.vercel.app/ingredient/list`, 
    {
      method: "GET",
    }).then(async (response) => {
      const responseJson = await response.json();
      if (response.status >= 400) {
        setIngredientsLoadCall({ state: "error", error: responseJson });
      } else {
        setIngredientsLoadCall({ state: "success", data: responseJson });
      }
    });
  }, []);


   const displayIngredients = () => { 
      if(ingredientsLoadCall.state === "success") { 
          return ingredientsLoadCall.data.map((item) => { 
            return <p>{item.name}</p>
          })
      }
   }

return (
  <Container fluid>
<Card className="col-12 col-sm-6 col-md-4 col-lg-4 col-xl-3">
{displayIngredients()}
</Card>
</Container>
)
  }
  
  export default IngredientsList;