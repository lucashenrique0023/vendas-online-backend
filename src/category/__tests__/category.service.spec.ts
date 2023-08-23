import { Test, TestingModule } from '@nestjs/testing';
import { CategoryService } from '../category.service';
import { Repository } from 'typeorm';
import { CategoryEntity } from '../entities/category.entity';
import { getRepositoryToken } from '@nestjs/typeorm';
import { categoryMock } from '../__mocks__/category.mock';
import { BadRequestException, ConflictException, NotFoundException } from '@nestjs/common';
import { createCategoryMock } from '../__mocks__/create-category.mock';

describe('CategoryService', () => {
  let service: CategoryService;
  let categoryRepository: Repository<CategoryEntity>;

  beforeEach(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [CategoryService,
        {
          provide: getRepositoryToken(CategoryEntity),
          useValue: {
            find: jest.fn().mockResolvedValue([categoryMock]),
            save: jest.fn().mockResolvedValue(categoryMock),
            findOne: jest.fn().mockRejectedValue(categoryMock),
          }
        }],
    }).compile();

    service = module.get<CategoryService>(CategoryService);
    categoryRepository = module.get<Repository<CategoryEntity>>(getRepositoryToken(CategoryEntity));
  });

  it('should be defined', () => {
    expect(service).toBeDefined();
    expect(categoryRepository).toBeDefined();
  });

  it('should return category list', async () => {
    const categories = await service.findAllCategories();

    expect(categories).toEqual([categoryMock]);
  });

  it('should return error when category list is empty', async () => {
    jest.spyOn(categoryRepository, 'find').mockResolvedValue([]);
    expect(service.findAllCategories()).rejects.toThrow(NotFoundException);
  });

  it('should return category after save', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(undefined);
    const category = await service.createCategory(createCategoryMock);
    expect(category).toEqual(categoryMock);
  });

  it('should return BadRequestException when new category name is empty', async () => {
    expect(service.findCategoryByName("")).rejects.toThrow(BadRequestException)
  });

  it('should return BadRequestException when new category name is undefined', async () => {
    expect(service.findCategoryByName(undefined)).rejects.toThrow(BadRequestException)
  });

  it('should return BadRequestException when new category name is null', async () => {
    expect(service.findCategoryByName(null)).rejects.toThrow(BadRequestException)
  });

  it('should return ConflictException when new category name already exists', async () => {
    jest.spyOn(categoryRepository, 'findOne').mockResolvedValue(categoryMock);
    expect(service.createCategory(categoryMock)).rejects.toThrow(ConflictException);
  });

});
