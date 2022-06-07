import ValidationError from "../../@seedwork/errors/validation-error";
import Category, { CategoryProperties } from "./category";

describe("Category Integration Tests", () => {
  describe("validations with errors", () => {
    test("name prop", () => {
      const arrange = [
        { name: null, message: "The name is required" },
        { name: undefined, message: "The name is required" },
        { name: "", message: "The name is required" },
        { name: 5, message: "The name must be a string" },
        { name: true, message: "The name must be a string" },
        { name: true, message: "The name must be a string" },
        {
          name: "a".repeat(256),
          message: "The name cannot be greater than 255 characters",
        },
      ];
      arrange.forEach((i) => {
        expect(() => new Category({ name: i.name } as any)).toThrowError(
          new ValidationError(i.message)
        );
      });
    });
    test("description prop", () => {
      const arrange = [
        { description: 5, message: "The description must be a string" },
        { description: true, message: "The description must be a string" },
      ];

      arrange.forEach((i) => {
        expect(
          () =>
            new Category({
              name: "some name",
              description: i.description,
            } as any)
        ).toThrowError(new ValidationError(i.message));
      });
    });

    test("is_active prop", () => {
      const arrange = [
        { is_active: 5, message: "The is_active must be a boolean" },
        { is_active: 0, message: "The is_active must be a boolean" },
        { is_active: 1, message: "The is_active must be a boolean" },
        { is_active: "aaa", message: "The is_active must be a boolean" },
        { is_active: "", message: "The is_active must be a boolean" },
      ];

      arrange.forEach((i) => {
        expect(
          () =>
            new Category({
              name: "some name",
              is_active: i.is_active,
            } as any)
        ).toThrowError(new ValidationError(i.message));
      });
    });

    it("should throw an error by updating", () => {
      const arrange = [
        { name: "", description: "", message: "The name is required" },
        { name: null, description: "", message: "The name is required" },
        { name: undefined, description: "", message: "The name is required" },
        { name: 5, description: "", message: "The name must be a string" },
        { name: true, description: "", message: "The name must be a string" },
        { name: "", description: "", message: "The name is required" },
        {
          name: "a".repeat(256),
          description: "",
          message: "The name cannot be greater than 255 characters",
        },
        {
          name: "new name",
          description: true,
          message: "The description must be a string",
        },
        {
          name: "new name",
          description: 5,
          message: "The description must be a string",
        },
      ];

      const entity = new Category({
        name: "some name",
        description: "some description",
      });
      expect(entity.props).toMatchObject({
        name: "some name",
        description: "some description",
      });

      arrange.forEach((i) => {
        expect(() =>
          entity.update(i.name as any, i.description as any)
        ).toThrowError(new ValidationError(i.message));
        expect(entity.name).toBe("some name");
        expect(entity.description).toBe("some description");
      });
    });

    it("should throw an error by activating", () => {
      const entity = new Category({ name: "some name", is_active: false });
      entity["name"] = null;
      expect(() => entity.activate()).toThrowError(
        new ValidationError("The name is required")
      );
    });
  });
  describe("successfull operations", () => {
    it("should create a category", () => {
      const arrange: CategoryProperties[] = [
        { name: "some name" },
        { name: "some name", description: "some description" },
        { name: "some name", description: "some description", is_active: true },
        {
          name: "some name",
          description: "some description",
          is_active: false,
        },
        {
          name: "some name",
          description: "some description",
          is_active: false,
          created_at: new Date(),
        },
      ];

      arrange.forEach((i) => {
        const entity = new Category({
          name: i.name,
          description: i.description,
          is_active: i.is_active,
          created_at: i.created_at,
        });
        expect(entity.props).toMatchObject(i);
        i.description
          ? expect(entity.description).toBe(i.description)
          : expect(entity.description).toBeNull();
        i.is_active === undefined
          ? expect(entity.is_active).toBeTruthy()
          : expect(entity.is_active).toBe(i.is_active);
        i.created_at === undefined
          ? expect(entity.created_at).toBeInstanceOf(Date)
          : expect(entity.created_at).toBe(i.created_at);
      });
    });

    it("should activate and deactivate a category", () => {
      const entity = new Category({ name: "some name", is_active: false });
      entity.activate();
      expect(entity.is_active).toBeTruthy();
      entity.deactivate();
      expect(entity.is_active).toBeFalsy();
    });

    it("should update a category", () => {
      const entity = new Category({ name: "some name" });
      entity.update("changed name", "changed description");
      expect(entity.name).toBe("changed name");
      expect(entity.description).toBe("changed description");
      entity.update("changed name", null);
      expect(entity.name).toBe("changed name");
      expect(entity.description).toBeNull();
    });
  });
});
