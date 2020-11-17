export const restrictTo = (userRole: string, ...roles: string[]): void => {
  if (!roles.includes(userRole)) {
    throw new Error("You are not authorized to do this action!");
  }
};
