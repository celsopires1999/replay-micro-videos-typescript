import {
  Column,
  DataType,
  Model,
  PrimaryKey,
  Table,
} from "sequelize-typescript";
import { SequelizeModelFactory } from "#seedwork/infra";

type CategoryModelProps = {
  id: string;
  name: string;
  description: string | null;
  is_active: boolean;
  created_at: Date;
};

@Table({ tableName: "categories", timestamps: false })
export class CategoryModel extends Model<CategoryModelProps> {
  @PrimaryKey
  @Column({ type: DataType.UUID })
  declare id: string;

  @Column({ allowNull: false, type: DataType.STRING(255) })
  declare name: string;

  @Column({ allowNull: true, type: DataType.TEXT })
  declare description: string;

  @Column({ allowNull: false, type: DataType.BOOLEAN })
  declare is_active: boolean;

  @Column({ allowNull: false, type: DataType.DATE })
  declare created_at: Date;

  static factory() {
    const chance: Chance.Chance = require("chance")();
    return new SequelizeModelFactory<CategoryModel, CategoryModelProps>(
      CategoryModel,
      () => ({
        id: chance.guid({ version: 4 }),
        name: chance.word(),
        description: chance.paragraph(),
        is_active: true,
        created_at: chance.date(),
      })
    );
  }
}
