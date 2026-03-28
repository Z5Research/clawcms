import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Like, ILike } from 'typeorm';
import * as slugify from 'slugify';
import { Post } from '../../entities/post.entity';
import { User } from '../../entities/user.entity';
import { CreatePostDto, UpdatePostDto, PublishPostDto } from './dto/post.dto';

interface FindPostsOptions {
  page: number;
  limit: number;
  status?: string;
  sectionId?: string;
  categoryId?: string;
  tagId?: string;
  authorId?: string;
  search?: string;
}

@Injectable()
export class PostsService {
  constructor(
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  // 公开文章列表（只返回已发布）
  async findPublic(options: Omit<FindPostsOptions, 'status'>) {
    const { page, limit, sectionId, search } = options;
    const skip = (page - 1) * limit;

    const where: any = { status: 'published' };
    if (sectionId) where.sectionId = sectionId;
    if (search) {
      where.title = ILike(`%${search}%`);
    }

    const [posts, total] = await this.postsRepository.findAndCount({
      where,
      relations: ['author', 'section', 'category', 'tags'],
      skip,
      take: limit,
      order: { publishedAt: 'DESC' },
    });

    return {
      data: posts.map(post => ({
        id: post.id,
        title: post.title,
        slug: post.slug,
        excerpt: post.excerpt,
        featuredImage: post.featuredImage,
        publishedAt: post.publishedAt,
        viewCount: post.viewCount,
        section: post.section?.name,
        author: post.author?.username,
      })),
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async create(createPostDto: CreatePostDto, user: User): Promise<Post> {
    // 生成友好的 slug
    let slug = createPostDto.slug;
    if (!slug && createPostDto.title) {
      // 使用 slugify 生成英文 slug，中文会保留
      slug = slugify.default(createPostDto.title, {
        lower: true,
        strict: true,
        locale: 'zh'
      });
      // 添加时间戳确保唯一性
      slug = `${slug}-${Date.now()}`;
    }

    const post = this.postsRepository.create({
      ...createPostDto,
      slug,
      authorId: user.id,
      status: (createPostDto.status || 'draft') as any,
    });

    return this.postsRepository.save(post) as Promise<Post>;
  }

  async findAll(options: FindPostsOptions) {
    const { page, limit, status, sectionId, categoryId, tagId, authorId, search } = options;
    const skip = (page - 1) * limit;

    const where: any = {};

    if (status) where.status = status;
    if (sectionId) where.sectionId = sectionId;
    if (categoryId) where.categoryId = categoryId;
    if (authorId) where.authorId = authorId;
    if (search) {
      where.title = ILike(`%${search}%`);
    }

    const [posts, total] = await this.postsRepository.findAndCount({
      where,
      relations: ['author', 'section', 'category', 'tags'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: posts,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async findOne(id: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['author', 'section', 'category', 'tags', 'comments'],
    });

    if (!post) {
      throw new NotFoundException(`文章 ${id} 不存在`);
    }

    // 增加阅读量
    post.viewCount += 1;
    await this.postsRepository.save(post);

    return post;
  }

  async findBySlug(slug: string): Promise<Post> {
    const post = await this.postsRepository.findOne({
      where: { slug },
      relations: ['author', 'section', 'category', 'tags'],
    });

    if (!post) {
      throw new NotFoundException(`文章 ${slug} 不存在`);
    }

    // 只返回已发布的文章
    if (post.status !== 'published') {
      throw new NotFoundException(`文章 ${slug} 不存在或未发布`);
    }

    // 增加阅读量
    post.viewCount += 1;
    await this.postsRepository.save(post);

    return post;
  }

  async update(id: string, updatePostDto: UpdatePostDto, user: User): Promise<Post> {
    const post = await this.postsRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException(`文章 ${id} 不存在`);
    }

    // 权限检查：只有作者或 editor/admin 可以修改
    if (post.authorId !== user.id && user.role === 'author') {
      throw new ForbiddenException('无权修改此文章');
    }

    Object.assign(post, updatePostDto);
    return this.postsRepository.save(post);
  }

  async remove(id: string): Promise<void> {
    const result = await this.postsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`文章 ${id} 不存在`);
    }
  }

  async publish(id: string, publishPostDto: PublishPostDto): Promise<Post> {
    const post = await this.postsRepository.findOne({ where: { id } });

    if (!post) {
      throw new NotFoundException(`文章 ${id} 不存在`);
    }

    post.status = 'published';
    post.publishedAt = publishPostDto.publishedAt || new Date();

    if (publishPostDto.scheduledAt) {
      post.status = 'scheduled';
      post.scheduledAt = publishPostDto.scheduledAt;
    }

    return this.postsRepository.save(post);
  }

  async getStats(id: string) {
    const post = await this.postsRepository.findOne({
      where: { id },
      relations: ['comments'],
    });

    if (!post) {
      throw new NotFoundException(`文章 ${id} 不存在`);
    }

    const approvedComments = post.comments?.filter(c => c.status === 'approved').length || 0;
    const pendingComments = post.comments?.filter(c => c.status === 'pending').length || 0;

    return {
      viewCount: post.viewCount,
      likeCount: post.likeCount,
      commentCount: post.commentCount,
      approvedComments,
      pendingComments,
    };
  }
}
