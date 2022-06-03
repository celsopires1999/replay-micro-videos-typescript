import { v4 as uuidv4 } from "uuid";

export interface CategoryProperties {
  name: string;
  description?: string;
  is_active?: boolean;
  created_at?: Date;
}
export class Category {
  private _id: string;

  constructor(public readonly props: CategoryProperties, id?: string) {
    this.id = id;
    this.name = this.props.name;
    this.description = this.props.description ?? null;
    this.is_active = this.props.is_active;
    this.created_at = this.props.created_at;
  }

  get id(): string {
    return this._id;
  }

  private set id(value: string) {
    this._id = value || uuidv4();
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
}

export default Category;
