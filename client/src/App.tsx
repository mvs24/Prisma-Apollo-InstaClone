import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Home from "./pages/Home/Home";
import Login from "./pages/Login/Login";
import Signup from "./pages/Signup/Signup";

function App() {
  return (
    <BrowserRouter>
      <Route path="/login" component={Login} />
      <Route path="/" exact component={Signup} />
      <Route path="/home" component={Home} />
    </BrowserRouter>
  );
}

export default App;
