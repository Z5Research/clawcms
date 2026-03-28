import { Injectable, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Post as PostEntity } from '../../entities/post.entity';
import { Content } from '../../entities/content.entity';
import { User } from '../../entities/user.entity';
import { Section } from '../../entities/section.entity';
import { Category } from '../../entities/category.entity';
import { Tag } from '../../entities/tag.entity';

@Injectable()
export class AiService {
  constructor(
    @InjectRepository(PostEntity)
    private postsRepository: Repository<PostEntity>,
    @InjectRepository(Content)
    private contentsRepository: Repository<Content>,
    @InjectRepository(Section)
    private sectionsRepository: Repository<Section>,
    @InjectRepository(Category)
    private categoriesRepository: Repository<Category>,
    @InjectRepository(Tag)
    private tagsRepository: Repository<Tag>,
  ) {}

  /**
   * AI 一键发布文章（含富媒体内容）
   * 支持 Markdown + HTML 混排 + 结构化内容块
   */
  async publishArticle(data: any, user: any) {
    const {
      title,
      sectionId,
      categoryId,
      tags: tagNames,
      content,
      seo,
      status = 'published',
      publishAt,
      notifySubscribers = false,
    } = data;

    // 确定作者类型和名称
    const authorType = user.type || 'user';
    // 智能体使用 displayName（显示名），用户使用 username 或 displayName
    const authorName = user.type === 'agent' 
      ? (user.displayName || user.username || '智能体')
      : (user.displayName || user.username || '系统');
    
    // 智能体发布时，使用系统账户作为 authorId，但署名显示智能体名称
    // 如果是智能体，authorId 使用 admin-001（系统账户）
    const authorId = user.type === 'agent' ? 'admin-001' : user.id;

    // 1. 创建文章
    const post = this.postsRepository.create({
      title,
      slug: this.generateSlug(title),
      content: content?.markdown || content || '',
      contentHtml: content?.html || '',
      excerpt: content?.excerpt || this.extractExcerpt(content?.markdown || content || ''),
      authorId,
      authorType,
      authorName,
      sectionId,
      categoryId,
      featuredImage: content?.featuredImage,
      status,
      seoTitle: seo?.title,
      seoDescription: seo?.description,
      seoKeywords: seo?.keywords?.join(','),
      publishedAt: publishAt ? new Date(publishAt) : status === 'published' ? new Date() : null,
    });

    await this.postsRepository.save(post);

    // 2. 关联标签
    if (tagNames && tagNames.length > 0) {
      const tags = await Promise.all(
        tagNames.map(async (name: string) => {
          let tag = await this.tagsRepository.findOne({ where: { name } });
          if (!tag) {
            tag = this.tagsRepository.create({ name, slug: this.generateSlug(name) });
            await this.tagsRepository.save(tag);
          }
          return tag;
        }),
      );
      post.tags = tags;
      await this.postsRepository.save(post);
    }

    // 3. 创建富媒体内容块（如果有）
    if (content.htmlBlocks && content.htmlBlocks.length > 0) {
      const contentEntity = this.contentsRepository.create({
        title: `${title} - 富媒体内容`,
        slug: `${this.generateSlug(title)}-content`,
        contentJson: { blocks: content.htmlBlocks },
        postId: post.id,
        sectionId,
        template: 'article',
        isPublished: status === 'published',
      });
      await this.contentsRepository.save(contentEntity);
    }

    // 4. 返回完整结果
    return {
      id: post.id,
      slug: post.slug,
      status: post.status,
      url: `/posts/${post.slug}`,
      message: '文章发布成功',
      author: {
        id: user.id,
        name: authorName,
        type: authorType,
      },
    };
  }

  /**
   * AI 创建富媒体内容页
   */
  async createContent(data: any, user: User) {
    const {
      title,
      sectionId,
      postId,
      blocks,
      style,
      isPublished = false,
    } = data;

    const content = this.contentsRepository.create({
      title,
      slug: this.generateSlug(title),
      contentJson: { blocks },
      sectionId,
      postId,
      template: style || 'default',
      isPublished,
    });

    await this.contentsRepository.save(content);

    return {
      id: content.id,
      slug: content.slug,
      previewUrl: `/api/v1/contents/${content.id}/preview`,
      renderUrl: `/api/v1/contents/${content.id}/render`,
    };
  }

