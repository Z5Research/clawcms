import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, ILike } from 'typeorm';
import { Content } from '../../entities/content.entity';
import { User } from '../../entities/user.entity';
import { CreateContentDto, UpdateContentDto, PublishContentDto } from './dto/content.dto';

interface FindContentsOptions {
  page: number;
  limit: number;
  isPublished?: boolean;
  sectionId?: string;
  postId?: string;
  template?: string;
  search?: string;
}

@Injectable()
export class ContentsService {
  constructor(
    @InjectRepository(Content)
    private readonly contentsRepository: Repository<Content>,
  ) {}

  /**
   * 创建内容页 - AI 智能体友好
   * 支持多种内容格式：Markdown / HTML / JSON 结构化
   */
  async create(createContentDto: CreateContentDto, user: User): Promise<Content> {
    const content = this.contentsRepository.create({
      ...createContentDto,
      isPublished: createContentDto.isPublished || false,
      version: 1,
    });

    // AI 智能体发布时自动设置 slug
    if (!content.slug && content.title) {
      content.slug = this.generateSlug(content.title);
    }

    return this.contentsRepository.save(content);
  }

  /**
   * 内容页列表
   */
  async findAll(options: FindContentsOptions) {
    const { page, limit, isPublished, sectionId, postId, template, search } = options;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (isPublished !== undefined) where.isPublished = isPublished;
    if (sectionId) where.sectionId = sectionId;
    if (postId) where.postId = postId;
    if (template) where.template = template;
    if (search) {
      where.title = ILike(`%${search}%`);
    }

    const [contents, total] = await this.contentsRepository.findAndCount({
      where,
      relations: ['post', 'section'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: contents,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 内容页详情
   */
  async findOne(id: string): Promise<Content> {
    const content = await this.contentsRepository.findOne({
      where: { id },
      relations: ['post', 'section'],
    });

    if (!content) {
      throw new NotFoundException(`内容页 ${id} 不存在`);
    }

    return content;
  }

  /**
   * 更新内容页
   */
  async update(id: string, updateContentDto: UpdateContentDto, user: User): Promise<Content> {
    const content = await this.contentsRepository.findOne({ where: { id } });

    if (!content) {
      throw new NotFoundException(`内容页 ${id} 不存在`);
    }

    // 版本控制
    content.version += 1;
    content.parentContentId = id; // 保留版本历史

    Object.assign(content, updateContentDto);
    return this.contentsRepository.save(content);
  }

  /**
   * 删除内容页
   */
  async remove(id: string): Promise<void> {
    const result = await this.contentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`内容页 ${id} 不存在`);
    }
  }

  /**
   * 发布内容页
   */
  async publish(id: string, publishContentDto: PublishContentDto): Promise<Content> {
    const content = await this.contentsRepository.findOne({ where: { id } });

    if (!content) {
      throw new NotFoundException(`内容页 ${id} 不存在`);
    }

    content.isPublished = true;
    content.publishedAt = publishContentDto.publishedAt || new Date();

    if (publishContentDto.scheduledAt) {
      content.isPublished = false; // 定时发布先设为未发布
    }

    return this.contentsRepository.save(content);
  }

  /**
   * 克隆内容页
   */
  async clone(id: string, user: User): Promise<Content> {
    const original = await this.findOne(id);

    const cloned = this.contentsRepository.create({
      title: `${original.title} (副本)`,
      slug: `${original.slug}-copy-${Date.now()}`,
      contentMarkdown: original.contentMarkdown,
      contentHtml: original.contentHtml,
      contentJson: original.contentJson,
      customCss: original.customCss,
      customJs: original.customJs,
      template: original.template,
      featuredImage: original.featuredImage,
      seoTitle: original.seoTitle,
      seoDescription: original.seoDescription,
      sectionId: original.sectionId,
      version: 1,
    });

    return this.contentsRepository.save(cloned);
  }

  /**
   * 生成预览 HTML
   */
  async generatePreview(id: string): Promise<string> {
    const content = await this.findOne(id);
    return this.renderContent(content);
  }

  /**
   * 渲染内容页（公开接口）
   */
  async render(id: string): Promise<string> {
    const content = await this.findOne(id);

    if (!content.isPublished) {
      throw new NotFoundException('内容未发布');
    }

    return this.renderContent(content);
  }

  /**
   * 渲染内容 HTML
   */
  private renderContent(content: Content): string {
    let htmlContent = '';

    // 根据内容类型渲染
    if (content.contentHtml) {
      htmlContent = content.contentHtml;
    } else if (content.contentJson) {
      htmlContent = this.renderJsonContent(content.contentJson);
    } else if (content.contentMarkdown) {
      htmlContent = this.renderMarkdown(content.contentMarkdown);
    }

    return `
<!DOCTYPE html>
<html lang="zh-CN">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>${content.seoTitle || content.title}</title>
  <meta name="description" content="${content.seoDescription || ''}">
  ${content.customCss ? `<style>${content.customCss}</style>` : ''}
</head>
<body>
  <article class="content-${content.template}">
    ${htmlContent}
  </article>
  ${content.customJs ? `<script>${content.customJs}</script>` : ''}
</body>
</html>
    `.trim();
  }

  /**
   * 渲染 JSON 结构化内容
   */
  private renderJsonContent(json: Record<string, any>): string {
    if (!json.blocks || !Array.isArray(json.blocks)) {
      return '';
    }

    return json.blocks.map((block: any) => {
      switch (block.type) {
        case 'hero':
          return `
            <div class="hero-section" style="background-image: url('${block.data.backgroundImage}');">
              <h1>${block.data.title}</h1>
              <p class="subtitle">${block.data.subtitle}</p>
            </div>
          `;
        case 'gallery':
          return `
            <div class="gallery-${block.data.layout || 'grid'}">
              ${block.data.images.map((img: string) => `<img src="${img}" alt="Gallery Image">`).join('')}
            </div>
          `;
        case 'text':
          return `<div class="text-block" style="font-size: ${block.data.fontSize || '16px'}; line-height: ${block.data.lineHeight || '1.8'};">${block.data.content}</div>`;
        case 'info-box':
          return `<div class="info-box">${block.data.content}</div>`;
        case 'cta':
          return `
            <div class="cta-section">
              <h3>${block.data.title}</h3>
              <a href="${block.data.link}" class="cta-button">${block.data.buttonText}</a>
            </div>
          `;
        default:
          return '';
      }
    }).join('');
  }

  /**
   * 简单 Markdown 渲染
   */
  private renderMarkdown(markdown: string): string {
    // 简单转换，生产环境建议使用 marked 库
    return markdown
      .replace(/^# (.*$)/gim, '<h1>$1</h1>')
      .replace(/^## (.*$)/gim, '<h2>$1</h2>')
      .replace(/^### (.*$)/gim, '<h3>$1</h3>')
      .replace(/\*\*(.*)\*\*/gim, '<strong>$1</strong>')
      .replace(/\*(.*)\*/gim, '<em>$1</em>')
      .replace(/\n/gim, '<br>');
  }

  /**
   * 生成 Slug
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100);
  }
}
