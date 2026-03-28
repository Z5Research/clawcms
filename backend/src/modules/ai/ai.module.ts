import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Post as PostEntity } from '../../entities/post.entity';
import { Content } from '../../entities/content.entity';
import { Section } from '../../entities/section.entity';
import { Category } from '../../entities/category.entity';
import { Tag } from '../../entities/tag.entity';
import { AiController } from './ai.controller';
import { AiService } from './ai.service';

@Module({
  imports: [
    TypeOrmModule.forFeature([PostEntity, Content, Section, Category, Tag]),
  ],
  controllers: [AiController],
  providers: [AiService],
  exports: [AiService],
})
export class AiModule {}
