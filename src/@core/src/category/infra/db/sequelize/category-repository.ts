import { Category, CategoryRepository } from "#category/domain";
import { NotFoundError, UniqueEntityId } from "#seedwork/domain";
import { Op } from "sequelize";
import CategoryModelMapper from "./category-mapper";
import { CategoryModel } from "./category-model";

export class CategorySequelizeRepository
  implements CategoryRepository.Repository
{
  constructor(private categoryModel: typeof CategoryModel) {}

  exists(name: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  sortableFields: string[] = ["name", "created_at"];

  async search(
    props: CategoryRepository.SearchParams
  ): Promise<CategoryRepository.SearchResult> {
    const offset = (props.page - 1) * props.per_page;
    const limit = props.per_page;

    const { count: total, rows: models } =
      await this.categoryModel.findAndCountAll({
        ...(props.filter && {
          where: {
            name: { [Op.like]: `%${props.filter}%` },
          },
        }),
        ...(props.sort && this.sortableFields.includes(props.sort)
          ? { order: [[props.sort, props.sort_dir]] }
          : { order: [["created_at", "DESC"]] }),
        offset,
        limit,
      });

    return new CategoryRepository.SearchResult({
      items: models.map((model) => CategoryModelMapper.toEntity(model)),
      total: total,
      current_page: props.page,
      per_page: props.per_page,
      sort: props.sort,
      sort_dir: props.sort_dir,
      filter: props.filter,
    });
  }

  async insert(entity: Category): Promise<void> {
    this.categoryModel.create(entity.toJSON());
  }

  async findById(id: string | UniqueEntityId): Promise<Category> {
    const _id = `${id}`;
    const model = await this._get(_id);
    return CategoryModelMapper.toEntity(model);
  }

  async findAll(): Promise<Category[]> {
    const models = await this.categoryModel.findAll();
    return models.map((model) => CategoryModelMapper.toEntity(model));
  }

  update(entity: Category): Promise<void> {
    throw new Error("Method not implemented.");
  }

  delete(id: string | UniqueEntityId): Promise<void> {
    throw new Error("Method not implemented.");
  }

  private async _get(id: string): Promise<CategoryModel> {
    return this.categoryModel.findByPk(id, {
      rejectOnEmpty: new NotFoundError(`Entity not found using ID ${id}`),
    });
  }
}

export default CategorySequelizeRepository;
