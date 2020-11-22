export interface SignupState {
  name: SignupElement;
  lastname: SignupElement;
  email: SignupElement;
  password: SignupElement;
}

export interface SignupElement {
  invalid: Boolean;
  touched: Boolean;
  value: string;
  id: "name" | "email" | "lastname" | "password";
  requirements?: Requirements;
}

export interface Requirements {
  required: Boolean;
  minlength?: number;
  maxlength?: number;
  isEmail?: Boolean;
}
