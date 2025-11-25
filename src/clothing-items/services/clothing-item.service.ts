import { Injectable, NotFoundException } from '@nestjs/common';
import { ClothingItemsRepository } from '../../database/clothing-items.repository';
import { ClothingItem } from '../entities/clothing-item.entity';
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

  async findById(id: string): Promise<ClothingItem> {
    const item = await this.clothingItemsRepository.findById(id);
    if (!item) {
      throw new NotFoundException(`Clothing item with ID ${id} not found`);
    }
    return item;
  }

  async create(item: ClothingItem): Promise<ClothingItem> {
    return this.clothingItemsRepository.create(item);
  }

  async update(
    id: string,
    updates: Partial<ClothingItem>,
  ): Promise<ClothingItem> {
    const updatedItem = await this.clothingItemsRepository.update(id, updates);
    if (!updatedItem) {
      throw new NotFoundException(`Clothing item with ID ${id} not found`);
    }
    return updatedItem;
  }

  async delete(id: string): Promise<void> {
    const deleted = await this.clothingItemsRepository.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Clothing item with ID ${id} not found`);
    }
  }
}
