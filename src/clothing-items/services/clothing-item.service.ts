import {
  Injectable,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ClothingItemsRepository } from '../../database/clothing-items.repository';
import {
  ClothingItem,
  ClothingCategory,
} from '../entities/clothing-item.entity';
import { ClothingItemsListDto } from './clothing-items-list.dto';

@Injectable()
export class ClothingItemsService {
  private readonly logger = new Logger(ClothingItemsService.name);

  constructor(
    private readonly clothingItemsRepository: ClothingItemsRepository,
  ) {}

  async findAll(): Promise<ClothingItemsListDto> {
    try {
      const items = await this.clothingItemsRepository.findAll();
      return new ClothingItemsListDto(items, items.length);
    } catch (error) {
      this.logger.error('Failed to retrieve clothing items', error);
      throw new InternalServerErrorException(
        'Failed to retrieve clothing items',
      );
    }
  }

  async findById(id: string): Promise<ClothingItem | null> {
    try {
      return await this.clothingItemsRepository.findById(id);
    } catch (error) {
      this.logger.error(`Failed to retrieve clothing item ${id}`, error);
      throw new InternalServerErrorException(
        'Failed to retrieve clothing item',
      );
    }
  }

  async create(
    category: ClothingCategory,
    colour: string,
    user_id: string,
    brand: string,
    size: string,
    image_url: string,
    purchase_date: Date,
    purchase_price: number,
  ): Promise<ClothingItem> {
    try {
      const item = this.clothingItemsRepository.createEntity(
        category,
        colour,
        user_id,
        brand,
        size,
        image_url,
        purchase_date,
        purchase_price,
      );
      return await this.clothingItemsRepository.save(item);
    } catch (error) {
      this.logger.error('Failed to create clothing item', error);
      throw new InternalServerErrorException('Failed to create clothing item');
    }
  }

  async update(
    id: string,
    params: {
      category?: ClothingCategory;
      colour?: string;
      user_id?: string;
      brand?: string;
      size?: string;
      image_url?: string;
      purchase_date?: Date;
      purchase_price?: number;
    },
  ): Promise<ClothingItem | null> {
    try {
      const updates: Partial<ClothingItem> = {
        ...params,
      };
      return await this.clothingItemsRepository.update(id, updates);
    } catch (error) {
      this.logger.error(`Failed to update clothing item ${id}`, error);
      throw new InternalServerErrorException('Failed to update clothing item');
    }
  }

  async delete(id: string): Promise<boolean> {
    try {
      return await this.clothingItemsRepository.delete(id);
    } catch (error) {
      this.logger.error(`Failed to delete clothing item ${id}`, error);
      throw new InternalServerErrorException('Failed to delete clothing item');
    }
  }
}
