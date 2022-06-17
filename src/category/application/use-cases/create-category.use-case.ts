import UseCase from "../../../@seedwork/application/use-case";
import Category from "../../domain/entities/category";
import CategoryRepository from "../../domain/repository/category-repository";
import CategoryExistsError from "../errors/category-exists.error";
import {
  CategoryOutput,
  CategoryOutputMapper,
} from "./dto/category-output.dto";

export class CreateCategoryUseCase implements UseCase<Input, Output> {
  constructor(private categoryRepo: CategoryRepository.Repository) {}

  async execute(input: Input): Promise<Output> {
    await this.validateExistsName(input.name);

    const entity = new Category({
      name: input.name,
      description: input.description,
      is_active: input.is_active,
    });

    await this.categoryRepo.insert(entity);

    return CategoryOutputMapper.toOutput(entity);
  }

  private async validateExistsName(name: string): Promise<void> {
    if (await this.categoryRepo.exists(name)) {
      throw new CategoryExistsError(
        `${name} exists already in the categories collection`
      );
    }
  }
}

export type Input = {
  name: string;
  description?: string;
  is_active?: boolean;
};

export type Output = CategoryOutput;

export default CreateCategoryUseCase;
