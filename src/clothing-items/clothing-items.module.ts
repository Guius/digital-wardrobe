import { Module } from '@nestjs/common';
import { ClothingItemsService } from './services/clothing-item.service';
import { ClothingItemController } from './controllers/clothing-item.controller';
import { DatabaseModule } from '../database/database.module';

@Module({
  imports: [DatabaseModule],
  controllers: [ClothingItemController],
  providers: [ClothingItemsService],
  exports: [ClothingItemsService],
})
export class ClothingItemsModule {}
