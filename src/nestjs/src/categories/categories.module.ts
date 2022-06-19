import { Module } from '@nestjs/common';
import { CategoriesController } from './categories.controller';
import {
  CreateCategoryUseCase,
  DeleteCategoryUseCase,
  GetCategoryUseCase,
  ListCategoryUseCase,
  UpdateCategoryUseCase,
} from '@fc/replay-micro-videos/category/application';
import { CategoryInMemoryRepository } from '@fc/replay-micro-videos/category/infra';
import { CategoryRepository } from '@fc/replay-micro-videos/category/domain';

@Module({
  controllers: [CategoriesController],
  providers: [
    {
      provide: 'CategoryRepository',
      useClass: CategoryInMemoryRepository,
    },
    {
      provide: CreateCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => {
        return new CreateCategoryUseCase.UseCase(categoryRepo);
      },
      inject: ['CategoryRepository'],
    },
    {
      provide: UpdateCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => {
        return new UpdateCategoryUseCase.UseCase(categoryRepo);
      },
      inject: ['CategoryRepository'],
    },
    {
      provide: DeleteCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => {
        return new DeleteCategoryUseCase.UseCase(categoryRepo);
      },
      inject: ['CategoryRepository'],
    },
    {
      provide: GetCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => {
        return new GetCategoryUseCase.UseCase(categoryRepo);
      },
      inject: ['CategoryRepository'],
    },
    {
      provide: ListCategoryUseCase.UseCase,
      useFactory: (categoryRepo: CategoryRepository.Repository) => {
        return new ListCategoryUseCase.UseCase(categoryRepo);
      },
      inject: ['CategoryRepository'],
    },
  ],
})
export class CategoriesModule {}
