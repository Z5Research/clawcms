import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Comment } from '../../entities/comment.entity';
import { Post } from '../../entities/post.entity';
import { User } from '../../entities/user.entity';
import { CreateCommentDto, UpdateCommentDto, BulkAuditDto } from './dto/comment.dto';

interface FindCommentsOptions {
  postId?: string;
  status?: string;
  page: number;
  limit: number;
}

@Injectable()
export class CommentsService {
  constructor(
    @InjectRepository(Comment)
    private readonly commentsRepository: Repository<Comment>,
    @InjectRepository(Post)
    private readonly postsRepository: Repository<Post>,
  ) {}

  async create(createCommentDto: CreateCommentDto, user?: User): Promise<Comment> {
    const { postId, content, parentId, guestName, guestEmail } = createCommentDto;

    // 验证文章是否存在
    const post = await this.postsRepository.findOne({ where: { id: postId } });
    if (!post) {
      throw new NotFoundException('文章不存在');
    }

    const comment = this.commentsRepository.create({
      postId,
      userId: user?.id,
      content,
      parentId,
      guestName,
      guestEmail,
      status: 'pending', // 默认待审核
    });

    return this.commentsRepository.save(comment);
  }

  async findAll(options: FindCommentsOptions) {
    const { postId, status, page, limit } = options;
    const skip = (page - 1) * limit;

    const where: any = {};
    if (postId) where.postId = postId;
    if (status) where.status = status;

    const [comments, total] = await this.commentsRepository.findAndCount({
      where,
      relations: ['post', 'user', 'parent'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: comments,
      meta: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  async updateStatus(id: string, status: string): Promise<Comment> {
    const comment = await this.commentsRepository.findOne({ where: { id } });

    if (!comment) {
      throw new NotFoundException(`评论 ${id} 不存在`);
    }

    comment.status = status as any;
    comment.updatedAt = new Date();

    // 更新文章评论数
    if (status === 'approved') {
      const post = await this.postsRepository.findOne({ where: { id: comment.postId } });
      if (post) {
        post.commentCount += 1;
        await this.postsRepository.save(post);
      }
    }

    return this.commentsRepository.save(comment);
  }

  async bulkAudit(bulkAuditDto: BulkAuditDto) {
    const { action, commentIds } = bulkAuditDto;

    const updates = commentIds.map((id) =>
      this.commentsRepository.update(id, { status: action as any }),
    );

    await Promise.all(updates);

    return {
      success: true,
      updated: commentIds.length,
      action,
    };
  }

  async remove(id: string): Promise<void> {
    const result = await this.commentsRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`评论 ${id} 不存在`);
    }
  }

  async getStats() {
    const [total, pending, approved, rejected] = await Promise.all([
      this.commentsRepository.count(),
      this.commentsRepository.count({ where: { status: 'pending' } }),
      this.commentsRepository.count({ where: { status: 'approved' } }),
      this.commentsRepository.count({ where: { status: 'rejected' } }),
    ]);

    return { total, pending, approved, rejected };
  }
}
