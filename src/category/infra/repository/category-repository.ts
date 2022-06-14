import { SearchableRepositoryInterface } from "@seedwork/domain/repository/repository-contracts";
import Category from "category/domain/entities/category";

export interface CategoryRepository
  extends SearchableRepositoryInterface<Category> {}
