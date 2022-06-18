import { EntityValidationError } from "#seedwork/domain/errors/validation-error";
import Entity from "#seedwork/domain/entity/entity";
import UniqueEntityId from "#seedwork/domain/value-objects/unique-entity-id.vo";
import CategoryValidatorFactory from "#category/domain/validators/category.validator";

export interface CategoryProperties {
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
}
export class Category extends Entity<CategoryProperties> {
  constructor(props: CategoryProperties, id?: UniqueEntityId) {
    Category.validate(props);
    super(props, id);
    this.name = this.props.name;
    this.description = this.props.description;
    this.is_active = this.props.is_active;
    this.created_at = this.props.created_at;
  }

  activate(): void {
    Category.validate({
      ...this.props,
      is_active: true,
    });
    this.props.is_active = true;
  }

  deactivate(): void {
    Category.validate({
      ...this.props,
      is_active: false,
    });
    this.is_active = false;
  }

  update(name: string, description: string): void {
    Category.validate({
      ...this.props,
      name,
      description,
    });
    this.name = name;
    this.description = description;
  }

  get name(): string {
    return this.props.name;
  }

  private set name(value: string) {
    this.props.name = value;
  }

  get description(): string {
    return this.props.description;
  }

  private set description(value: string) {
    this.props.description = value ?? null;
  }

  get is_active(): boolean {
    return this.props.is_active;
  }

  private set is_active(value: boolean) {
    this.props.is_active = value ?? true;
  }

  get created_at(): Date {
    return this.props.created_at;
  }

  set created_at(value: Date) {
    this.props.created_at = value ?? new Date();
  }

  static validate(props: Omit<CategoryProperties, "created_at">) {
    const validator = CategoryValidatorFactory.create();
    const isValid = validator.validate(props);
    if (!isValid) {
      throw new EntityValidationError(validator.errors);
    }
  }
}

export default Category;
