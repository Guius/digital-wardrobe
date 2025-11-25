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
  deleted_at: string | null;
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
          item.deleted_at ? new Date(item.deleted_at) : null,
        ),
    );
  }

  private async writeData(items: ClothingItem[]): Promise<void> {
    const data = JSON.stringify(items, null, 2);
    await fs.writeFile(this.filePath, data, 'utf-8');
  }

  async findAll(): Promise<ClothingItem[]> {
    const items = await this.readData();
    return items.filter((item) => !item.deleted_at);
  }

  async findById(id: string): Promise<ClothingItem | null> {
    const items = await this.readData();
    const item = items.find((item) => item.id === id);
    return item && !item.deleted_at ? item : null;
  }

  createEntity(
    category: ClothingCategory,
    colour: string,
    user_id: string,
    brand: string,
    size: string,
    image_url: string,
    purchase_date: Date,
    purchase_price: number,
  ): ClothingItem {
    return new ClothingItem(
      crypto.randomUUID(), // generates a random uuid for the item id
      category,
      colour,
      user_id,
      brand,
      size,
      image_url,
      purchase_date,
      purchase_price,
      null, // when created, item is not deleted
    );
  }

  async save(item: ClothingItem): Promise<ClothingItem> {
    const items = await this.readData();
    items.push(item);
    await this.writeData(items);
    return item;
  }

  /**
   * You can try and update the id or the deleted at field but these properties will be ignored
   */
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

    // Prevent updating soft-deleted items
    if (existingItem.deleted_at) {
      return null;
    }

    const updatedItem = new ClothingItem(
      existingItem.id, // cannot update the item id
      updates.category ?? existingItem.category,
      updates.colour ?? existingItem.colour,
      updates.user_id ?? existingItem.user_id,
      updates.brand ?? existingItem.brand,
      updates.size ?? existingItem.size,
      updates.image_url ?? existingItem.image_url,
      updates.purchase_date ?? existingItem.purchase_date,
      updates.purchase_price ?? existingItem.purchase_price,
      existingItem.deleted_at, // cannot update deleted at --> use delete method for that
    );

    items[index] = updatedItem;
    await this.writeData(items);
    return updatedItem;
  }

  async delete(id: string): Promise<boolean> {
    const items = await this.readData();
    const index = items.findIndex((item) => item.id === id);

    if (index === -1) {
      return false;
    }

    const existingItem = items[index];

    // Already soft-deleted
    if (existingItem.deleted_at) {
      return false;
    }

    // Soft delete by setting deleted_at timestamp
    const softDeletedItem = new ClothingItem(
      existingItem.id,
      existingItem.category,
      existingItem.colour,
      existingItem.user_id,
      existingItem.brand,
      existingItem.size,
      existingItem.image_url,
      existingItem.purchase_date,
      existingItem.purchase_price,
      new Date(),
    );

    items[index] = softDeletedItem;
    await this.writeData(items);
    return true;
  }
}
