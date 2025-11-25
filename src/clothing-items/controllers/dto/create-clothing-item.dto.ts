import {
  IsString,
  IsEnum,
  IsNumber,
  IsDateString,
  IsUrl,
  IsNotEmpty,
  IsUUID,
} from 'class-validator';
import { ClothingCategory } from '../../entities/clothing-item.entity';

export class CreateClothingItemDto {
  @IsUUID()
  @IsNotEmpty()
  id: string;

  @IsEnum(ClothingCategory)
  @IsNotEmpty()
  category: ClothingCategory;

  @IsString()
  @IsNotEmpty()
  colour: string;

  @IsString()
  @IsNotEmpty()
  user_id: string;

  @IsString()
  @IsNotEmpty()
  brand: string;

  @IsString()
  @IsNotEmpty()
  size: string;

  @IsUrl()
  @IsNotEmpty()
  image_url: string;

  @IsDateString()
  @IsNotEmpty()
  purchase_date: string;

  @IsNumber()
  @IsNotEmpty()
  purchase_price: number;
}
