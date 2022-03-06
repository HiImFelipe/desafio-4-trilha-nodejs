import { mocked } from "jest-mock";
import { hash } from "bcryptjs";

import {
  fakeUsersRepository,
  makeAValidUser,
} from "../../../../shared/utils/tests/User";
import { CreateUserUseCase } from "./CreateUserUseCase";
import { CreateUserError } from "./CreateUserError";

jest.mock("bcryptjs");

const sut = new CreateUserUseCase(fakeUsersRepository);

describe("Create user", () => {
  it("should create a user", async () => {
    const user = makeAValidUser();
    const hashedPassword = "any_hash";

    fakeUsersRepository.findByEmail.mockResolvedValue(undefined);
    mocked(hash).mockResolvedValue(hashedPassword as never);
    fakeUsersRepository.create.mockResolvedValue({
      ...user,
      password: hashedPassword,
    });

    const result = await sut.execute(user);

    expect(result).toEqual({ ...user, password: hashedPassword });
  });

  it("should not create a user (user already exists)", async () => {
    const user = makeAValidUser();

    fakeUsersRepository.findByEmail.mockResolvedValue(user);

    const promise = sut.execute(user);

    await expect(promise).rejects.toBeInstanceOf(CreateUserError);
  });
});
