import CategoryExistsError from "#category/application/errors/category-exists.error";
import { EntityValidationError } from "#seedwork/domain/errors/validation-error";
import { CategoryInMemoryRepository } from "#category/infra/repository/category-in-memory.repository";
import CreateCategoryUseCase from "#category/application/use-cases/create-category.use-case";

let repository: CategoryInMemoryRepository;
let useCase: CreateCategoryUseCase.UseCase;

beforeEach(() => {
  repository = new CategoryInMemoryRepository();
  useCase = new CreateCategoryUseCase.UseCase(repository);
});

describe("CreateCategoryUseCase Unit Tests", () => {
  it("should create a category", async () => {
    const spyInsertMethod = jest.spyOn(repository, "insert");

    let output = await useCase.execute({ name: "Test 1" });
    expect(output).toStrictEqual({
      id: repository.items[0].id,
      name: "Test 1",
      description: null,
      is_active: true,
      created_at: repository.items[0].created_at,
    });
    expect(spyInsertMethod).toBeCalledTimes(1);

    output = await useCase.execute({
      name: "Test 2",
      description: "some description",
      is_active: false,
    });
    expect(output).toStrictEqual({
      id: repository.items[1].id,
      name: "Test 2",
      description: "some description",
      is_active: false,
      created_at: repository.items[1].created_at,
    });
    expect(spyInsertMethod).toBeCalledTimes(2);
  });

  it("should throw an error when create category without name", async () => {
    expect(() => useCase.execute({ name: "" })).rejects.toThrowError(
      "Entity Validation Error"
    );
    expect(() => useCase.execute({ name: "" })).rejects.toThrowError(
      EntityValidationError
    );
  });

  it("should throw an error when category name exits already", async () => {
    await useCase.execute({ name: "romance" });

    expect(useCase.execute({ name: "romance" })).rejects.toThrowError(
      new CategoryExistsError(
        "romance exists already in the categories collection"
      )
    );
    expect(repository.findAll()).resolves.toHaveLength(1);
  });
});
