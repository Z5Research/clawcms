import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JwtModule } from '@nestjs/jwt';
import { PassportModule } from '@nestjs/passport';
import { APP_GUARD } from '@nestjs/core';
import { ThrottlerModule, ThrottlerGuard } from '@nestjs/throttler';
import { JwtAuthGuard } from './common/guards/jwt-auth.guard';
import { CommonModule } from './common/common.module';

// 模块
import { AuthModule } from './modules/auth/auth.module';
import { PostsModule } from './modules/posts/posts.module';
import { SectionsModule } from './modules/sections/sections.module';
import { ContentsModule } from './modules/contents/contents.module';
import { CommentsModule } from './modules/comments/comments.module';
import { UsersModule } from './modules/users/users.module';
import { MediaModule } from './modules/media/media.module';
import { StatsModule } from './modules/stats/stats.module';
import { AiModule } from './modules/ai/ai.module';
import { AgentsModule } from './modules/agents/agents.module';
import { UserGroupsModule } from './modules/user-groups/user-groups.module';
import { HealthModule } from './modules/health/health.module';
import { AuditModule } from './modules/audit/audit.module';

// 实体
import { User } from './entities/user.entity';
import { Post } from './entities/post.entity';
import { Section } from './entities/section.entity';
import { Category } from './entities/category.entity';
import { Tag } from './entities/tag.entity';
import { Comment } from './entities/comment.entity';
import { Content } from './entities/content.entity';
import { Page } from './entities/page.entity';
import { Media } from './entities/media.entity';
import { Agent } from './entities/agent.entity';
import { UserGroup } from './entities/user-group.entity';
import { AuditLog } from './entities/audit-log.entity';

@Module({
  imports: [
    CommonModule,
    // API 限流配置：每分钟最多 60 次请求
    ThrottlerModule.forRoot([
      {
        name: 'short',
        ttl: 1000,     // 1 秒
        limit: 3,      // 最多 3 次请求
      },
      {
        name: 'medium',
        ttl: 10000,    // 10 秒
        limit: 20,     // 最多 20 次请求
      },
      {
        name: 'long',
        ttl: 60000,    // 1 分钟
        limit: 60,     // 最多 60 次请求
      },
    ]),
    ConfigModule.forRoot({ isGlobal: true }),
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      useFactory: (configService: ConfigService) => {
        const dbType = configService.get('DB_TYPE', 'sqlite');
        if (dbType === 'sqlite') {
          return {
            type: 'better-sqlite3',
            database: configService.get('DB_DATABASE', 'clawcms.db'),
            entities: [
              User, Post, Section, Category, Tag, Comment, Content, Page, Media, Agent, UserGroup, AuditLog,
            ],
            synchronize: true,
          };
        }
        return {
          type: 'postgres',
          host: configService.get('DB_HOST', 'localhost'),
          port: configService.get<number>('DB_PORT', 5432),
          username: configService.get('DB_USERNAME', 'postgres'),
          password: configService.get('DB_PASSWORD', ''),
          database: configService.get('DB_DATABASE', 'clawcms'),
          entities: [
            User, Post, Section, Category, Tag, Comment, Content, Page, Media, Agent, UserGroup, AuditLog,
          ],
          synchronize: true,
        };
      },
      inject: [ConfigService],
    }),
    JwtModule.register({
      global: true,
      secret: process.env.JWT_SECRET || 'default-secret-key',
      signOptions: { expiresIn: '365d' },
    }),
    PassportModule,
    AuthModule,
    PostsModule,
    SectionsModule,
    ContentsModule,
    CommentsModule,
    UsersModule,
    MediaModule,
    StatsModule,
    AiModule,
    AgentsModule,
    UserGroupsModule,
    HealthModule,
    AuditModule,
  ],
  controllers: [],
  providers: [
    // 全局限流守卫
    {
      provide: APP_GUARD,
      useClass: ThrottlerGuard,
    },
  ],
})
export class AppModule {}
