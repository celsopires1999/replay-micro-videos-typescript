import Category, {
  CategoryProperties,
} from "#category/domain/entities/category";

describe("Category Integration Tests", () => {
  describe("validations with errors", () => {
    describe("name prop", () => {
      const arrange = [
        {
          name: null as any,
          message: {
            name: [
              "name should not be empty",
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          name: undefined as any,
          message: {
            name: [
              "name should not be empty",
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          name: "",
          message: {
            name: ["name should not be empty"],
          },
        },
        {
          name: 5,
          message: {
            name: [
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          name: true,
          message: {
            name: [
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          name: false,
          message: {
            name: [
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          name: "a".repeat(256),
          message: {
            name: ["name must be shorter than or equal to 255 characters"],
          },
        },
      ];
      test.each(arrange)(`when name prop is "$name"`, (i) => {
        expect(
          () => new Category({ name: i.name } as any)
        ).containsErrorMessages(i.message);
      });
    });
    describe("description prop", () => {
      const arrange = [
        {
          description: 5,
          message: {
            description: ["description must be a string"],
          },
        },
        {
          description: true,
          message: {
            description: ["description must be a string"],
          },
        },
      ];

      test.each(arrange)(`when description prop is "$description"`, (i) => {
        expect(
          () =>
            new Category({
              name: "some name",
              description: i.description,
            } as any)
        ).containsErrorMessages(i.message);
      });
    });

    describe("is_active prop", () => {
      const arrange = [
        {
          is_active: 5,
          message: {
            is_active: ["is_active must be a boolean value"],
          },
        },
        {
          is_active: 0,
          message: {
            is_active: ["is_active must be a boolean value"],
          },
        },
        {
          is_active: 1,
          message: {
            is_active: ["is_active must be a boolean value"],
          },
        },
        {
          is_active: "aaa",
          message: {
            is_active: ["is_active must be a boolean value"],
          },
        },
        {
          is_active: "",
          message: {
            is_active: ["is_active must be a boolean value"],
          },
        },
      ];

      test.each(arrange)(`when is_active prop is "$is_active"`, (i) => {
        expect(
          () =>
            new Category({
              name: "some name",
              is_active: i.is_active,
            } as any)
        ).containsErrorMessages(i.message);
      });
    });

    describe("should throw an error by updating", () => {
      const arrange = [
        {
          name: "",
          description: "",
          message: {
            name: ["name should not be empty"],
          },
        },
        {
          name: null,
          description: "",
          message: {
            name: [
              "name should not be empty",
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          name: undefined,
          description: "",
          message: {
            name: [
              "name should not be empty",
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          name: 5,
          description: "",
          message: {
            name: [
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          name: true,
          description: "",
          message: {
            name: [
              "name must be a string",
              "name must be shorter than or equal to 255 characters",
            ],
          },
        },
        {
          name: "a".repeat(256),
          description: "",
          message: {
            name: ["name must be shorter than or equal to 255 characters"],
          },
        },
        {
          name: "new name",
          description: true,
          message: {
            description: ["description must be a string"],
          },
        },
        {
          name: "new name",
          description: 5,
          message: {
            description: ["description must be a string"],
          },
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

      test.each(arrange)(
        `when name is "$name" and description is "$description"`,
        (i) => {
          expect(() =>
            entity.update(i.name as any, i.description as any)
          ).containsErrorMessages(i.message);
          expect(entity.name).toBe("some name");
          expect(entity.description).toBe("some description");
        }
      );
    });

    it("should throw an error by activating", () => {
      const entity = new Category({ name: "some name", is_active: false });
      entity["name"] = null;
      expect(() => entity.activate()).containsErrorMessages({
        name: [
          "name should not be empty",
          "name must be a string",
          "name must be shorter than or equal to 255 characters",
        ],
      });
    });
  });
  describe("successfull operations", () => {
    describe("should create a category", () => {
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

      test.each(arrange)("%#) when props are %o ", (i) => {
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
