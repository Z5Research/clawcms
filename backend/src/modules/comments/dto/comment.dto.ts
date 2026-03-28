import { IsString, IsOptional, IsUUID, IsEnum, IsArray } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateCommentDto {
  @ApiProperty({ description: '文章 ID' })
  @IsUUID()
  postId: string;

  @ApiProperty({ description: '评论内容' })
  @IsString()
  content: string;

  @ApiPropertyOptional({ description: '父评论 ID（回复评论）' })
  @IsUUID()
  @IsOptional()
  parentId?: string;

  @ApiPropertyOptional({ description: '游客姓名（未登录时）' })
  @IsString()
  @IsOptional()
  guestName?: string;

  @ApiPropertyOptional({ description: '游客邮箱（未登录时）' })
  @IsString()
  @IsOptional()
  guestEmail?: string;
}

export class UpdateCommentDto {
  @ApiPropertyOptional({ description: '评论内容' })
  @IsString()
  @IsOptional()
  content?: string;

  @ApiPropertyOptional({ description: '状态', enum: ['pending', 'approved', 'rejected', 'spam'] })
  @IsEnum(['pending', 'approved', 'rejected', 'spam'])
  @IsOptional()
  status?: string;
}

export class BulkAuditDto {
  @ApiProperty({ description: '审核动作', enum: ['approved', 'rejected', 'spam'] })
  @IsEnum(['approved', 'rejected', 'spam'])
  action: string;

  @ApiProperty({ description: '评论 ID 列表', isArray: true })
  @IsArray()
  @IsUUID('4', { each: true })
  commentIds: string[];
}
