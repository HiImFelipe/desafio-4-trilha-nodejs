import {
  fakeStatementsRepository,
  makeAValidStatement,
} from "../../../../shared/utils/tests/Statement";
import {
  fakeUsersRepository,
  makeAValidUser,
} from "../../../../shared/utils/tests/User";
import { GetBalanceError } from "./GetBalanceError";
import { GetBalanceUseCase } from "./GetBalanceUseCase";

const sut = new GetBalanceUseCase(
  fakeStatementsRepository,
  fakeUsersRepository
);

describe("Get balance", () => {
  it("should get a user balance", async () => {
    const user = makeAValidUser();
    const statement = makeAValidStatement();

    fakeUsersRepository.findById.mockResolvedValue(user);
    fakeStatementsRepository.getUserBalance.mockResolvedValue({
      balance: 100,
      statement: [statement],
    });

    const response = await sut.execute({ user_id: user.id });

    expect(response).toEqual({
      statement: [statement],
      balance: 100,
    });
  });

  it("should not get a user balance (user not found)", async () => {
    fakeUsersRepository.findById.mockResolvedValue(undefined);

    const promise = sut.execute({ user_id: "invalid_user_id" });

    await expect(promise).rejects.toBeInstanceOf(GetBalanceError);
  });
});
