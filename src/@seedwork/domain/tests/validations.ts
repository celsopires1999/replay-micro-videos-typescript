import ClassValidatorFields from "../validators/class-validator-fields";
import { FieldsError } from "../validators/validator-fields-interface";
// import { objectContaining } from "expect";

type Received = { validator: ClassValidatorFields<any>; data: any };

expect.extend({
  containsErrorMessages(received: Received, expected: FieldsError) {
    const { validator, data } = received;
    const isValid = validator.validate(data);

    if (isValid) {
      return {
        pass: false,
        message: () => "The data is valid",
      };
    }

    const isMatch = expect
      .objectContaining(expected)
      .asymmetricMatch(validator.errors);

    return isMatch
      ? { pass: true, message: () => "" }
      : {
          pass: false,
          message: () =>
            `The validation errors does not contain ${JSON.stringify(
              expected
            )}. Current: ${JSON.stringify(validator.errors)}`,
        };
  },
});
