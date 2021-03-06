import { SearchInputDto } from "#seedwork/application/dto/search-input.dto";
import {
  PaginationOutputDto,
  PaginationOutputMapper,
} from "#seedwork/application/dto/pagination-output";
import { default as DefaultUseCase } from "#seedwork/application/use-case";
import CategoryRepository from "#category/domain/repository/category-repository";
import {
  CategoryOutput,
  CategoryOutputMapper,
} from "#category/application/use-cases/dto/category-output.dto";

export namespace ListCategoriesUseCase {
  export class UseCase implements DefaultUseCase<Input, Output> {
    constructor(private categoryRepository: CategoryRepository.Repository) {}

    async execute(input: Input): Promise<Output> {
      const searchParams = new CategoryRepository.SearchParams(input);
      const searchResult = await this.categoryRepository.search(searchParams);

      return this.toOutput(searchResult);
    }

    private toOutput(searchResult: CategoryRepository.SearchResult): Output {
      return {
        items: searchResult.items.map((i) => CategoryOutputMapper.toOutput(i)),
        ...PaginationOutputMapper.toOutput(searchResult),
      };
    }
  }
  export type Input = SearchInputDto;

  export type Output = PaginationOutputDto<CategoryOutput>;
}

export default ListCategoriesUseCase;
