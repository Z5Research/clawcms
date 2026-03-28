import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThan } from 'typeorm';
import { Post } from '../../entities/post.entity';
import { Content } from '../../entities/content.entity';
import { Comment } from '../../entities/comment.entity';
import { User } from '../../entities/user.entity';
import { Section } from '../../entities/section.entity';
import { VisitStat } from '../../entities/visit-stat.entity';

@Injectable()
export class StatsService {
  constructor(
    @InjectRepository(Post)
    private postsRepository: Repository<Post>,
    @InjectRepository(Content)
    private contentsRepository: Repository<Content>,
    @InjectRepository(Comment)
    private commentsRepository: Repository<Comment>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Section)
    private sectionsRepository: Repository<Section>,
    @InjectRepository(VisitStat)
    private visitStatsRepository: Repository<VisitStat>,
  ) {}

  /**
   * 全站概览（老板看板核心数据）
   */
  async getOverview() {
    const now = new Date();
    const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
    const yesterday = new Date(today.getTime() - 86400000);

    // 核心指标
    const [
      totalPosts,
      publishedPosts,
      totalContents,
      totalComments,
      pendingComments,
      totalUsers,
      totalSections,
    ] = await Promise.all([
      this.postsRepository.count(),
      this.postsRepository.count({ where: { status: 'published' } }),
      this.contentsRepository.count({ where: { isPublished: true } }),
      this.commentsRepository.count(),
      this.commentsRepository.count({ where: { status: 'pending' } }),
      this.usersRepository.count({ where: { isActive: true } }),
      this.sectionsRepository.count({ where: { isVisible: true } }),
    ]);

    // 今日阅读（简化版，实际应统计 visit_stats）
    const todayViews = await this.postsRepository
      .createQueryBuilder('post')
      .select('SUM(post.view_count)', 'total')
      .getRawOne();

    // 昨日数据对比
    const yesterdayViews = todayViews; // 简化处理

    const viewGrowth = todayViews.total && yesterdayViews.total
      ? (((todayViews.total - yesterdayViews.total) / yesterdayViews.total) * 100).toFixed(1)
      : 0;

    return {
      coreMetrics: {
        totalPosts,
        publishedPosts,
        totalContents,
        totalComments,
        pendingComments,
        totalUsers,
        totalSections,
      },
      todayStats: {
        views: todayViews.total || 0,
        growth: `${viewGrowth}%`,
      },
      quickActions: {
        pendingComments,
        draftPosts: await this.postsRepository.count({ where: { status: 'draft' } }),
        scheduledPosts: await this.postsRepository.count({ where: { status: 'scheduled' } }),
      },
      lastUpdated: now.toISOString(),
    };
  }

  /**
   * 文章统计
   */
  async getPostStats(days: number) {
    const startDate = new Date(Date.now() - days * 86400000);

    const newPosts = await this.postsRepository.count({
      where: { createdAt: MoreThan(startDate) },
    });

    const topPosts = await this.postsRepository.find({
      where: { status: 'published' },
      order: { viewCount: 'DESC' },
      take: 10,
      select: ['id', 'title', 'viewCount', 'likeCount', 'commentCount'],
    });

    const postsBySection = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.section', 'section')
      .select(['section.name', 'COUNT(post.id) as count'])
      .groupBy('section.id')
      .getRawMany();

    return {
      newPosts,
      topPosts,
      postsBySection,
      period: `${days}天`,
    };
  }

  /**
   * 访问统计
   */
  async getVisitStats(days: number) {
    const startDate = new Date(Date.now() - days * 86400000);

    const dailyVisits = await this.visitStatsRepository
      .createQueryBuilder('visit')
      .select(`DATE(visit.visited_at) as date, COUNT(*) as count`)
      .where('visit.visited_at > :startDate', { startDate })
      .groupBy(`DATE(visit.visited_at)`)
      .orderBy(`DATE(visit.visited_at)`, 'ASC')
      .getRawMany();

    return {
      dailyVisits,
      totalVisits: dailyVisits.reduce((sum, d) => sum + parseInt(d.count), 0),
      period: `${days}天`,
    };
  }

  /**
   * 评论统计
   */
  async getCommentStats() {
    const [total, pending, approved, rejected] = await Promise.all([
      this.commentsRepository.count(),
      this.commentsRepository.count({ where: { status: 'pending' } }),
      this.commentsRepository.count({ where: { status: 'approved' } }),
      this.commentsRepository.count({ where: { status: 'rejected' } }),
    ]);

    const recentComments = await this.commentsRepository.find({
      order: { createdAt: 'DESC' },
      take: 10,
      relations: ['post', 'user'],
    });

    return {
      total,
      status: { pending, approved, rejected },
      recentComments,
    };
  }

  /**
   * 用户统计
   */
  async getUserStats() {
    const [total, byRole] = await Promise.all([
      this.usersRepository.count({ where: { isActive: true } }),
      this.usersRepository
        .createQueryBuilder('user')
        .select('user.role, COUNT(user.id) as count')
        .groupBy('user.role')
        .getRawMany(),
    ]);

    const newUsersThisMonth = await this.usersRepository.count({
      where: {
        isActive: true,
        createdAt: MoreThan(new Date(new Date().getFullYear(), new Date().getMonth(), 1)),
      },
    });

    return {
      total,
      byRole,
      newUsersThisMonth,
    };
  }

  /**
   * 板块统计
   */
  async getSectionStats() {
    const sections = await this.sectionsRepository
      .createQueryBuilder('section')
      .leftJoinAndSelect('section.posts', 'posts')
      .leftJoinAndSelect('section.contents', 'contents')
      .select([
        'section.id',
        'section.name',
        'section.slug',
        'COUNT(DISTINCT posts.id) as postCount',
        'COUNT(DISTINCT contents.id) as contentCount',
      ])
      .groupBy('section.id')
      .orderBy('section.sortOrder', 'ASC')
      .getRawAndEntities();

    return {
      sections: sections.entities.map((section, index) => ({
        ...section,
        postCount: sections.raw[index]?.postCount || 0,
        contentCount: sections.raw[index]?.contentCount || 0,
      })),
    };
  }

  /**
   * AI 智能体使用统计
   */
  async getAiUsageStats(days: number) {
    const startDate = new Date(Date.now() - days * 86400000);

    const aiPublishedPosts = await this.postsRepository
      .createQueryBuilder('post')
      .leftJoinAndSelect('post.author', 'user')
      .where('user.username LIKE :pattern', { pattern: 'agent_%' })
      .andWhere('post.createdAt > :startDate', { startDate })
      .getCount();

    const aiCreatedContents = await this.contentsRepository
      .createQueryBuilder('content')
      .leftJoinAndSelect('content.post', 'post')
      .leftJoinAndSelect('post.author', 'user')
      .where('user.username LIKE :pattern', { pattern: 'agent_%' })
      .andWhere('content.createdAt > :startDate', { startDate })
      .getCount();

    return {
      aiPublishedPosts,
      aiCreatedContents,
      period: `${days}天`,
    };
  }
}
