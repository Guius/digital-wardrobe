import { Injectable } from '@nestjs/common';
import { ClothingItemsRepository } from '../../database/clothing-items.repository';
import {
  ClothingItem,
  ClothingCategory,
} from '../entities/clothing-item.entity';
import { ClothingItemsListDto } from './clothing-items-list.dto';

@Injectable()
export class ClothingItemsService {
  constructor(
    private readonly clothingItemsRepository: ClothingItemsRepository,
  ) {}

  async findAll(): Promise<ClothingItemsListDto> {
    const items = await this.clothingItemsRepository.findAll();
    return new ClothingItemsListDto(items, items.length);
  }

  async findById(id: string): Promise<ClothingItem | null> {
    return this.clothingItemsRepository.findById(id);
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
    return this.clothingItemsRepository.save(item);
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
    const updates: Partial<ClothingItem> = {
      ...params,
    };
    return this.clothingItemsRepository.update(id, updates);
  }

  async delete(id: string): Promise<boolean> {
    return this.clothingItemsRepository.delete(id);
  }
}
