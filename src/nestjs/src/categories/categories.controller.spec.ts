import { CategoryOutput } from '@fc/replay-micro-videos/category/application';
import { PaginationOutputDto } from '@fc/replay-micro-videos/@seedwork/application';
import { CategoriesController } from './categories.controller';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { SearchCategoryDto } from './dto/search-category.dto';

describe('CategoriesController', () => {
  let controller: CategoriesController;

  beforeEach(async () => {
    controller = new CategoriesController();
  });

  it('should create a category', async () => {
    const expectedOutput: CategoryOutput = {
      id: '4d286541-9223-482c-89c1-0796a8b65fc9',
      name: 'some name',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };

    const input: CreateCategoryDto = {
      name: 'some name',
      description: 'some description',
      is_active: true,
    };

    const mockCreateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };

    //@ts-expect-error mock for testing
    controller['createUseCase'] = mockCreateUseCase;

    const output = await controller.create(input);

    expect(mockCreateUseCase.execute).toHaveBeenLastCalledWith(input);
    expect(output).toStrictEqual(expectedOutput);
  });

  it('should update a category', async () => {
    const id = '4d286541-9223-482c-89c1-0796a8b65fc9';
    const expectedOutput: CategoryOutput = {
      id,
      name: 'some name',
      description: 'some description',
      is_active: true,
      created_at: new Date(),
    };

    const input: UpdateCategoryDto = {
      name: 'some name',
      description: 'some description',
      is_active: true,
    };

    const mockUpdateUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };

    //@ts-expect-error mock for testing
    controller['updateUseCase'] = mockUpdateUseCase;

    const output = controller.update(id, input);

    expect(mockUpdateUseCase.execute).toBeCalledWith({ id, ...input });
    expect(output).toStrictEqual(expectedOutput);
  });

  it('should delete a category', async () => {
    const mockDeleteUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(undefined)),
    };

    //@ts-expect-error mock for testing
    controller['deleteUseCase'] = mockDeleteUseCase;

    const id = '4d286541-9223-482c-89c1-0796a8b65fc9';
    expect(controller.remove(id)).toBeInstanceOf(Promise);

    const output = await controller.remove(id);
    expect(mockDeleteUseCase.execute).toBeCalledWith({ id });
    expect(output).toBeUndefined;
  });

  it('should get a category', async () => {
    const expectedOutput: CategoryOutput = {
      id: '4d286541-9223-482c-89c1-0796a8b65fc9',
      name: 'some name',
      description: 'some description',
      is_active: true,
    };

    const mockGetUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };
    //@ts-expect-error mock for testing
    controller['getUseCase'] = mockGetUseCase;
    const id = '4d286541-9223-482c-89c1-0796a8b65fc9';
    const output = await controller.findOne(id);

    expect(mockGetUseCase.execute).toBeCalledWith({ id });
    expect(output).toStrictEqual(expectedOutput);
  });

  it('should get all categories', async () => {
    const items: CategoryOutput[] = [
      {
        id: '4d286541-9223-482c-89c1-0796a8b65fc9',
        name: 'name 1',
        description: 'description 1',
        is_active: true,
        created_at: new Date(),
      },
      {
        id: 'd0ecc323-77b6-45fa-972e-b3c9fa6d6320',
        name: 'name 2',
        description: 'description 2',
        is_active: true,
        created_at: new Date(),
      },
    ];

    const expectedOutput: PaginationOutputDto<CategoryOutput> = {
      items,
      current_page: 1,
      last_page: 2,
      per_page: 2,
      total: 3,
    };

    const mockListUseCase = {
      execute: jest.fn().mockReturnValue(Promise.resolve(expectedOutput)),
    };

    //@ts-expect-error mock for testing
    controller['listUseCase'] = mockListUseCase;
    const input: SearchCategoryDto = {
      page: 1,
      per_page: 2,
      sort: 'name',
      sort_dir: 'asc',
      filter: 'name',
    };
    const output = await controller.search(input);

    expect(mockListUseCase.execute).toHaveBeenCalledWith(input);
    expect(output).toStrictEqual(expectedOutput);
  });
});
