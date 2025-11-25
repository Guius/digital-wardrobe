import {
  IsString,
  IsEnum,
  IsNumber,
  IsDateString,
  IsUrl,
  IsOptional,
} from 'class-validator';
import { ClothingCategory } from '../../entities/clothing-item.entity';

export class UpdateClothingItemDto {
  @IsEnum(ClothingCategory)
  @IsOptional()
  category?: ClothingCategory;

  @IsString()
  @IsOptional()
  colour?: string;

  @IsString()
  @IsOptional()
  user_id?: string;

  @IsString()
  @IsOptional()
  brand?: string;

  @IsString()
  @IsOptional()
  size?: string;

  @IsUrl()
  @IsOptional()
  image_url?: string;

  @IsDateString()
  @IsOptional()
  purchase_date?: string;

  @IsNumber()
  @IsOptional()
  purchase_price?: number;
}