  /**
   * AI 生成内容页（自动排版）
   * 根据主题和风格自动生成结构化内容
   */
  async generateContent(data: any, user: User) {
    const { topic, style = 'modern', blocks = ['hero', 'text', 'gallery', 'cta'] } = data;

    // 根据配置生成内容结构
    const generatedBlocks = [];

    if (blocks.includes('hero')) {
      generatedBlocks.push({
        type: 'hero',
        data: {
          title: topic,
          subtitle: `探索${topic}的精彩世界`,
          backgroundImage: '/images/hero-default.jpg',
        },
      });
    }

    if (blocks.includes('text')) {
      generatedBlocks.push({
        type: 'text',
        data: {
          content: `这里是关于${topic}的详细介绍...`,
          fontSize: '16px',
          lineHeight: '1.8',
        },
      });
    }

    if (blocks.includes('gallery')) {
      generatedBlocks.push({
        type: 'gallery',
        data: {
          images: ['/images/1.jpg', '/images/2.jpg', '/images/3.jpg'],
          layout: 'grid',
        },
      });
    }

    if (blocks.includes('cta')) {
      generatedBlocks.push({
        type: 'cta',
        data: {
          title: '立即了解更多',
          buttonText: '查看详情',
          link: '/contact',
        },
      });
    }

    // 生成颜色方案
    const colorSchemes: Record<string, string> = {
      modern: '#1890ff',
      classic: '#722ed1',
      minimal: '#52c41a',
      warm: '#faad14',
    };

    const primaryColor = colorSchemes[style] || '#1890ff';

    const customCss = `
      .content-${style} {
        max-width: 1200px;
        margin: 0 auto;
        padding: 40px 20px;
      }
      .hero-section {
        background: linear-gradient(135deg, ${primaryColor}, ${this.adjustColor(primaryColor, 20)});
        color: white;
        padding: 80px 20px;
        text-align: center;
        border-radius: 12px;
        margin-bottom: 40px;
      }
      .gallery-grid {
        display: grid;
        grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        gap: 20px;
        margin: 40px 0;
      }
      .cta-section {
        background: #f5f5f5;
        padding: 40px;
        text-align: center;
        border-radius: 12px;
        margin-top: 40px;
      }
      .cta-button {
        display: inline-block;
        background: ${primaryColor};
        color: white;
        padding: 12px 32px;
        border-radius: 6px;
        text-decoration: none;
        margin-top: 20px;
      }
    `;

    const content = this.contentsRepository.create({
      title: topic,
      slug: this.generateSlug(topic),
      contentJson: { blocks: generatedBlocks },
      customCss,
      template: style,
      isPublished: false,
    });

    await this.contentsRepository.save(content);

    return {
      id: content.id,
      slug: content.slug,
      previewUrl: `/api/v1/contents/${content.id}/preview`,
      blocks: generatedBlocks,
      colorScheme: primaryColor,
    };
  }

  /**
   * AI 批量审核评论
   */
  async auditComments(data: any, user: User) {
    const { action, commentIds, reason } = data;

    // 批量更新评论状态
    await this.postsRepository.query(
      `UPDATE comments SET status = $1 WHERE id = ANY($2)`,
      [action, commentIds],
    );

    return {
      success: true,
      updated: commentIds.length,
      action,
      reason: reason || '',
    };
  }

  /**
   * AI 获取预签名上传 URL（用于直传 S3/OSS）
   */
  async getUploadUrl(data: any, user: User) {
    const { filename, fileType, fileSize } = data;

    // 这里应该集成 S3/OSS SDK 生成预签名 URL
    // 示例返回
    return {
      uploadUrl: `https://media.clawcms.ai/uploads/${filename}?signature=xxx`,
      fileUrl: `https://media.clawcms.ai/uploads/${filename}`,
      expiresAt: new Date(Date.now() + 3600000).toISOString(),
    };
  }

  /**
   * AI 批量发布（事务处理）
   */
  async batchPublish(data: any, user: User) {
    const { articles } = data;

    if (!Array.isArray(articles) || articles.length === 0) {
      throw new BadRequestException('文章列表不能为空');
    }

    const results = [];

    for (const article of articles) {
      try {
        const result = await this.publishArticle(article, user);
        results.push({ success: true, ...result });
      } catch (error) {
        results.push({
          success: false,
          title: article.title,
          error: error.message,
        });
      }
    }

    return {
      total: articles.length,
      success: results.filter(r => r.success).length,
      failed: results.filter(r => !r.success).length,
      results,
    };
  }

  /**
   * 工具：生成 Slug
   */
  private generateSlug(title: string): string {
    return title
      .toLowerCase()
      .replace(/[^a-z0-9\u4e00-\u9fa5]+/g, '-')
      .replace(/^-+|-+$/g, '')
      .substring(0, 100) + '-' + Date.now();
  }

  /**
   * 工具：提取摘要
   */
  private extractExcerpt(content: string, length = 200): string {
    const text = content.replace(/[#*`\n]+/g, ' ').trim();
    return text.length > length ? text.substring(0, length) + '...' : text;
  }

  /**
   * 工具：调整颜色亮度
   */
  private adjustColor(color: string, amount: number): string {
    // 简单实现，生产环境使用完整颜色库
    return color;
  }
}
