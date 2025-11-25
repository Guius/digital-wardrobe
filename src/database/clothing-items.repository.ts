import { Injectable } from '@nestjs/common';
import {
  ClothingItem,
  ClothingCategory,
} from '../clothing-items/entities/clothing-item.entity';
import * as fs from 'fs/promises';
import * as path from 'path';

interface ClothingItemData {
  id: string;
  category: string;
  colour: string;
  user_id: string;
  brand: string;
  size: string;
  image_url: string;
  purchase_date: string;
  purchase_price: number;
}

@Injectable()
export class ClothingItemsRepository {
  private readonly filePath = path.join(__dirname, 'clothing-items.json');

  private async readData(): Promise<ClothingItem[]> {
    const data = await fs.readFile(this.filePath, 'utf-8');
    const items = JSON.parse(data) as ClothingItemData[];
    return items.map(
      (item) =>
        new ClothingItem(
          item.id,
          item.category as ClothingCategory,
          item.colour,
          item.user_id,
          item.brand,
          item.size,
          item.image_url,
          new Date(item.purchase_date),
          item.purchase_price,
        ),
    );
  }

  private async writeData(items: ClothingItem[]): Promise<void> {
    const data = JSON.stringify(items, null, 2);
    await fs.writeFile(this.filePath, data, 'utf-8');
  }

  async findAll(): Promise<ClothingItem[]> {
    return this.readData();
  }

  async findById(id: string): Promise<ClothingItem | null> {
    const items = await this.readData();
    return items.find((item) => item.id === id) || null;
  }

  async create(item: ClothingItem): Promise<ClothingItem> {
    const items = await this.readData();
    items.push(item);
    await this.writeData(items);
    return item;
  }

  async update(
    id: string,
    updates: Partial<ClothingItem>,
  ): Promise<ClothingItem | null> {
    const items = await this.readData();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      return null;
    }

    const existingItem = items[index];
    const updatedItem = new ClothingItem(
      existingItem.id,
      updates.category ?? existingItem.category,
      updates.colour ?? existingItem.colour,
      updates.user_id ?? existingItem.user_id,
      updates.brand ?? existingItem.brand,
      updates.size ?? existingItem.size,
      updates.image_url ?? existingItem.image_url,
      updates.purchase_date ?? existingItem.purchase_date,
      updates.purchase_price ?? existingItem.purchase_price,
    );

    items[index] = updatedItem;
    await this.writeData(items);
    return updatedItem;
  }

  async delete(id: string): Promise<boolean> {
    const items = await this.readData();
    const filteredItems = items.filter((item) => item.id !== id);

    if (filteredItems.length === items.length) {
      return false;
    }

    await this.writeData(filteredItems);
    return true;
  }
}
