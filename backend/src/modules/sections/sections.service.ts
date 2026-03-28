import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Section } from '../../entities/section.entity';
import { CreateSectionDto, UpdateSectionDto } from './dto/section.dto';

@Injectable()
export class SectionsService {
  constructor(
    @InjectRepository(Section)
    private readonly sectionsRepository: Repository<Section>,
  ) {}

  async create(createSectionDto: CreateSectionDto): Promise<Section> {
    // 检查 slug 是否已存在
    const existing = await this.sectionsRepository.findOne({
      where: { slug: createSectionDto.slug },
    });

    if (existing) {
      throw new ConflictException('板块标识符已存在');
    }

    const section = this.sectionsRepository.create(createSectionDto);
    return this.sectionsRepository.save(section);
  }

  async findAll(): Promise<Section[]> {
    return this.sectionsRepository.find({
      relations: ['parent', 'posts', 'categories', 'contents'],
      order: { sortOrder: 'ASC' },
    });
  }

  async findOne(id: string): Promise<Section> {
    const section = await this.sectionsRepository.findOne({
      where: { id },
      relations: ['parent', 'posts', 'categories', 'contents'],
    });

    if (!section) {
      throw new NotFoundException(`板块 ${id} 不存在`);
    }

    return section;
  }

  async update(id: string, updateSectionDto: UpdateSectionDto): Promise<Section> {
    const section = await this.findOne(id);

    // 检查 slug 冲突
    if (updateSectionDto.slug && updateSectionDto.slug !== section.slug) {
      const existing = await this.sectionsRepository.findOne({
        where: { slug: updateSectionDto.slug },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('板块标识符已存在');
      }
    }

    Object.assign(section, updateSectionDto);
    return this.sectionsRepository.save(section);
  }

  async remove(id: string): Promise<void> {
    const section = await this.findOne(id);

    // 检查是否有子板块
    const children = await this.sectionsRepository.find({
      where: { parentId: id },
    });

    if (children.length > 0) {
      throw new ConflictException('请先删除子板块');
    }

    // 检查是否有文章
    if (section.posts && section.posts.length > 0) {
      throw new ConflictException('板块下有文章，无法删除');
    }

    const result = await this.sectionsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`板块 ${id} 不存在`);
    }
  }

  async updateOrder(orders: { id: string; sortOrder: number }[]): Promise<void> {
    const queries = orders.map(({ id, sortOrder }) =>
      this.sectionsRepository.update(id, { sortOrder }),
    );
    await Promise.all(queries);
  }
}
