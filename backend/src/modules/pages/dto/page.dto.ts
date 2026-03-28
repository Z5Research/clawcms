import { IsString, IsOptional, IsBoolean, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreatePageDto {
  @ApiProperty({ description: '页面标题', example: '关于我们' })
  @IsString()
  title: string;

  @ApiProperty({ description: 'URL 标识符', example: 'about-us' })
  @IsString()
  slug: string;

  @ApiProperty({ description: '页面内容（Markdown）' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: '页面内容（HTML 富媒体）' })
  @IsString()
  @IsOptional()
  contentHtml?: string;

  @ApiPropertyOptional({ description: '模板类型', enum: ['full-width', 'sidebar', 'landing', 'blank'], example: 'full-width' })
  @IsEnum(['full-width', 'sidebar', 'landing', 'blank'])
  @IsOptional()
  template?: string;

  @ApiPropertyOptional({ description: '自定义 CSS' })
  @IsString()
  @IsOptional()
  customCss?: string;

  @ApiPropertyOptional({ description: 'Meta 标题' })
  @IsString()
  @IsOptional()
  metaTitle?: string;

  @ApiPropertyOptional({ description: 'Meta 描述' })
  @IsString()
  @IsOptional()
  metaDescription?: string;

  @ApiPropertyOptional({ description: 'Meta 关键词' })
  @IsString()
  @IsOptional()
  metaKeywords?: string;

  @ApiPropertyOptional({ description: '是否发布', example: false })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}

export class UpdatePageDto {
  @ApiPropertyOptional({ description: '页面标题' })
  @IsString()
  @IsOptional()
  title?: string;

  @ApiPropertyOptional({ description: 'URL 标识符' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ description: '页面内容（Markdown）' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: '页面内容（HTML 富媒体）' })
  @IsString()
  @IsOptional()
  contentHtml?: string;

  @ApiPropertyOptional({ description: '模板类型' })
  @IsEnum(['full-width', 'sidebar', 'landing', 'blank'])
  @IsOptional()
  template?: string;

  @ApiPropertyOptional({ description: '自定义 CSS' })
  @IsString()
  @IsOptional()
  customCss?: string;

  @ApiPropertyOptional({ description: 'Meta 标题' })
  @IsString()
  @IsOptional()
  metaTitle?: string;

  @ApiPropertyOptional({ description: 'Meta 描述' })
  @IsString()
  @IsOptional()
  metaDescription?: string;

  @ApiPropertyOptional({ description: 'Meta 关键词' })
  @IsString()
  @IsOptional()
  metaKeywords?: string;

  @ApiPropertyOptional({ description: '是否发布' })
  @IsBoolean()
  @IsOptional()
  isPublished?: boolean;
}
