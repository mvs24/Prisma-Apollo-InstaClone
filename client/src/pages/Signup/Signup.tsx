import React, { useState } from "react";
import { gql, useMutation } from "@apollo/client";
import { useHistory } from "react-router-dom";

import classes from "./Signup.module.css";
import Input from "../../shared/Input/Input";
import { SignupElement, SignupState } from "./types";
import { onChangeHandler } from "../../utils/onChangeHandler";
import Button from "../../shared/Button/Button";
import {
  SignupMutation,
  SignupMutationVariables,
} from "../../generated/SignupMutation";
import LoadingSpinner from "../../shared/LoadingSpinner/LoadingSpinner";
import ErrorModal from "../../shared/ErrorModal/ErrorModal";

const SIGN_UP_MUTATION = gql`
  mutation SignupMutation($data: UserInput!) {
    signup(data: $data) {
      user {
        name
        email
      }
      token
    }
  }
`;

const Signup = () => {
  const [signupState, setSignupState] = useState<SignupState>({
    name: {
      invalid: false,
      touched: false,
      value: "",
      id: "name",
      requirements: {
        required: true,
      },
    },
    lastname: {
      invalid: false,
      touched: false,
      value: "",
      id: "lastname",
      requirements: {
        required: true,
      },
    },
    email: {
      invalid: false,
      touched: false,
      value: "",
      id: "email",
      requirements: {
        isEmail: true,
        required: true,
      },
    },
    password: {
      invalid: false,
      touched: false,
      value: "",
      id: "password",
      requirements: {
        required: true,
        minlength: 6,
        maxlength: 30,
      },
    },
  });
  const [error, setError] = useState<string | undefined>();
  const [signupMutation, { loading }] = useMutation<
    SignupMutation,
    SignupMutationVariables
  >(SIGN_UP_MUTATION);

  const history = useHistory();

  const signupHandler = async (e: React.FormEvent<HTMLFormElement>) => {
    try {
      e.preventDefault();
      const { data } = await signupMutation({
        variables: {
          data: {
            name: signupState.name.value,
            lastname: signupState.lastname.value,
            email: signupState.email.value,
            password: signupState.password.value,
          },
        },
      });

      const { token } = data!.signup;
      localStorage.setItem("jwt", token);
      history.push("/home");
    } catch (error) {
      setError(error.message);
    }
  };

  const signupStateValues: SignupElement[] = Object.values(signupState);

  return (
    <div className={classes.container}>
      {loading && <LoadingSpinner />}
      {error && (
        <ErrorModal removeHandler={() => setError(undefined)}>
          {error}
        </ErrorModal>
      )}
      <form className={classes.signupContainer} onSubmit={signupHandler}>
        <h2 className={classes.heading2}>InstaCloneMV</h2>
        {signupStateValues.map((el: SignupElement) => (
          <div className={classes.inputContainer} key={el.id}>
            <Input
              invalid={el.invalid}
              touched={el.touched}
              value={el.value}
              placeholder={el.id.toUpperCase()}
              onChange={(e) => onChangeHandler(e, el, setSignupState)}
            />
          </div>
        ))}
        <div style={{ marginTop: 10 }}>
          <Button title="Sign up" onClick={signupHandler} />
        </div>
      </form>
    </div>
  );
};

export default Signup;
