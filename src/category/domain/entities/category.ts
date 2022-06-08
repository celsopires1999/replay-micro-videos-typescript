import ValidatorRules from "../../../@seedwork/domain/validators/validator-rules";
// import ClassValidatorFactory from "../../@seedwork/validators/category.validator";
import Entity from "../../../@seedwork/domain/entity/entity";
import UniqueEntityId from "../../../@seedwork/domain/value-objects/unique-entity-id.vo";

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
    this.props.is_active = false;
  }

  update(name: string, description: string): void {
    Category.validate({
      ...this.props,
      name,
      description,
    });
    this.props.name = name;
    this.props.description = description;
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
    // const validator = ClassValidatorFactory.create();
    // validator.validate(props);
    ValidatorRules.values(props.name, "name")
      .required()
      .string()
      .maxLength(255);
    ValidatorRules.values(props.description, "description").string();
    ValidatorRules.values(props.is_active, "is_active").boolean();
  }
}

export default Category;
