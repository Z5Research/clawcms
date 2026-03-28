import { IsString, IsOptional, IsEnum, IsUUID, IsBoolean, IsArray, ValidateNested } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

export class CreatePostDto {
  @ApiProperty({ description: '文章标题', example: '体育旅游十五五规划解读' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'URL 标识符', example: 'sport-tourism-15th-plan' })
  @IsString()
  slug: string;

  @ApiProperty({ description: 'Markdown 内容', example: '# 正文内容' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: 'HTML 富媒体内容' })
  @IsString()
  @IsOptional()
  contentHtml?: string;

  @ApiPropertyOptional({ description: '摘要' })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiPropertyOptional({ description: '板块 ID' })
  @IsUUID()
  @IsOptional()
  sectionId?: string;

  @ApiPropertyOptional({ description: '分类 ID' })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ description: '标签 ID 列表', isArray: true })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  tagIds?: string[];

  @ApiPropertyOptional({ description: '封面图 URL' })
  @IsString()
  @IsOptional()
  featuredImage?: string;

  @ApiPropertyOptional({ description: '状态', enum: ['draft', 'published', 'archived', 'scheduled'] })
  @IsEnum(['draft', 'published', 'archived', 'scheduled'])
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'SEO 标题' })
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @ApiPropertyOptional({ description: 'SEO 描述' })
  @IsString()
  @IsOptional()
  seoDescription?: string;

  @ApiPropertyOptional({ description: 'SEO 关键词' })
  @IsString()
  @IsOptional()
  seoKeywords?: string;
}

export class UpdatePostDto {
  @ApiPropertyOptional({ description: '文章标题' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Markdown 内容' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: 'HTML 富媒体内容' })
  @IsString()
  @IsOptional()
  contentHtml?: string;

  @ApiPropertyOptional({ description: '摘要' })
  @IsString()
  @IsOptional()
  excerpt?: string;

  @ApiPropertyOptional({ description: '板块 ID' })
  @IsUUID()
  @IsOptional()
  sectionId?: string;

  @ApiPropertyOptional({ description: '分类 ID' })
  @IsUUID()
  @IsOptional()
  categoryId?: string;

  @ApiPropertyOptional({ description: '标签 ID 列表' })
  @IsArray()
  @IsUUID('4', { each: true })
  @IsOptional()
  tagIds?: string[];

  @ApiPropertyOptional({ description: '封面图 URL' })
  @IsString()
  @IsOptional()
  featuredImage?: string;

  @ApiPropertyOptional({ description: '状态' })
  @IsEnum(['draft', 'published', 'archived', 'scheduled'])
  @IsOptional()
  status?: string;

  @ApiPropertyOptional({ description: 'SEO 标题' })
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @ApiPropertyOptional({ description: 'SEO 描述' })
  @IsString()
  @IsOptional()
  seoDescription?: string;

  @ApiPropertyOptional({ description: 'SEO 关键词' })
  @IsString()
  @IsOptional()
  seoKeywords?: string;
}

export class PublishPostDto {
  @ApiPropertyOptional({ description: '发布时间' })
  @IsOptional()
  publishedAt?: Date;

  @ApiPropertyOptional({ description: '定时发布时间' })
  @IsOptional()
  scheduledAt?: Date;
}
