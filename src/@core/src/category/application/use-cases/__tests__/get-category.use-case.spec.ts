import NotFoundError from "#seedwork/domain/errors/not-found.error";
import Category from "#category/domain/entities/category";
import { CategoryInMemoryRepository } from "#category/infra/repository/category-in-memory.repository";
import { CategoryOutput } from "#category/application/use-cases/dto/category-output.dto";
import GetCategoryUseCase from "#category/application/use-cases/get-category.use-case";

let repository: CategoryInMemoryRepository;
let useCase: GetCategoryUseCase.UseCase;

beforeEach(() => {
  repository = new CategoryInMemoryRepository();
  useCase = new GetCategoryUseCase.UseCase(repository);
});

describe("GetCategoryUseCase Unit Tests", () => {
  it("should throw an error when category id has not been found", async () => {
    expect(useCase.execute({ id: "fake id" })).rejects.toThrowError(
      new NotFoundError(`Entity not found using ID fake id`)
    );
  });
  it("should get a category", async () => {
    const entity = new Category({ name: "some category" });
    await repository.insert(entity);

    const spyFindById = jest.spyOn(repository, "findById");

    expect(useCase.execute({ id: entity.id })).resolves.toStrictEqual({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    } as CategoryOutput);

    expect(spyFindById).toHaveBeenCalledTimes(1);
  });
});
