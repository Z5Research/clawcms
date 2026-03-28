import {
  IsString,
  IsOptional,
  IsBoolean,
  IsUUID,
  IsObject,
  IsArray,
  ValidateNested,
  IsEnum,
} from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';

/**
 * 内容块类型（用于 JSON 结构化内容）
 */
export class ContentBlockDto {
  @ApiProperty({ description: '块类型', enum: ['hero', 'gallery', 'text', 'info-box', 'cta', 'video', 'custom'] })
  @IsEnum(['hero', 'gallery', 'text', 'info-box', 'cta', 'video', 'custom'])
  type: string;

  @ApiProperty({ description: '块数据', example: { title: '标题', content: '内容' } })
  @IsObject()
  data: Record<string, any>;
}

/**
 * 创建内容页 DTO - AI 智能体友好
 */
export class CreateContentDto {
  @ApiProperty({ description: '标题', example: '2025 体育旅游精品线路' })
  @IsString()
  title: string;

  @ApiPropertyOptional({ description: 'URL 标识符（AI 可自动生成）' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ description: 'Markdown 内容' })
  @IsString()
  @IsOptional()
  contentMarkdown?: string;

  @ApiPropertyOptional({ description: '自定义 HTML 内容' })
  @IsString()
  @IsOptional()
  contentHtml?: string;

  @ApiPropertyOptional({ description: 'JSON 结构化内容（推荐 AI 使用）', type: [ContentBlockDto] })
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => ContentBlockDto)
  @IsOptional()
  contentJson?: Record<string, any>;

  @ApiPropertyOptional({ description: '自定义 CSS' })
  @IsString()
  @IsOptional()
  customCss?: string;

  @ApiPropertyOptional({ description: '自定义 JavaScript' })
  @IsString()
  @IsOptional()
  customJs?: string;

  @ApiPropertyOptional({ description: '模板类型', enum: ['default', 'landing-page', 'article', 'gallery', 'custom'] })
  @IsEnum(['default', 'landing-page', 'article', 'gallery', 'custom'])
  @IsOptional()
  template?: string;

  @ApiPropertyOptional({ description: '封面图 URL' })
  @IsString()
  @IsOptional()
  featuredImage?: string;

  @ApiPropertyOptional({ description: 'SEO 标题' })
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @ApiPropertyOptional({ description: 'SEO 描述' })
  @IsString()
  @IsOptional()
  seoDescription?: string;

  @ApiPropertyOptional({ description: '是否发布', example: false })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiPropertyOptional({ description: '关联文章 ID' })
  @IsUUID()
  @IsOptional()
  postId?: string;

  @ApiPropertyOptional({ description: '归属板块 ID' })
  @IsUUID()
  @IsOptional()
  sectionId?: string;
}

/**
 * 更新内容页 DTO
 */
export class UpdateContentDto {
  @ApiPropertyOptional({ description: '标题' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'Markdown 内容' })
  @IsString()
  @IsOptional()
  contentMarkdown?: string;

  @ApiPropertyOptional({ description: '自定义 HTML 内容' })
  @IsString()
  @IsOptional()
  contentHtml?: string;

  @ApiPropertyOptional({ description: 'JSON 结构化内容' })
  @IsObject()
  @IsOptional()
  contentJson?: Record<string, any>;

  @ApiPropertyOptional({ description: '自定义 CSS' })
  @IsString()
  @IsOptional()
  customCss?: string;

  @ApiPropertyOptional({ description: '自定义 JavaScript' })
  @IsString()
  @IsOptional()
  customJs?: string;

  @ApiPropertyOptional({ description: '模板类型' })
  @IsEnum(['default', 'landing-page', 'article', 'gallery', 'custom'])
  @IsOptional()
  template?: string;

  @ApiPropertyOptional({ description: '封面图 URL' })
  @IsString()
  @IsOptional()
  featuredImage?: string;

  @ApiPropertyOptional({ description: 'SEO 标题' })
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @ApiPropertyOptional({ description: 'SEO 描述' })
  @IsString()
  @IsOptional()
  seoDescription?: string;

  @ApiPropertyOptional({ description: '是否发布' })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;

  @ApiPropertyOptional({ description: '归属板块 ID' })
  @IsUUID()
  @IsOptional()
  sectionId?: string;
}

/**
 * 发布内容页 DTO
 */
export class PublishContentDto {
  @ApiPropertyOptional({ description: '发布时间' })
  @IsOptional()
  publishedAt?: Date;

  @ApiPropertyOptional({ description: '定时发布时间' })
  @IsOptional()
  scheduledAt?: Date;
}
