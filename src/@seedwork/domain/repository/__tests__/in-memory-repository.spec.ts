import UniqueEntityId from "../../../../@seedwork/domain/value-objects/unique-entity-id.vo";
import Entity from "../../entity/entity";
import ExistsError from "../../errors/exists.error";
import NotFoundError from "../../errors/not-found.error";
import { InMemoryRepository } from "../in-memory-repository";

type StubEntityProps = {
  name: string;
  price: number;
};
class StubEntity extends Entity<StubEntityProps> {}
class StubInMemoryRepository extends InMemoryRepository<StubEntity> {}

let repository: StubInMemoryRepository;

beforeEach(() => {
  repository = new StubInMemoryRepository();
});

async function loadData(): Promise<StubEntity> {
  const entity = new StubEntity({ name: "some name", price: 5 });
  await repository.insert(entity);
  return entity;
}

describe("InMemoryRepository Unit Tests", () => {
  describe("errors tests", () => {
    it("should throw an error when duplicating an entity on insert", async () => {
      const entity = await loadData();
      expect(repository.insert(entity)).rejects.toThrowError(
        new ExistsError(`Entity exists already with id ${entity.id}`)
      );
    });

    it("should throw an error when id has not been found on find by id", async () => {
      const fakeId = new UniqueEntityId();
      expect(repository.findById("fake id")).rejects.toThrowError(
        new NotFoundError(`Entity not found using ID fake id`)
      );
      expect(repository.findById(fakeId)).rejects.toThrowError(
        new NotFoundError(`Entity not found using ID ${fakeId.value}`)
      );
    });

    it("should throw an error when id has not been found on update", async () => {
      const entity = new StubEntity({ name: "some name", price: 1 });

      expect(repository.update(entity)).rejects.toThrowError(
        new NotFoundError(`Entity not found on update using id ${entity.id}`)
      );
    });

    it("should throw an error when id has not been found on delete", async () => {
      const fakeId = new UniqueEntityId();
      expect(repository.delete("fake id")).rejects.toThrowError(
        new NotFoundError(`Entity not found on delete using id fake id`)
      );
      expect(repository.delete(fakeId)).rejects.toThrowError(
        new NotFoundError(`Entity not found on delete using id ${fakeId.value}`)
      );
    });
  });

  describe("success tests", () => {
    it("should insert an entity", async () => {
      const entity = new StubEntity({ name: "some name", price: 5 });
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
      entity.props.name = "updated name";
      entity.props.price = 10;

      await repository.update(entity);

      expect(repository.items[0]).toStrictEqual(entity);
    });

    it("should delete an entity", async () => {
      const entity = await loadData();
      await repository.delete(entity.id);

      expect(repository.items.length).toBe(0);
    });
  });
});
