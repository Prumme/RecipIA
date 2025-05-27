export interface User {
  Username: string;
  Password: string;
  Email: string;
}

export function hidePassword(user: User): User {
  return {
    ...user,
    Password: "********",
  };
}
