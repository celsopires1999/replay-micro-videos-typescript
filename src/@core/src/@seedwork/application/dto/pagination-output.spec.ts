import { SearchResult } from "#seedwork/domain/repository/repository-contracts";
import { PaginationOutputMapper } from "#seedwork/application/dto/pagination-output";

describe("PaginationOutputMapper Unit Tests", () => {
  it("should convert SearchResult into output", () => {
    const result = new SearchResult({
      items: ["fake"] as any,
      current_page: 1,
      per_page: 2,
      total: 2,
      sort: "name",
      sort_dir: "desc",
      filter: "fake",
    });

    const output = PaginationOutputMapper.toOutput(result);

    expect(output).toStrictEqual({
      current_page: 1,
      last_page: 1,
      per_page: 2,
      total: 2,
    });
  });
});
