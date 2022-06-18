import { default as DefaultUseCase } from "#seedwork/application/use-case";
import Category from "#category/domain/entities/category";
import CategoryRepository from "#category/domain/repository/category-repository";
import CategoryExistsError from "#category/application/errors/category-exists.error";
import {
  CategoryOutput,
  CategoryOutputMapper,
} from "#category/application/use-cases/dto/category-output.dto";

export namespace CreateCategoryUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
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
}

export default CreateCategoryUseCase;
