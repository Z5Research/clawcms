import { IsString, IsOptional, IsBoolean, IsUUID, IsNumber, IsEnum } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateSectionDto {
  @ApiProperty({ description: '板块名称', example: '政策法规' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'URL 标识符', example: 'policies' })
  @IsString()
  slug: string;

  @ApiPropertyOptional({ description: '板块描述' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: '图标', example: '📋' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ description: '主题色', example: '#1890ff' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({ description: '父板块 ID（支持二级板块）' })
  @IsUUID()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ description: '排序号', example: 1 })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional({ description: '是否可见', example: true })
  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;

  @ApiPropertyOptional({ description: 'SEO 标题' })
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @ApiPropertyOptional({ description: 'SEO 描述' })
  @IsString()
  @IsOptional()
  seoDescription?: string;

  @ApiPropertyOptional({ description: '模板类型', enum: ['default', 'grid', 'list', 'featured'] })
  @IsEnum(['default', 'grid', 'list', 'featured'])
  @IsOptional()
  template?: string;
}

export class UpdateSectionDto {
  @ApiPropertyOptional({ description: '板块名称' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiPropertyOptional({ description: 'URL 标识符' })
  @IsString()
  @IsOptional()
  slug?: string;

  @ApiPropertyOptional({ description: '板块描述' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiPropertyOptional({ description: '图标' })
  @IsString()
  @IsOptional()
  icon?: string;

  @ApiPropertyOptional({ description: '主题色' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiPropertyOptional({ description: '父板块 ID' })
  @IsUUID()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ description: '排序号' })
  @IsNumber()
  @IsOptional()
  sortOrder?: number;

  @ApiPropertyOptional({ description: '是否可见' })
  @IsBoolean()
  @IsOptional()
  isVisible?: boolean;

  @ApiPropertyOptional({ description: 'SEO 标题' })
  @IsString()
  @IsOptional()
  seoTitle?: string;

  @ApiPropertyOptional({ description: 'SEO 描述' })
  @IsString()
  @IsOptional()
  seoDescription?: string;

  @ApiPropertyOptional({ description: '模板类型' })
  @IsEnum(['default', 'grid', 'list', 'featured'])
  @IsOptional()
  template?: string;
}
