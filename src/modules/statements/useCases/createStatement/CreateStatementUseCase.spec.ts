import {
  fakeStatementsRepository,
  makeAValidStatement,
} from "../../../../shared/utils/tests/Statement";
import {
  fakeUsersRepository,
  makeAValidUser,
} from "../../../../shared/utils/tests/User";
import { OperationType } from "../../entities/Statement";
import { CreateStatementError } from "./CreateStatementError";
import { CreateStatementUseCase } from "./CreateStatementUseCase";

describe("Create statement", () => {
  const sut = new CreateStatementUseCase(
    fakeUsersRepository,
    fakeStatementsRepository
  );

  it("should create a withdraw statement", async () => {
    const user = makeAValidUser();
    const statement = makeAValidStatement({
      type: OperationType.WITHDRAW,
      amount: 100,
    });

    fakeUsersRepository.findById.mockResolvedValue(user);
    fakeStatementsRepository.getUserBalance.mockResolvedValue({ balance: 100 });
    fakeStatementsRepository.create.mockResolvedValue(statement);

    const response = await sut.execute(statement);

    expect(response).toEqual(
      expect.objectContaining({
        ...statement,
      })
    );
  });

  it("should create a deposit statement", async () => {
    const user = makeAValidUser();
    const statement = makeAValidStatement({ type: OperationType.DEPOSIT });

    fakeUsersRepository.findById.mockResolvedValue(user);
    fakeStatementsRepository.create.mockResolvedValue(statement);

    const response = await sut.execute(statement);

    expect(response).toEqual(
      expect.objectContaining({
        ...statement,
      })
    );
  });

  it("should not create a withdraw statement (insufficient funds)", async () => {
    const user = makeAValidUser();
    const statement = makeAValidStatement({
      type: OperationType.WITHDRAW,
      amount: 100,
    });

    fakeUsersRepository.findById.mockResolvedValue(user);
    fakeStatementsRepository.getUserBalance.mockResolvedValue({ balance: 0 });

    await expect(sut.execute(statement)).rejects.toBeInstanceOf(
      CreateStatementError.InsufficientFunds
    );
  });

  it("should not create a statement (user not found)", async () => {
    const user = makeAValidUser();
    const statement = makeAValidStatement();

    fakeUsersRepository.findById.mockResolvedValue(undefined);

    await expect(sut.execute(statement)).rejects.toBeInstanceOf(
      CreateStatementError.UserNotFound
    );
  });
});
