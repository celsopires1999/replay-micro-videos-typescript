import { ValidationError } from "../../domain/errors/validation-error";

export class ValidatorRules {
  private constructor(private value: any, private property: string) {}

  static values(value: any, property: string) {
    return new ValidatorRules(value, property);
  }

  required(): Omit<this, "required"> {
    if (this.value === null || this.value === undefined || this.value === "") {
      throw new ValidationError(`The ${this.property} is required`);
    }
    return this;
  }

  string(): Omit<this, "string"> {
    if (!isEmpty(this.value) && typeof this.value !== "string") {
      throw new ValidationError(`The ${this.property} must be a string`);
    }
    return this;
  }

  maxLength(max: number): Omit<this, "maxLength"> {
    if (!isEmpty(this.value) && this.value.length > max) {
      throw new ValidationError(
        `The ${this.property} cannot be greater than ${max} characters`
      );
    }
    return this;
  }

  boolean(): Omit<this, "boolean"> {
    if (!isEmpty(this.value) && typeof this.value !== "boolean") {
      throw new ValidationError(`The ${this.property} must be a boolean`);
    }
    return this;
  }

  date(): Omit<this, "date"> {
    if (!isEmpty(this.value) && !(this.value instanceof Date)) {
      throw new ValidationError(
        `The ${this.property} must be an instance of Date`
      );
    }
    return this;
  }
}

export function isEmpty(value: any): boolean {
  return value === null || value === undefined;
}

export default ValidatorRules;
