import Category from "../../../category/domain/entities/category";
import { CategoryInMemoryRepository } from "./category-in-memory.repository";
import { CategoryRepository } from "../../../category/domain/repository/category-repository";

let repository: CategoryInMemoryRepository;

beforeEach(() => {
  repository = new CategoryInMemoryRepository();
});

async function loadData(): Promise<Category> {
  const entity = new Category({ name: "some name" });
  await repository.insert(entity);
  return entity;
}

describe("CategoryInMemoryRepository Unit Tests", () => {
  it("should no filter items when filter object is null", async () => {
    const items = [new Category({ name: "test" })];
    const filterSpy = jest.spyOn(items, "filter" as any);

    let itemsFiltered = await repository["applyFilter"](items, null);
    expect(filterSpy).not.toHaveBeenCalled();
    expect(itemsFiltered).toStrictEqual(items);
  });

  it("should filter items using filter parameter", async () => {
    const items = [
      new Category({ name: "test" }),
      new Category({ name: "TEST" }),
      new Category({ name: "fake" }),
    ];
    const filterSpy = jest.spyOn(items, "filter" as any);

    let itemsFiltered = await repository["applyFilter"](items, "TEST");
    expect(filterSpy).toHaveBeenCalledTimes(1);
    expect(itemsFiltered).toStrictEqual([items[0], items[1]]);
  });

  it("should sort by created_at when sort param is null", async () => {
    const created_at = new Date();
    const items = [
      new Category({ name: "test", created_at: created_at }),
      new Category({
        name: "TEST",
        created_at: new Date(created_at.getTime() + 100),
      }),
      new Category({
        name: "fake",
        created_at: new Date(created_at.getTime() + 200),
      }),
    ];

    let itemsSorted = await repository["applySort"](items, null, null);
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);
  });

  it("should sort by name", async () => {
    const items = [
      new Category({ name: "c" }),
      new Category({ name: "b" }),
      new Category({ name: "a" }),
    ];

    let itemsSorted = await repository["applySort"](items, "name", "asc");
    expect(itemsSorted).toStrictEqual([items[2], items[1], items[0]]);

    itemsSorted = await repository["applySort"](items, "name", "desc");
    expect(itemsSorted).toStrictEqual([items[0], items[1], items[2]]);
  });

  describe("Extra Tests - the following tests have been duplicated from the InMemoryRepository", () => {
    describe("success tests", () => {
      it("should insert an entity", async () => {
        const entity = new Category({ name: "some name" });
        await repository.insert(entity);
        expect(repository.items[0]).toStrictEqual(entity);
      });

      it("should get an entity", async () => {
        const entity = await loadData();
        const entityFound = await repository.findById(entity.id);
        expect(entityFound).toStrictEqual(entity);
      });

      it("should get all entities", async () => {
        await loadData();
        const entities = await repository.findAll();
        expect(entities).toStrictEqual(repository.items);
        expect(entities.length).toBe(1);
      });

      it("should update an entity", async () => {
        const entity = await loadData();
        entity.update("updated name", "updated description");
        await repository.update(entity);

        expect(repository.items[0]).toStrictEqual(entity);
      });

      it("should delete an entity", async () => {
        const entity = await loadData();
        await repository.delete(entity.id);

        expect(repository.items.length).toBe(0);
      });
    });

    describe("search method", () => {
      it("should apply only paginate when all params are null", async () => {
        const entity = new Category({ name: "a" });
        const items = Array(16).fill(entity);
        repository.items = items;

        const result = await repository.search(
          new CategoryRepository.SearchParams()
        );

        const expectedResult = new CategoryRepository.SearchResult({
          items: Array(15).fill(entity),
          total: 16,
          current_page: 1,
          per_page: 15,
          sort: null,
          sort_dir: null,
          filter: null,
        });

        expect(JSON.stringify(result)).toStrictEqual(
          JSON.stringify(expectedResult)
        );
      });

      it("should apply paginate and filter", async () => {
        const items = [
          new Category({ name: "test" }),
          new Category({ name: "a" }),
          new Category({ name: "TEST" }),
          new Category({ name: "TeST" }),
        ];

        repository.items = items;

        const result = await repository.search(
          new CategoryRepository.SearchParams({
            page: 1,
            per_page: 2,
            filter: "TEST",
          })
        );
        expect(JSON.stringify(result)).toStrictEqual(
          JSON.stringify(
            new CategoryRepository.SearchResult({
              items: [items[0], items[2]],
              total: 3,
              current_page: 1,
              per_page: 2,
              sort: null,
              sort_dir: null,
              filter: "TEST",
            })
          )
        );
      });
      it("should apply paginate and sort", async () => {
        const items = [
          new Category({ name: "b" }), // 0
          new Category({ name: "a" }), // 1
          new Category({ name: "d" }), // 2
          new Category({ name: "e" }), // 3
          new Category({ name: "c" }), // 4
        ];
        repository.items = items;

        const arrange = [
          {
            params: new CategoryRepository.SearchParams({
              page: 1,
              per_page: 2,
              sort: "name",
              sort_dir: "asc",
            }),
            result: new CategoryRepository.SearchResult({
              items: [items[1], items[0]],
              total: 5,
              current_page: 1,
              per_page: 2,
              sort: "name",
              sort_dir: "asc",
              filter: null,
            }),
          },
          {
            params: new CategoryRepository.SearchParams({
              page: 2,
              per_page: 2,
              sort: "name",
              sort_dir: "asc",
            }),
            result: new CategoryRepository.SearchResult({
              items: [items[4], items[2]],
              total: 5,
              current_page: 2,
              per_page: 2,
              sort: "name",
              sort_dir: "asc",
              filter: null,
            }),
          },
          {
            params: new CategoryRepository.SearchParams({
              page: 1,
              per_page: 2,
              sort: "name",
              sort_dir: "desc",
            }),
            result: new CategoryRepository.SearchResult({
              items: [items[3], items[2]],
              total: 5,
              current_page: 1,
              per_page: 2,
              sort: "name",
              sort_dir: "desc",
              filter: null,
            }),
          },
          {
            params: new CategoryRepository.SearchParams({
              page: 2,
              per_page: 2,
              sort: "name",
              sort_dir: "desc",
            }),
            result: new CategoryRepository.SearchResult({
              items: [items[4], items[0]],
              total: 5,
              current_page: 2,
              per_page: 2,
              sort: "name",
              sort_dir: "desc",
              filter: null,
            }),
          },
        ];

        for (const i of arrange) {
          const result = await repository.search(i.params);
          expect(JSON.stringify(result)).toStrictEqual(
            JSON.stringify(i.result)
          );
        }
      });

      it("should search using filter, sort and paginate", async () => {
        const items = [
          new Category({ name: "test" }), // 0
          new Category({ name: "a" }), // 1
          new Category({ name: "TEST" }), // 2
          new Category({ name: "e" }), // 3
          new Category({ name: "TeSt" }), // 4
        ];
        repository.items = items;

        const arrange = [
          {
            params: new CategoryRepository.SearchParams({
              page: 1,
              per_page: 2,
              sort: "name",
              sort_dir: "asc",
              filter: "TEST",
            }),
            result: new CategoryRepository.SearchResult({
              items: [items[2], items[4]],
              total: 3,
              current_page: 1,
              per_page: 2,
              sort: "name",
              sort_dir: "asc",
              filter: "TEST",
            }),
          },
          {
            params: new CategoryRepository.SearchParams({
              page: 2,
              per_page: 2,
              sort: "name",
              sort_dir: "asc",
              filter: "TEST",
            }),
            result: new CategoryRepository.SearchResult({
              items: [items[0]],
              total: 3,
              current_page: 2,
              per_page: 2,
              sort: "name",
              sort_dir: "asc",
              filter: "TEST",
            }),
          },
        ];

        for (const i of arrange) {
          const result = await repository.search(i.params);
          expect(JSON.stringify(result)).toStrictEqual(
            JSON.stringify(i.result)
          );
        }
      });
    });
  });
});
