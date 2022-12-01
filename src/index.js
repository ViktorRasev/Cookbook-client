import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";
import HomeRoute from "./routes/HomeRoute";
import RecipeDetailRoute from "./routes/RecipeDetailRoute";
import RecipeListRoute from "./routes/RecipeListRoute";
import IngredientListRoute from "./routes/IngredientListRoute";
import { UserProvider } from "./UserProvider";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
  <React.StrictMode>
    <UserProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<App />}>
            <Route path="" element={<RecipeListRoute />} />
            <Route path="recipeDetail" element={<RecipeDetailRoute />} />
            <Route path="HomeRoute" element={<HomeRoute />} />
            <Route path="IngredientList" element={<IngredientListRoute />} />
          </Route>
        </Routes>
      </BrowserRouter>
    </UserProvider>
  </React.StrictMode>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
