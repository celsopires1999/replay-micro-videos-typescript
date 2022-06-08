import { Category, CategoryProperties } from "../entities/category";
import { omit } from "lodash";
import { validate as uuidValidate } from "uuid";
import UniqueEntityId from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";

describe("Category Unit Test", () => {
  beforeEach(() => {
    Category.validate = jest.fn();
  });
  test("constructor of category with all props", () => {
    let props: CategoryProperties = {
      name: "new category",
      description: "new description",
      is_active: true,
      created_at: new Date(),
    };

    let entity = new Category(props);

    expect(Category.validate).toHaveBeenCalled();
    expect(entity.props).toStrictEqual(props);
    expect(entity.name).toBeTruthy();
    expect(entity.description).toBe(props.description);
    expect(entity.is_active).toBe(props.is_active);
    expect(entity.created_at).toBe(props.created_at);
  });

  test("constructor with name only", () => {
    const entity = new Category({ name: "new category" });

    expect(entity.name).toBe("new category");
    expect(entity.description).toBeNull();
    expect(entity.is_active).toBeTruthy();
    expect(entity.created_at).toBeInstanceOf(Date);
    expect(omit(entity.props, "created_at")).toStrictEqual({
      name: "new category",
      description: null,
      is_active: true,
    });
    expect(entity.props).toMatchObject({
      name: "new category",
    });
  });

  test("constructor with name and description only", () => {
    const entity = new Category({
      name: "new category",
      description: "new description",
    });

    expect(entity.name).toBe("new category");
    expect(entity.description).toBe("new description");
    expect(entity.is_active).toBeTruthy();
    expect(entity.created_at).toBeInstanceOf(Date);
    expect(omit(entity.props, "created_at")).toStrictEqual({
      name: "new category",
      description: "new description",
      is_active: true,
    });
    expect(entity.props).toMatchObject({
      name: "new category",
      description: "new description",
    });
  });

  test("constructor with name, description and is_active equal false", () => {
    const entity = new Category({
      name: "new category",
      description: "new description",
      is_active: false,
    });

    expect(entity.name).toBe("new category");
    expect(entity.description).toBe("new description");
    expect(entity.is_active).toBeFalsy();
    expect(entity.created_at).toBeInstanceOf(Date);
    expect(omit(entity.props, "created_at")).toStrictEqual({
      name: "new category",
      description: "new description",
      is_active: false,
    });
    expect(entity.props).toMatchObject({
      name: "new category",
      description: "new description",
      is_active: false,
    });
  });

  test("constructor with name, description and is_active equal true", () => {
    const entity = new Category({
      name: "new category",
      description: "new description",
      is_active: true,
    });

    expect(entity.name).toBe("new category");
    expect(entity.description).toBe("new description");
    expect(entity.is_active).toBeTruthy();
    expect(entity.created_at).toBeInstanceOf(Date);
    expect(omit(entity.props, "created_at")).toStrictEqual({
      name: "new category",
      description: "new description",
      is_active: true,
    });
    expect(entity.props).toMatchObject({
      name: "new category",
      description: "new description",
      is_active: true,
    });
  });

  test("getter and setter of name prop", () => {
    const entity = new Category({ name: "initial" });
    expect(entity.name).toBe("initial");
    entity["name"] = "changed";
    expect(entity.name).toBe("changed");
  });

  test("getter and setter of description prop", () => {
    const entity = new Category({ name: "initial" });
    expect(entity.description).toBeNull();
    entity["description"] = "changed";
    expect(entity.description).toBe("changed");
  });

  test("getter and setter of is_active prop", () => {
    const entity = new Category({ name: "initial" });
    expect(entity.is_active).toBeTruthy();
    entity["is_active"] = false;
    expect(entity.is_active).toBeFalsy();
  });

  test("getter and setter of created_at prop", () => {
    const entity = new Category({ name: "initial" });
    expect(entity.created_at).toBeInstanceOf(Date);
    const now = new Date();
    entity["created_at"] = now;
    expect(entity.created_at).toBe(now);
  });

  test("id prop", () => {
    const arrange = [
      { name: "new category", id: new UniqueEntityId("") },
      { name: "new category", id: new UniqueEntityId(undefined) },
      { name: "new category", id: new UniqueEntityId(null) },
      {
        name: "new category",
        id: new UniqueEntityId("8105290d-2b16-499d-aa61-5c252cf5c7d6"),
      },
    ];

    arrange.forEach((item) => {
      const entity = new Category({ name: item.name }, item.id);
      expect(entity.id).not.toBeNull();
      expect(uuidValidate(entity.id)).toBeTruthy();
    });
  });

  it("should activate a category", () => {
    const entity = new Category({ name: "some name", is_active: false });
    expect(entity.is_active).toBeFalsy();
    entity.activate();
    expect(entity.is_active).toBeTruthy();
    expect(Category.validate).toHaveBeenCalledTimes(2);
  });

  it("should deactivate a category", () => {
    const entity = new Category({ name: "some name", is_active: true });
    expect(entity.is_active).toBeTruthy();
    entity.deactivate();
    expect(entity.is_active).toBeFalsy();
    expect(Category.validate).toHaveBeenCalledTimes(2);
  });

  it("should update a category", () => {
    const entity = new Category({
      name: "some name",
      description: "some description",
    });
    expect(entity.name).toBe("some name");
    expect(entity.description).toBe("some description");
    expect(entity.props).toMatchObject({
      name: "some name",
      description: "some description",
    });

    entity.update("new name", "new description");
    expect(entity.name).toBe("new name");
    expect(entity.description).toBe("new description");
    expect(entity.props).toMatchObject({
      name: "new name",
      description: "new description",
    });
    expect(Category.validate).toHaveBeenCalledTimes(2);
  });
});
