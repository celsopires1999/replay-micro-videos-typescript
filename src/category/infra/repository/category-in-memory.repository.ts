import { InMemorySearchableRepository } from "../../../@seedwork/domain/repository/in-memory-repository";
import Category from "../../domain/entities/category";
import { CategoryRepository } from "./category-repository";

export class CategoryInMemoryRepository
  extends InMemorySearchableRepository<Category>
  implements CategoryRepository
{
  sortableFields: string[];
  protected applyFilter(
    items: Category[],
    filter: string
  ): Promise<Category[]> {
    throw new Error("Method not implemented.");
  }
}
