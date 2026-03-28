import {
  Controller,
  Post,
  Body,
  UseGuards,
  Request,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiSecurity,
} from '@nestjs/swagger';
import { AiService } from './ai.service';
import { CombinedAuthGuard } from '../../common/guards/combined-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { RequirePermission } from '../../common/decorators/permission.decorator';

@ApiTags('ai', 'AI 智能体接口')
@Controller('ai')
@UseGuards(CombinedAuthGuard, PermissionGuard)
export class AiController {
  constructor(private readonly aiService: AiService) {}

  @Post('publish')
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission('posts', { checkSection: true, sectionField: 'sectionId' })
  @ApiOperation({ summary: 'AI 一键发布文章（支持用户和智能体）' })
  @ApiResponse({ status: 201, description: '发布成功' })
  @ApiBearerAuth()
  @ApiSecurity('agent-auth')
  async publishArticle(@Request() req, @Body() body: any) {
    return this.aiService.publishArticle(body, req.user);
  }

  @Post('contents/create')
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission('contents', { checkSection: true, sectionField: 'sectionId' })
  @ApiOperation({ summary: 'AI 创建富媒体内容页' })
  @ApiResponse({ status: 201, description: '创建成功' })
  @ApiBearerAuth()
  @ApiSecurity('agent-auth')
  async createContent(@Request() req, @Body() body: any) {
    return this.aiService.createContent(body, req.user);
  }

  @Post('contents/generate')
  @HttpCode(HttpStatus.OK)
  @RequirePermission('contents')
  @ApiOperation({ summary: 'AI 生成内容页（自动排版）' })
  @ApiResponse({ status: 200, description: '生成成功' })
  @ApiBearerAuth()
  @ApiSecurity('agent-auth')
  async generateContent(@Request() req, @Body() body: any) {
    return this.aiService.generateContent(body, req.user);
  }

  @Post('comments/audit')
  @HttpCode(HttpStatus.OK)
  @RequirePermission('comments')
  @ApiOperation({ summary: 'AI 批量审核评论' })
  @ApiResponse({ status: 200, description: '审核成功' })
  @ApiBearerAuth()
  @ApiSecurity('agent-auth')
  async auditComments(@Request() req, @Body() body: any) {
    return this.aiService.auditComments(body, req.user);
  }

  @Post('media/upload-url')
  @HttpCode(HttpStatus.OK)
  @RequirePermission('media')
  @ApiOperation({ summary: 'AI 获取预签名上传 URL' })
  @ApiResponse({ status: 200, description: '返回上传 URL' })
  @ApiBearerAuth()
  @ApiSecurity('agent-auth')
  async getUploadUrl(@Request() req, @Body() body: any) {
    return this.aiService.getUploadUrl(body, req.user);
  }

  @Post('batch/publish')
  @HttpCode(HttpStatus.CREATED)
  @RequirePermission('posts', { checkSection: true, sectionField: 'sectionId' })
  @ApiOperation({ summary: 'AI 批量发布（事务处理）' })
  @ApiResponse({ status: 201, description: '批量发布成功' })
  @ApiBearerAuth()
  @ApiSecurity('agent-auth')
  async batchPublish(@Request() req, @Body() body: any) {
    return this.aiService.batchPublish(body, req.user);
  }
}
