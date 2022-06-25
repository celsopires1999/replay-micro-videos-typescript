import { DataType } from "sequelize-typescript";
import { CategoryModel } from "./category-model";
import { setupSequelize } from "#seedwork/infra/testing/helpers/db";

describe("CategoryModel Unit Tests", () => {
  setupSequelize({ models: [CategoryModel] });

  test("mapping attributes", () => {
    const attributesMap = CategoryModel.getAttributes();
    const attributes = Object.keys(CategoryModel.getAttributes());

    expect(attributes).toStrictEqual([
      "id",
      "name",
      "description",
      "is_active",
      "created_at",
    ]);

    expect(attributesMap.id).toMatchObject({
      field: "id",
      fieldName: "id",
      primaryKey: true,
      type: DataType.UUID(),
    });

    expect(attributesMap.name).toMatchObject({
      field: "name",
      fieldName: "name",
      allowNull: false,
      type: DataType.STRING(255),
    });

    expect(attributesMap.description).toMatchObject({
      field: "description",
      fieldName: "description",
      allowNull: true,
      type: DataType.TEXT(),
    });

    expect(attributesMap.is_active).toMatchObject({
      field: "is_active",
      fieldName: "is_active",
      allowNull: false,
      type: DataType.BOOLEAN(),
    });

    expect(attributesMap.created_at).toMatchObject({
      field: "created_at",
      fieldName: "created_at",
      allowNull: false,
      type: DataType.DATE(),
    });
  });

  test("create", async () => {
    const arrange = {
      id: "d0ecc323-77b6-45fa-972e-b3c9fa6d6320",
      name: "some name",
      description: "some description",
      is_active: true,
      created_at: new Date(),
    };

    const model = await CategoryModel.create(arrange);

    expect(model.toJSON()).toStrictEqual(arrange);
  });

  test("create with error", async () => {
    const arrange = {
      id: "d0ecc323-77b6-45fa-972e-b3c9fa6d6320",
      name: null,
      description: "some description",
      is_active: true,
      created_at: new Date(),
    };
    expect(CategoryModel.create(arrange)).rejects.toThrowError(
      `notNull Violation: CategoryModel.name cannot be null`
    );
  });
});
