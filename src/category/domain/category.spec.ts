import { Category, CategoryProperties } from "./category";
import { omit } from "lodash";
import { validate as uuidValidate } from "uuid";

describe("Category Unit Test", () => {
  test("constructor of category with all props", () => {
    let props: CategoryProperties = {
      name: "new category",
      description: "new description",
      is_active: true,
      created_at: new Date(),
    };

    let entity = new Category(props);

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
      { name: "new category", id: "" },
      { name: "new category", id: undefined },
      { name: "new category", id: null },
      { name: "new category", id: "8105290d-2b16-499d-aa61-5c252cf5c7d6" },
    ];

    arrange.forEach((item) => {
      const entity = new Category({ name: item.name }, item.id);
      expect(entity.id).not.toBeNull();
      expect(uuidValidate(entity.id)).toBeTruthy();
    });
  });
});
