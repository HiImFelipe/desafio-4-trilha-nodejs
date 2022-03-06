import { ShowUserProfileError } from "./ShowUserProfileError";
import { ShowUserProfileUseCase } from "./ShowUserProfileUseCase";
import {
  fakeUsersRepository,
  makeAValidUser,
} from "../../../../shared/utils/tests/User";

const sut = new ShowUserProfileUseCase(fakeUsersRepository);

describe("Show user profile", () => {
  it("should show user profile", async () => {
    const user = makeAValidUser();

    fakeUsersRepository.findById.mockResolvedValue(user);

    const result = await sut.execute(user.id);

    expect(result).toEqual(user);
  });

  it('should not show user profile (user not found)', async () => {
    fakeUsersRepository.findById.mockResolvedValue(undefined);

    const promise = sut.execute("any_id");

    await expect(promise).rejects.toBeInstanceOf(ShowUserProfileError);
  })
});
