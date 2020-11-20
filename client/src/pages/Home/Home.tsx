import React from "react";
import Button from "../../shared/Button/Button";
import { ButtonState } from "../../shared/Button/Button";

import classes from "./Home.module.css";

function Home() {
  return (
    <>
      <Button
        title="Click me"
        color="white"
        backgroundColor="white"
        onClick={() => {}}
        state={ButtonState.pink}
      />
    </>
  );
}

export default Home;
