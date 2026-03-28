import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Page } from '../../entities/page.entity';
import { CreatePageDto, UpdatePageDto } from './dto/page.dto';

@Injectable()
export class PagesService {
  constructor(
    @InjectRepository(Page)
    private readonly pagesRepository: Repository<Page>,
  ) {}

  async create(createPageDto: CreatePageDto): Promise<Page> {
    // 检查 slug 是否已存在
    const existing = await this.pagesRepository.findOne({
      where: { slug: createPageDto.slug },
    });

    if (existing) {
      throw new ConflictException('页面标识符已存在');
    }

    const page = this.pagesRepository.create(createPageDto);
    return this.pagesRepository.save(page);
  }

  async findAll(isPublished?: boolean): Promise<Page[]> {
    const where: any = {};
    if (isPublished !== undefined) {
      where.isPublished = isPublished;
    }

    return this.pagesRepository.find({
      where,
      order: { createdAt: 'DESC' },
    });
  }

  async findBySlug(slug: string): Promise<Page> {
    const page = await this.pagesRepository.findOne({
      where: { slug },
    });

    if (!page) {
      throw new NotFoundException(`页面 ${slug} 不存在`);
    }

    return page;
  }

  async update(id: string, updatePageDto: UpdatePageDto): Promise<Page> {
    const page = await this.pagesRepository.findOne({ where: { id } });

    if (!page) {
      throw new NotFoundException(`页面 ${id} 不存在`);
    }

    // 检查 slug 冲突
    if (updatePageDto.slug && updatePageDto.slug !== page.slug) {
      const existing = await this.pagesRepository.findOne({
        where: { slug: updatePageDto.slug },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('页面标识符已存在');
      }
    }

    Object.assign(page, updatePageDto);
    return this.pagesRepository.save(page);
  }

  async publish(id: string): Promise<Page> {
    const page = await this.pagesRepository.findOne({ where: { id } });

    if (!page) {
      throw new NotFoundException(`页面 ${id} 不存在`);
    }

    page.isPublished = true;
    page.publishedAt = new Date();

    return this.pagesRepository.save(page);
  }

  async remove(id: string): Promise<void> {
    const result = await this.pagesRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`页面 ${id} 不存在`);
    }
  }
}
