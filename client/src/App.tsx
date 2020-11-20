import React from "react";
import { BrowserRouter, Route } from "react-router-dom";

import Home from "./pages/Home/Home";

function App() {
  return (
    <BrowserRouter>
      <Route path="/" component={Home} />
    </BrowserRouter>
  );
}

export default App;
