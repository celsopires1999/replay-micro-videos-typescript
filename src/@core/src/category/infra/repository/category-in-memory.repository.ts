import { SortDirection } from "#seedwork/domain/repository/repository-contracts";
import { InMemorySearchableRepository } from "#seedwork/domain/repository/in-memory-repository";
import Category from "#category/domain/entities/category";
import { CategoryRepository } from "#category/domain/repository/category-repository";

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepository.Repository
{
  async exists(name: string): Promise<boolean> {
    const foundItem = this.items.findIndex((i) => i.name === name);

    return foundItem === -1 ? false : true;
  }

  sortableFields: string[] = ["name", "created_at"];

  protected async applyFilter(
    items: Category[],
    filter: string
  ): Promise<Category[]> {
    if (!filter) {
      return items;
    }

    return items.filter((i) =>
      i.props.name.toLowerCase().includes(filter.toLowerCase())
    );
  }

  protected async applySort(
    items: Category[],
    sort: string,
    sort_dir: SortDirection
  ): Promise<Category[]> {
    return sort
      ? super.applySort(items, sort, sort_dir)
      : super.applySort(items, "created_at", "desc");
  }
}
