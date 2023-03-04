export type User = {
  id: string;
  email: string;
  passwd: string;
  firstName: string;
  lastName: string;
  snapUrl: string;
  relations: [{ person: User; type: string }];
};
