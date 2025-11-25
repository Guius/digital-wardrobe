import { Module } from '@nestjs/common';
import { ClothingItemsRepository } from './clothing-items.repository';

@Module({
  providers: [ClothingItemsRepository],
  exports: [ClothingItemsRepository],
})
export class DatabaseModule {}
