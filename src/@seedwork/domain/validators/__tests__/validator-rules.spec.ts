import { ValidationError } from "../../../domain/errors/validation-error";
import ValidatorRules from "../validator-rules";

type ExpectedRule = {
  value: any;
  property: string;
  rule: keyof ValidatorRules;
  error: ValidationError;
  params?: any[];
};

function assertIsInvalid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected);
  }).toThrowError(expected.error);
}

function assertIsValid(expected: ExpectedRule) {
  expect(() => {
    runRule(expected);
  }).not.toThrowError(expected.error);
}

function runRule({
  value,
  property,
  rule,
  params = [],
}: Omit<ExpectedRule, "error">) {
  const validator = ValidatorRules.values(value, property);
  const method = validator[rule] as (...args: any[]) => ValidatorRules;
  method.apply(validator, params);
}

describe("ValidatorRules Unit Tests", () => {
  test("values method", () => {
    const validator = ValidatorRules.values("some value", "field1");
    expect(validator["value"]).toBe("some value");
    expect(validator["property"]).toBe("field1");
    expect(validator).toBeInstanceOf(ValidatorRules);
  });

  describe("required validation rule", () => {
    test("with error", () => {
      const arrange = [null, undefined, ""];
      for (const item of arrange) {
        assertIsInvalid({
          value: item,
          property: "field1",
          rule: "required",
          error: new ValidationError("The field1 is required"),
        });
      }
    });
    test("without error", () => {
      const arrange = ["abc", 123, 0, true];
      for (const item of arrange) {
        assertIsValid({
          value: item,
          property: "field1",
          rule: "required",
          error: new ValidationError("The field1 is required"),
        });
      }
    });
  });

  describe("string validation rule", () => {
    test("with error", () => {
      const arrange = [{}, 5, true];
      for (const item of arrange) {
        assertIsInvalid({
          value: item,
          property: "field1",
          rule: "string",
          error: new ValidationError("The field1 must be a string"),
        });
      }
    });
    test("without error", () => {
      const arrange = ["abc", null, undefined];
      for (const item of arrange) {
        assertIsValid({
          value: item,
          property: "field1",
          rule: "required",
          error: new ValidationError("The field1 must be a string"),
        });
      }
    });
  });

  describe("maxLength validation rule", () => {
    test("with error", () => {
      const arrange = [{ value: "1234", max: 3 }];
      for (const item of arrange) {
        assertIsInvalid({
          value: item.value,
          property: "field1",
          rule: "maxLength",
          params: [item.max],
          error: new ValidationError(
            `The field1 cannot be greater than ${item.max} characters`
          ),
        });
      }
    });
    test("without error", () => {
      const arrange = [
        { value: "123", max: 3 },
        { value: null, max: 1 },
        { value: undefined, max: 1 },
      ];
      for (const item of arrange) {
        assertIsValid({
          value: item.value,
          property: "field1",
          rule: "maxLength",
          params: [item.max],
          error: new ValidationError(
            `The field1 cannot be greater than ${item.max} characters`
          ),
        });
      }
    });
  });

  describe("boolean validation rule", () => {
    test("with error", () => {
      const arrange = [{}, 5, "123"];
      for (const item of arrange) {
        assertIsInvalid({
          value: item,
          property: "field1",
          rule: "boolean",
          error: new ValidationError("The field1 must be a boolean"),
        });
      }
    });
    test("without error", () => {
      const arrange = [true, false, null, undefined];
      for (const item of arrange) {
        assertIsValid({
          value: item,
          property: "field1",
          rule: "boolean",
          error: new ValidationError("The field1 must be a boolean"),
        });
      }
    });
  });

  describe("date validation rule", () => {
    test("with error", () => {
      const arrange = [{}, 5, "123"];
      for (const item of arrange) {
        assertIsInvalid({
          value: item,
          property: "field1",
          rule: "date",
          error: new ValidationError("The field1 must be an instance of Date"),
        });
      }
    });
    test("without error", () => {
      const arrange = [new Date(), null, undefined];
      for (const item of arrange) {
        assertIsValid({
          value: item,
          property: "field1",
          rule: "date",
          error: new ValidationError("The field1 must be an instance of Date"),
        });
      }
    });
  });

  describe("validation error combining required, string and maxlength", () => {
    it("should throw required", () => {
      const validator = ValidatorRules.values(null, "field1");
      expect(() => validator.required().string().maxLength(5)).toThrowError(
        new ValidationError("The field1 is required")
      );
    });

    it("should throw string", () => {
      const validator = ValidatorRules.values(5, "field1");
      expect(() => validator.required().string().maxLength(5)).toThrowError(
        new ValidationError("The field1 must be a string")
      );
    });

    it("should throw max length", () => {
      const validator = ValidatorRules.values("aaaaaa", "field1");
      expect(() => validator.required().string().maxLength(5)).toThrowError(
        new ValidationError("The field1 cannot be greater than 5 characters")
      );
    });
  });

  describe("validation error combining required and boolean ", () => {
    it("should throw required", () => {
      const validator = ValidatorRules.values(null, "field1");
      expect(() => validator.required().boolean()).toThrowError(
        new ValidationError("The field1 is required")
      );
    });

    it("should throw boolean", () => {
      const validator = ValidatorRules.values(5, "field1");
      expect(() => validator.required().boolean()).toThrowError(
        new ValidationError("The field1 must be a boolean")
      );
    });
  });

  describe("successfull validation with combinations", () => {
    it("should be valid for string", () => {
      expect.assertions(0);
      ValidatorRules.values(null, "field1").string();
      ValidatorRules.values(undefined, "field1").string();
      ValidatorRules.values("aaaaa", "field1").required().string();
      ValidatorRules.values(null, "field1").string().maxLength(5);
      ValidatorRules.values(undefined, "field1").string().maxLength(5);
      ValidatorRules.values("aaaaa", "field1").required().string().maxLength(5);
    });

    it("should be valid for boolean", () => {
      expect.assertions(0);
      ValidatorRules.values(null, "field1").boolean();
      ValidatorRules.values(undefined, "field1").boolean();
      ValidatorRules.values(true, "field1").required().boolean();
      ValidatorRules.values(false, "field1").required().boolean();
    });
  });
});
