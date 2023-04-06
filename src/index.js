import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import "./index.css";
import App from "./App";
import reportWebVitals from "./reportWebVitals";

import RecipeDetailRoute from "./routes/RecipeDetailRoute";
import RecipeListRoute from "./routes/RecipeListRoute";
import IngredientListRoute from "./routes/IngredientListRoute";
import { UserProvider } from "./UserProvider";
import { RecipeEditedProvidert } from "./RecipeEditedContext";

const root = ReactDOM.createRoot(document.getElementById("root"));
root.render(
    <UserProvider>
      <RecipeEditedProvidert>
        <BrowserRouter>
          <Routes>
            <Route path="/" element={<App />}>
              <Route path="" element={<RecipeListRoute />} />
              <Route path="recipeDetail" element={<RecipeDetailRoute />} />
              <Route path="IngredientList" element={<IngredientListRoute />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </RecipeEditedProvidert>
    </UserProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
