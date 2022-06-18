import Category from "#category/domain/entities/category";
import { CategoryOutputMapper } from "#category/application/use-cases/dto/category-output.dto";

describe("CategoryOutputMapper Unit Tests", () => {
  it("should convert category into output", () => {
    const entity = new Category({
      name: "some name",
      description: "some description",
    });
    const spyToJSON = jest.spyOn(entity, "toJSON");
    const output = CategoryOutputMapper.toOutput(entity);
    expect(spyToJSON).toHaveBeenCalledTimes(1);

    expect(output).toStrictEqual(entity.toJSON());
  });
});
