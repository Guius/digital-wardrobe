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
  NotFoundException,
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
    if (!item) {
      throw new NotFoundException(`Clothing item with ID ${id} not found`);
    }
    return this.mapToDto(item);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  async create(
    @Body() createDto: CreateClothingItemDto,
  ): Promise<ClothingItemDto> {
    const createdItem = await this.clothingItemsService.create(
      createDto.category,
      createDto.colour,
      createDto.user_id,
      createDto.brand,
      createDto.size,
      createDto.image_url,
      new Date(createDto.purchase_date),
      createDto.purchase_price,
    );
    return this.mapToDto(createdItem);
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateClothingItemDto,
  ): Promise<ClothingItemDto> {
    const updatedItem = await this.clothingItemsService.update(id, {
      category: updateDto.category,
      colour: updateDto.colour,
      user_id: updateDto.user_id,
      brand: updateDto.brand,
      size: updateDto.size,
      image_url: updateDto.image_url,
      purchase_date: updateDto.purchase_date
        ? new Date(updateDto.purchase_date)
        : undefined,
      purchase_price: updateDto.purchase_price,
    });
    if (!updatedItem) {
      throw new NotFoundException(`Clothing item with ID ${id} not found`);
    }
    return this.mapToDto(updatedItem);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  async delete(@Param('id') id: string): Promise<void> {
    const deleted = await this.clothingItemsService.delete(id);
    if (!deleted) {
      throw new NotFoundException(`Clothing item with ID ${id} not found`);
    }
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
