import { ClothingCategory } from '../../entities/clothing-item.entity';

export class ClothingItemDto {
  id: string;
  category: ClothingCategory;
  colour: string;
  user_id: string;
  brand: string;
  size: string;
  image_url: string;
  purchase_date: Date;
  purchase_price: number;

  constructor(
    id: string,
    category: ClothingCategory,
    colour: string,
    user_id: string,
    brand: string,
    size: string,
    image_url: string,
    purchase_date: Date,
    purchase_price: number,
  ) {
    this.id = id;
    this.category = category;
    this.colour = colour;
    this.user_id = user_id;
    this.brand = brand;
    this.size = size;
    this.image_url = image_url;
    this.purchase_date = purchase_date;
    this.purchase_price = purchase_price;
  }
}
