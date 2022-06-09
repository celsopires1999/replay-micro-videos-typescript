import { CategoryProperties } from "../entities/category";
import CategoryValidatorFactory, {
  CategoryValidator,
} from "./category.validator";

let validator: CategoryValidator;

beforeEach(() => {
  validator = CategoryValidatorFactory.create();
});

describe("CategoryValidator Tests version 2", () => {
  it("shoud not validate", () => {
    let isValid = validator.validate(null);
    //@ts-ignore
    expect({ validator, data: null }).containsErrorMessages({
      name: [
        "name should not be empty",
        "name must be a string",
        "name must be shorter than or equal to 255 characters",
      ],
    });
  });
});

// describe("CategoryValidator Tests version 1", () => {
//   it("shoud not validate props", () => {
//     type ArrangeProps = {
//       data: any;
//       errors: any;
//     };
//     const arrange: ArrangeProps[] = [
//       {
//         data: null,
//         errors: {
//           name: [
//             "name should not be empty",
//             "name must be a string",
//             "name must be shorter than or equal to 255 characters",
//           ],
//         },
//       },
//       {
//         data: { name: "" },
//         errors: {
//           name: ["name should not be empty"],
//         },
//       },
//       {
//         data: {
//           name: "t".repeat(256),
//           description: 5,
//           is_active: 0,
//           created_at: "today",
//         },
//         errors: {
//           name: ["name must be shorter than or equal to 255 characters"],
//           description: ["description must be a string"],
//           is_active: ["is_active must be a boolean value"],
//           created_at: ["created_at must be a Date instance"],
//         },
//       },
//     ];

//     for (const i of arrange) {
//       expect(validator.validate(i.data)).toBeFalsy();
//       expect(validator.validatedData).toBeNull();
//       expect(validator.errors).toStrictEqual(i.errors);
//     }
//   });

//   it("should validate props", () => {
//     const props: CategoryProperties = {
//       name: "some name",
//       description: "some description",
//       is_active: false,
//       created_at: new Date(),
//     };
//     expect(validator.validate(props)).toBeTruthy();
//   });
// });
