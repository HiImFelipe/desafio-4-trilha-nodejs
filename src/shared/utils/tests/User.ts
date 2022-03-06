import { User } from "../../../modules/users/entities/User";
import { ICreateUserDTO } from "../../../modules/users/useCases/createUser/ICreateUserDTO";

export const makeAValidUser = (data?: Partial<User>): Required<User> => {
  const user = new User();
  const defaultUserData = {
    id: "any_id",
    name: "any_name",
    email: "any_email",
    password: "any_password",
  };

  Object.assign(user, defaultUserData);
  Object.assign(user, data);

  return user as Required<User>;
};

export const fakeUsersRepository = {
  create: jest.fn<Promise<User>, [data: ICreateUserDTO]>(),
  findByEmail: jest.fn<Promise<User | undefined>, [email: string]>(),
  findById: jest.fn<Promise<User | undefined>, [user_id: string]>(),
};
