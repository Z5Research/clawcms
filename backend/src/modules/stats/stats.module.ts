import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post } from '../../entities/post.entity';
import { Content } from '../../entities/content.entity';
import { Comment } from '../../entities/comment.entity';
import { User } from '../../entities/user.entity';
import { Section } from '../../entities/section.entity';
import { VisitStat } from '../../entities/visit-stat.entity';
import { StatsController } from './stats.controller';
import { StatsService } from './stats.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([Post, Content, Comment, User, Section, VisitStat]),
  ],
  controllers: [StatsController],
  providers: [StatsService],
  exports: [StatsService],
})
export class StatsModule {}
