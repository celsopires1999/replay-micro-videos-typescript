import { Category } from "#category/domain";
import { UniqueEntityId } from "#seedwork/domain";
import { LoadEntityError } from "#seedwork/domain/errors/load-entity.error";
import { setupSequelize } from "#seedwork/infra";
import { CategoryModelMapper } from "./category-mapper";
import { CategoryModel } from "./category-model";

describe("CategorySequelizeMapper Unit Tests", () => {
  setupSequelize({ models: [CategoryModel] });

  it("should throw an error when model is invalid", () => {
    const model = CategoryModel.build({
      id: "d3f14e80-3060-496b-a125-ef75fdcd053d",
    });
    try {
      CategoryModelMapper.toEntity(model);
      fail("The category has not thrown a LoadEntityError");
    } catch (e) {
      expect(e).toBeInstanceOf(LoadEntityError);
      expect(e.error).toMatchObject({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    }
  });

  it("should throw a generic error", () => {
    const model = CategoryModel.build({
      id: "d3f14e80-3060-496b-a125-ef75fdcd053d",
    });

    const error = new Error("Generic Error");

    const spyValidate = jest
      .spyOn(Category, "validate")
      .mockImplementation(() => {
        throw error;
      });

    expect(() => CategoryModelMapper.toEntity(model)).toThrowError(error);
    expect(spyValidate).toHaveBeenCalled();
    spyValidate.mockRestore();
  });

  it("should convert a category model into a category entity", () => {
    const created_at = new Date();
    const model = CategoryModel.build({
      id: "d3f14e80-3060-496b-a125-ef75fdcd053d",
      name: "some name",
      description: "some description",
      is_active: true,
      created_at,
    });

    const entity = CategoryModelMapper.toEntity(model);
    expect(entity.toJSON()).toStrictEqual(
      new Category(
        {
          name: "some name",
          description: "some description",
          is_active: true,
          created_at,
        },
        new UniqueEntityId("d3f14e80-3060-496b-a125-ef75fdcd053d")
      ).toJSON()
    );
  });

  it("should throw an error when model cannot load a valid category", () => {
    const model = CategoryModel.build({
      id: "d3f14e80-3060-496b-a125-ef75fdcd053d",
      name: "",
      description: "some description",
      is_active: true,
      created_at: new Date(),
    });
    expect(() => CategoryModelMapper.toEntity(model)).toThrowError(
      "An entity could not be loaded"
    );
  });
});
