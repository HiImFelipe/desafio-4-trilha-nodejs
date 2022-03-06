import { mocked } from "jest-mock";
import { compare } from "bcryptjs";
import { sign } from "jsonwebtoken";

import { fakeUsersRepository, makeAValidUser } from "../../../../shared/utils/tests/User";
import { AuthenticateUserUseCase } from "./AuthenticateUserUseCase";
import { IncorrectEmailOrPasswordError } from "./IncorrectEmailOrPasswordError";


jest.mock("bcryptjs");
jest.mock("jsonwebtoken");

const sut = new AuthenticateUserUseCase(fakeUsersRepository);

describe("Authenticate user", () => {
  it("should return user and token", async () => {
    const user = makeAValidUser();
    const token = "any_token";

    fakeUsersRepository.findByEmail.mockResolvedValue(user);

    mocked(compare).mockResolvedValue(true as never);
    mocked(sign).mockReturnValue(token as never);

    const result = await sut.execute({
      email: user.email,
      password: user.password,
    });

    expect(result).toEqual({
      user: {
        id: user.id,
        name: user.name,
        email: user.email,
      },
      token,
    });
    expect(result).toHaveProperty("token");
  });

  it("should not return user and token (user does not exist)", async () => {
    fakeUsersRepository.findByEmail.mockResolvedValue(undefined);

    const promise = sut.execute({
      email: "any_email",
      password: "any_password",
    });

    await expect(promise).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });

  it("should not return user and token (incorrect password)", async () => {
    const user = makeAValidUser();
    fakeUsersRepository.findByEmail.mockResolvedValue(user);

    mocked(compare).mockResolvedValue(false as never);

    const promise = sut.execute({
      email: "any_email",
      password: "any_password",
    });

    await expect(promise).rejects.toBeInstanceOf(IncorrectEmailOrPasswordError);
  });
});
