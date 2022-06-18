import NotFoundError from "#seedwork/domain/errors/not-found.error";
import Category from "#category/domain/entities/category";
import { CategoryInMemoryRepository } from "#category/infra/repository/category-in-memory.repository";
import DeleteCategoryUseCase from "#category/application/use-cases/delete-category.use-case";

let repository: CategoryInMemoryRepository;
let useCase: DeleteCategoryUseCase.UseCase;
beforeEach(() => {
  repository = new CategoryInMemoryRepository();
  useCase = new DeleteCategoryUseCase.UseCase(repository);
});

describe("DeleteCategoryUseCase Unit Tests", () => {
  it("should throw an error when id is not found", async () => {
    const spyDelete = jest.spyOn(repository, "findById");
    expect(useCase.execute({ id: "fake-id" })).rejects.toThrow(
      new NotFoundError("Entity not found using ID fake-id")
    );
    expect(spyDelete).toBeCalled();
  });

  it("should delete category", async () => {
    const spyDelete = jest.spyOn(repository, "delete");
    const entity = new Category({ name: "Movie" });
    repository.items = [entity];

    await useCase.execute({ id: entity.id });
    expect(repository.items).toHaveLength(0);
    expect(spyDelete).toHaveBeenCalledTimes(1);
  });
});
