/* tslint:disable */
/* eslint-disable */
// @generated
// This file was automatically generated and should not be edited.

import { UserInput } from "./globalTypes";

// ====================================================
// GraphQL mutation operation: SignupMutation
// ====================================================

export interface SignupMutation_signup_user {
  __typename: "User";
  name: string;
  email: string | null;
}

export interface SignupMutation_signup {
  __typename: "AuthPayload";
  user: SignupMutation_signup_user | null;
  token: string;
}

export interface SignupMutation {
  signup: SignupMutation_signup;
}

export interface SignupMutationVariables {
  data: UserInput;
}
