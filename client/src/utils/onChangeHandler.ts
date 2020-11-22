import {
  Requirements,
  SignupElement,
  SignupState,
} from "../pages/Signup/types";

const isInputValid = (
  value: string,
  requirements: Requirements | undefined
): Boolean => {
  let valid = true;
  if (!requirements) return true;

  if (requirements.required) {
    valid = valid && value !== "";
  }
  if (requirements.minlength) {
    valid = valid && value.length >= requirements.minlength;
  }

  if (requirements.maxlength) {
    valid = valid && value.length <= requirements.maxlength;
  }
  if (requirements.isEmail) {
    valid = valid && !!value.match(/\S+@\S+\.\S+/);
  }
  return valid;
};

export const onChangeHandler = (
  e: React.ChangeEvent<HTMLInputElement>,
  inputIdentifier: SignupElement,
  setSignupState: Function
): void => {
  const value = e.target.value;

  setSignupState(
    (prevState: SignupState): SignupState => {
      return {
        ...prevState,
        [inputIdentifier.id]: {
          ...prevState[inputIdentifier.id],
          value,
          touched: true,
          invalid: !isInputValid(value, inputIdentifier.requirements),
        },
      };
    }
  );
};
