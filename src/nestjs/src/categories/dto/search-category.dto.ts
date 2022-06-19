import { ListCategoriesUseCase } from '@fc/replay-micro-videos/category/application';
import { SortDirection } from '@fc/replay-micro-videos/@seedwork/domain';

export class SearchCategoryDto implements ListCategoriesUseCase.Input {
  page?: number;
  per_page?: number;
  sort?: string;
  sort_dir?: SortDirection;
  filter?: string;
}
