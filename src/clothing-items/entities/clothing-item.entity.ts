export enum ClothingCategory {
  TOPS = 'tops',
  BOTTOMS = 'bottoms',
  DRESSES = 'dresses',
  OUTERWEAR = 'outerwear',
  SHOES = 'shoes',
  ACCESSORIES = 'accessories',
}

export class ClothingItem {
  id: string;
  category: ClothingCategory;
  colour: string;
  user_id: string;
  brand: string;
  size: string;
  image_url: string;
  purchase_date: Date;
  purchase_price: number;
  deleted_at: Date | null;

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
    deleted_at: Date | null = null,
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
    this.deleted_at = deleted_at;
  }
}
