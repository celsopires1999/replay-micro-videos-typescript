import { Category, CategoryRepository } from "#category/domain";
import { NotFoundError, UniqueEntityId } from "#seedwork/domain";
import { setupSequelize } from "#seedwork/infra";
import { CategoryModel } from "./category-model";
import { CategorySequelizeRepository } from "./category-repository";
import _change from "chance";
import CategoryModelMapper from "./category-mapper";

const chance = _change();

describe("CategorySequelizeRepository Unit Tests", () => {
  setupSequelize({ models: [CategoryModel] });
  let repository: CategorySequelizeRepository;

  beforeEach(async () => {
    repository = new CategorySequelizeRepository(CategoryModel);
  });

  it("should insert a new entity", async () => {
    let entity = new Category({ name: "some name" });
    await repository.insert(entity);
    let model = await CategoryModel.findByPk(entity.id);
    expect(model.toJSON()).toStrictEqual(entity.toJSON());

    entity = new Category({
      name: "new category",
      description: "new description",
      is_active: false,
      created_at: new Date(),
    });
    await repository.insert(entity);
    model = await CategoryModel.findByPk(entity.id);
    expect(model.toJSON()).toStrictEqual(entity.toJSON());
  });

  it("should find an entity", async () => {
    const entity = new Category({
      name: "some name",
      description: "some description",
      is_active: false,
    });
    CategoryModel.create({
      id: entity.id,
      name: entity.name,
      description: entity.description,
      is_active: entity.is_active,
      created_at: entity.created_at,
    });

    let entityFound = await repository.findById(entity.id);
    expect(entityFound.toJSON).toStrictEqual(entity.toJSON);

    entityFound = await repository.findById(entity.uniqueEntityId);
    expect(entity.toJSON()).toStrictEqual(entityFound.toJSON());
  });

  it("should throw an error when entity has not been found", async () => {
    await expect(repository.findById("fake-id")).rejects.toThrowError(
      new NotFoundError("Entity not found using ID fake-id")
    );
    await expect(
      repository.findById("312cffad-1938-489e-a706-643dc9a3cfd3")
    ).rejects.toThrowError(
      new NotFoundError(
        "Entity not found using ID 312cffad-1938-489e-a706-643dc9a3cfd3"
      )
    );
  });

  it("should find all categories", async () => {
    const entity1 = new Category({
      name: "name of entity1",
    });
    const entity2 = new Category({
      name: "name of entity2",
    });

    await repository.insert(entity1);
    await repository.insert(entity2);

    const entities = await repository.findAll();
    expect(entities).toHaveLength(2);
    expect(JSON.stringify(entities)).toStrictEqual(
      JSON.stringify([entity1, entity2])
    );
  });

  describe("search method tests", () => {
    it("should return search result", async () => {
      const entity = new Category({ name: "some name" });
      repository.insert(entity);

      const expectedSearchResult = new CategoryRepository.SearchResult({
        items: [entity],
        current_page: 1,
        per_page: 2,
        total: 1,
        sort: "name",
        sort_dir: "asc",
        filter: null,
      });

      const searchParams = new CategoryRepository.SearchParams({
        page: 1,
        per_page: 2,
        sort: "name",
        sort_dir: "asc",
        filter: null,
      });

      const searchResult = await repository.search(searchParams);

      expect(searchResult.toJSON()).toMatchObject(
        expectedSearchResult.toJSON()
      );
    });

    it("should only apply paginate when other params are null", async () => {
      const created_at = new Date();
      const models = await CategoryModel.factory()
        .count(16)
        .bulkCreate(() => ({
          id: chance.guid({ version: 4 }),
          name: "a",
          description: null,
          is_active: true,
          created_at,
        }));

      const items = models
        .map((model) => CategoryModelMapper.toEntity(model))
        .slice(0, 15);

      const spyToEntity = jest.spyOn(CategoryModelMapper, "toEntity");
      const result = await repository.search(
        new CategoryRepository.SearchParams()
      );
      expect(result).toBeInstanceOf(CategoryRepository.SearchResult);
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(result.toJSON()).toMatchObject(
        new CategoryRepository.SearchResult({
          items,
          total: 16,
          current_page: 1,
          per_page: 15,
          sort: null,
          sort_dir: null,
          filter: null,
        }).toJSON()
      );
      result.items.forEach((item) => {
        expect(item).toBeInstanceOf(Category);
        expect(item.id).toBeDefined();
        expect(item.toJSON()).toMatchObject({
          name: "a",
          description: null,
          is_active: true,
          created_at: created_at,
        });
      });
    });

    it("should order by created_at DESC when search params are null", async () => {
      const created_at = new Date();
      const models = await CategoryModel.factory()
        .count(16)
        .bulkCreate((index: number) => ({
          id: chance.guid({ version: 4 }),
          name: `Movie${index}`,
          description: null,
          is_active: true,
          created_at: new Date(created_at.getTime() + 100 * index),
        }));

      const expectedItems = [...models]
        .reverse()
        .map(
          (model) =>
            new Category(
              {
                name: model.name,
                description: model.description,
                is_active: model.is_active,
                created_at: model.created_at,
              },
              new UniqueEntityId(model.id)
            )
        )
        .slice(0, 15);

      const spyToEntity = jest.spyOn(CategoryModelMapper, "toEntity");
      const searchOutputActual = await repository.search(
        new CategoryRepository.SearchParams()
      );
      expect(searchOutputActual).toBeInstanceOf(
        CategoryRepository.SearchResult
      );
      expect(spyToEntity).toHaveBeenCalledTimes(15);
      expect(searchOutputActual.toJSON()).toMatchObject(
        new CategoryRepository.SearchResult({
          items: expectedItems,
          total: 16,
          current_page: 1,
          per_page: 15,
          sort: null,
          sort_dir: null,
          filter: null,
        }).toJSON()
      );
      [...searchOutputActual.items].reverse().forEach((item, index) => {
        expect(item).toBeInstanceOf(Category);
        expect(item.id).toBeDefined();
        expect(item.toJSON()).toMatchObject({
          name: `Movie${index + 1}`,
          description: null,
          is_active: true,
        });
      });
    });

    it("should apply paginate and filter", async () => {
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date(),
      };

      const categoryProps = [
        { id: chance.guid({ version: 4 }), name: "test", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "a", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "TEST", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "TeST", ...defaultProps },
      ];

      const models = await CategoryModel.bulkCreate(categoryProps);
      const items = models.map((model) => CategoryModelMapper.toEntity(model));

      let expectedSearchResult = new CategoryRepository.SearchResult({
        items: [items[0], items[2]],
        current_page: 1,
        per_page: 2,
        total: 3,
        sort: null,
        sort_dir: null,
        filter: "TEST",
      });
      let searchResult = await repository.search(
        new CategoryRepository.SearchParams({
          page: 1,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: "TEST",
        })
      );
      expect(searchResult.toJSON()).toMatchObject(
        expectedSearchResult.toJSON()
      );

      expectedSearchResult = new CategoryRepository.SearchResult({
        items: [items[3]],
        current_page: 2,
        per_page: 2,
        total: 3,
        sort: null,
        sort_dir: null,
        filter: "TEST",
      });
      searchResult = await repository.search(
        new CategoryRepository.SearchParams({
          page: 2,
          per_page: 2,
          sort: null,
          sort_dir: null,
          filter: "TEST",
        })
      );
      expect(searchResult.toJSON()).toMatchObject(
        expectedSearchResult.toJSON()
      );
    });

    describe("should apply paginate and sort", () => {
      it("should have name and created_at as sortableFields", () => {
        expect(repository.sortableFields).toStrictEqual(["name", "created_at"]);
      });

      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date(),
      };

      const categoryProps = [
        { id: chance.guid({ version: 4 }), name: "b", ...defaultProps }, // 0
        { id: chance.guid({ version: 4 }), name: "a", ...defaultProps }, // 1
        { id: chance.guid({ version: 4 }), name: "d", ...defaultProps }, // 2
        { id: chance.guid({ version: 4 }), name: "e", ...defaultProps }, // 3
        { id: chance.guid({ version: 4 }), name: "c", ...defaultProps }, // 4
      ];

      beforeEach(async () => {
        await CategoryModel.bulkCreate(categoryProps);
      });

      const arrange = [
        {
          searchParams: new CategoryRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
          }),
          searchResult: new CategoryRepository.SearchResult({
            items: [
              new Category(categoryProps[1]),
              new Category(categoryProps[0]),
            ],
            current_page: 1,
            per_page: 2,
            total: 5,
            sort: "name",
            sort_dir: "asc",
            filter: null,
          }),
        },
        {
          searchParams: new CategoryRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
          }),
          searchResult: new CategoryRepository.SearchResult({
            items: [
              new Category(categoryProps[4]),
              new Category(categoryProps[2]),
            ],
            current_page: 2,
            per_page: 2,
            total: 5,
            sort: "name",
            sort_dir: "asc",
            filter: null,
          }),
        },
        {
          searchParams: new CategoryRepository.SearchParams({
            page: 3,
            per_page: 2,
            sort: "name",
          }),
          searchResult: new CategoryRepository.SearchResult({
            items: [new Category(categoryProps[3])],
            current_page: 3,
            per_page: 2,
            total: 5,
            sort: "name",
            sort_dir: "asc",
            filter: null,
          }),
        },

        {
          searchParams: new CategoryRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          searchResult: new CategoryRepository.SearchResult({
            items: [
              new Category(categoryProps[3]),
              new Category(categoryProps[2]),
            ],
            current_page: 1,
            per_page: 2,
            total: 5,
            sort: "name",
            sort_dir: "desc",
            filter: null,
          }),
        },
        {
          searchParams: new CategoryRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          searchResult: new CategoryRepository.SearchResult({
            items: [
              new Category(categoryProps[4]),
              new Category(categoryProps[0]),
            ],
            current_page: 2,
            per_page: 2,
            total: 5,
            sort: "name",
            sort_dir: "desc",
            filter: null,
          }),
        },
        {
          searchParams: new CategoryRepository.SearchParams({
            page: 3,
            per_page: 2,
            sort: "name",
            sort_dir: "desc",
          }),
          searchResult: new CategoryRepository.SearchResult({
            items: [new Category(categoryProps[1])],
            current_page: 3,
            per_page: 2,
            total: 5,
            sort: "name",
            sort_dir: "desc",
            filter: null,
          }),
        },
      ];

      test.each(arrange)(
        "when searchParam is $searchParams",
        async ({ searchParams, searchResult }) => {
          expect(
            (await repository.search(searchParams)).toJSON()
          ).toMatchObject(searchResult.toJSON());
        }
      );
    });

    describe("should search using filter, sort and paginate", () => {
      const defaultProps = {
        description: null,
        is_active: true,
        created_at: new Date(),
      };

      const categoriesProps = [
        { id: chance.guid({ version: 4 }), name: "teste", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "a", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "TEST", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "e", ...defaultProps },
        { id: chance.guid({ version: 4 }), name: "TeSt", ...defaultProps },
      ];

      beforeEach(async () => {
        await CategoryModel.bulkCreate(categoriesProps);
      });

      const arrange = [
        {
          search_params: new CategoryRepository.SearchParams({
            page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
          }),
          search_result: new CategoryRepository.SearchResult({
            items: [
              new Category(categoriesProps[2]),
              new Category(categoriesProps[4]),
            ],
            total: 3,
            current_page: 1,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
          }),
        },
        {
          search_params: new CategoryRepository.SearchParams({
            page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
          }),
          search_result: new CategoryRepository.SearchResult({
            items: [new Category(categoriesProps[0])],
            total: 3,
            current_page: 2,
            per_page: 2,
            sort: "name",
            sort_dir: "asc",
            filter: "TEST",
          }),
        },
      ];

      test.each(arrange)(
        "when search_params is $search_params",
        async ({ search_params, search_result }) => {
          const result = await repository.search(search_params);
          expect(result.toJSON()).toMatchObject(search_result.toJSON());
        }
      );
    });
  });
});
