import {
  Controller,
  Get,
  Post,
  Patch,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import { ClothingItemsService } from '../services/clothing-item.service';
import { CreateClothingItemDto } from './dto/create-clothing-item.dto';
import { UpdateClothingItemDto } from './dto/update-clothing-item.dto';
import { ClothingItemDto } from './dto/clothing-item.dto';
import { ClothingItemsListDto } from '../services/clothing-items-list.dto';
import { ClothingItemsListDto as ClothingItemsListResponseDto } from './dto/clothing-items-list-response.dto';
import { ClothingItem } from '../entities/clothing-item.entity';

@Controller('items')
export class ClothingItemController {
  constructor(private readonly clothingItemsService: ClothingItemsService) {}

  @Get()
  async findAll(): Promise<ClothingItemsListResponseDto> {
    const result: ClothingItemsListDto =
      await this.clothingItemsService.findAll();
    const dtoData = result.data.map((item) => this.mapToDto(item));
    return new ClothingItemsListResponseDto(dtoData, result.count);
  }

  @Get(':id')
  async findById(@Param('id') id: string): Promise<ClothingItemDto> {
    const item = await this.clothingItemsService.findById(id);
    return this.mapToDto(item);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateClothingItemDto,
  ): Promise<ClothingItemDto> {
    const item = new ClothingItem(
      createDto.id,
      createDto.category,
      createDto.colour,
      createDto.user_id,
      createDto.brand,
      createDto.size,
      createDto.image_url,
      new Date(createDto.purchase_date),
      createDto.purchase_price,
    );
    const createdItem = await this.clothingItemsService.create(item);
    return this.mapToDto(createdItem);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateClothingItemDto,
  ): Promise<ClothingItemDto> {
    const updates: Partial<ClothingItem> = {
      ...updateDto,
      purchase_date: updateDto.purchase_date
        ? new Date(updateDto.purchase_date)
        : undefined,
    };
    const updatedItem = await this.clothingItemsService.update(id, updates);
    return this.mapToDto(updatedItem);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    await this.clothingItemsService.delete(id);
  }

  private mapToDto(item: ClothingItem): ClothingItemDto {
    return new ClothingItemDto(
      item.id,
      item.category,
      item.colour,
      item.user_id,
      item.brand,
      item.size,
      item.image_url,
      item.purchase_date,
      item.purchase_price,
    );
  }
}
