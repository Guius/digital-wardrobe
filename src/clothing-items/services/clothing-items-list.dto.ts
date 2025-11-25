import { ClothingItem } from '../entities/clothing-item.entity';

export class ClothingItemsListDto {
  data: ClothingItem[];
  count: number;

  constructor(data: ClothingItem[], count: number) {
    this.data = data;
    this.count = count;
  }
}
