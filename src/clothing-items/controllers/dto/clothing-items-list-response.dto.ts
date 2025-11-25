import { ClothingItemDto } from '../dto/clothing-item.dto';

export class ClothingItemsListDto {
  data: ClothingItemDto[];
  count: number;

  constructor(data: ClothingItemDto[], count: number) {
    this.data = data;
    this.count = count;
  }
}
