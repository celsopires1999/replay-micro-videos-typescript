import { Category } from "./category"

describe("Test", () => {
    test("constructor", () => {
        const entity = new Category("new category");
        expect(entity).toBeDefined();
        expect(entity.name).toBe("new category");
    })
})