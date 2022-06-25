import { SequelizeModelFactory, setupSequelize } from "#seedwork/infra";
import { validate as uuidValidate } from "uuid";
import _change from "chance";
import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
const chance = _change();

@Table({ tableName: "stub_model", timestamps: false })
class StubModel extends Model {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;

  static mockFactory = jest.fn(() => ({
    id: chance.guid({ version: 4 }),
    name: chance.word(),
  }));

  static factory() {
    return new SequelizeModelFactory<StubModel, { id: string; name: string }>(
      StubModel,
      StubModel.mockFactory
    );
  }
}

setupSequelize({ models: [StubModel] });

describe("SequelizeModelFactory Unit Tests", () => {
  test("create method", async () => {
    let model = await StubModel.factory().create();
    expect(uuidValidate(model.id)).toBeTruthy();
    expect(model.id).toBeDefined();
    expect(model.name).toBeDefined();
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

    let foundModel = await StubModel.findByPk(model.id);
    expect(foundModel.id).toBe(model.id);
    expect(foundModel.name).toBe(model.name);

    model = await StubModel.factory().create({
      id: "b187f845-49d9-41e2-ab52-d663b95ac325",
      name: "some name",
    });

    expect(model.id).toBe("b187f845-49d9-41e2-ab52-d663b95ac325");
    expect(model.name).toBe("some name");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

    foundModel = await StubModel.findByPk(model.id);
    expect(foundModel.id).toBe(model.id);
    expect(foundModel.name).toBe(model.name);
  });
  test("make method", async () => {
    let model = StubModel.factory().make();
    expect(uuidValidate(model.id)).toBeTruthy();
    expect(model.id).toBeDefined();
    expect(model.name).toBeDefined();
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

    model = StubModel.factory().make({
      id: "b187f845-49d9-41e2-ab52-d663b95ac325",
      name: "some name",
    });

    expect(model.id).toBe("b187f845-49d9-41e2-ab52-d663b95ac325");
    expect(model.name).toBe("some name");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
  });

  test("bulkCreate method using count = 1", async () => {
    let models = await StubModel.factory().bulkCreate();
    expect(models).toHaveLength(1);
    expect(uuidValidate(models[0].id)).toBeTruthy();
    expect(models[0].id).toBeDefined();
    expect(models[0].name).toBeDefined();
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
    let foundModel = await StubModel.findByPk(models[0].id);
    expect(foundModel.id).toBe(models[0].id);
    expect(foundModel.name).toBe(models[0].name);

    models = await StubModel.factory().bulkCreate(() => ({
      id: "b187f845-49d9-41e2-ab52-d663b95ac325",
      name: "some name",
    }));
    expect(models).toHaveLength(1);
    expect(uuidValidate(models[0].id)).toBeTruthy();
    expect(models[0].id).toBe("b187f845-49d9-41e2-ab52-d663b95ac325");
    expect(models[0].name).toBe("some name");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
    foundModel = await StubModel.findByPk(models[0].id);
    expect(foundModel.id).toBe(models[0].id);
    expect(foundModel.name).toBe(models[0].name);
  });

  test("bulkCreate method using count > 1", async () => {
    let models = await StubModel.factory().count(2).bulkCreate();
    expect(models).toHaveLength(2);
    expect(uuidValidate(models[0].id)).toBeTruthy();
    expect(models[0].id).toBeDefined();
    expect(models[0].name).toBeDefined();
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);
    let foundModel = await StubModel.findByPk(models[0].id);
    expect(foundModel.id).toBe(models[0].id);
    expect(foundModel.name).toBe(models[0].name);

    models = await StubModel.factory()
      .count(2)
      .bulkCreate(() => ({
        id: chance.guid({ version: 4 }),
        name: "some name",
      }));
    expect(models).toHaveLength(2);
    expect(uuidValidate(models[0].id)).toBeTruthy();
    expect(models[0].id).toBeDefined();
    expect(models[0].name).toBe("some name");
    expect(models[1].id).toBeDefined();
    expect(models[1].name).toBe("some name");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);
    foundModel = await StubModel.findByPk(models[0].id);
    expect(foundModel.id).toBe(models[0].id);
    expect(foundModel.name).toBe(models[0].name);
  });

  test("bulkMake method using count = 1", async () => {
    let models = StubModel.factory().bulkMake();
    expect(models).toHaveLength(1);
    expect(uuidValidate(models[0].id)).toBeTruthy();
    expect(models[0].id).toBeDefined();
    expect(models[0].name).toBeDefined();
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);

    models = StubModel.factory().bulkMake(() => ({
      id: "b187f845-49d9-41e2-ab52-d663b95ac325",
      name: "some name",
    }));
    expect(models).toHaveLength(1);
    expect(uuidValidate(models[0].id)).toBeTruthy();
    expect(models[0].id).toBe("b187f845-49d9-41e2-ab52-d663b95ac325");
    expect(models[0].name).toBe("some name");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(1);
  });

  test("bulkMake method using count > 1", async () => {
    let models = StubModel.factory().count(2).bulkMake();
    expect(models).toHaveLength(2);
    expect(uuidValidate(models[0].id)).toBeTruthy();
    expect(models[0].id).toBeDefined();
    expect(models[0].name).toBeDefined();
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);

    models = await StubModel.factory()
      .count(2)
      .bulkCreate(() => ({
        id: chance.guid({ version: 4 }),
        name: "some name",
      }));
    expect(models).toHaveLength(2);
    expect(uuidValidate(models[0].id)).toBeTruthy();
    expect(models[0].id).toBeDefined();
    expect(models[0].name).toBe("some name");
    expect(models[1].id).toBeDefined();
    expect(models[1].name).toBe("some name");
    expect(StubModel.mockFactory).toHaveBeenCalledTimes(2);
  });
});
