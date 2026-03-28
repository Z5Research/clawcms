import {
  Controller,
  Get,
  Query,
  UseGuards,
  Request,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { StatsService } from './stats.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('stats', '统计模块')
@Controller('stats')
@UseGuards(JwtAuthGuard)
@ApiBearerAuth()
export class StatsController {
  constructor(private readonly statsService: StatsService) {}

  @Get('overview')
  @ApiOperation({ summary: '全站概览' })
  async getOverview(@Request() req) {
    return this.statsService.getOverview();
  }

  @Get('posts')
  @ApiOperation({ summary: '文章统计' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  async getPostStats(@Query('days') days = 30) {
    return this.statsService.getPostStats(days);
  }

  @Get('visits')
  @ApiOperation({ summary: '访问统计' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  async getVisitStats(@Query('days') days = 30) {
    return this.statsService.getVisitStats(days);
  }

  @Get('comments')
  @ApiOperation({ summary: '评论统计' })
  async getCommentStats() {
    return this.statsService.getCommentStats();
  }

  @Get('users')
  @ApiOperation({ summary: '用户统计' })
  async getUserStats() {
    return this.statsService.getUserStats();
  }

  @Get('sections')
  @ApiOperation({ summary: '板块统计' })
  async getSectionStats() {
    return this.statsService.getSectionStats();
  }

  @Get('ai-usage')
  @ApiOperation({ summary: 'AI 使用统计' })
  @ApiQuery({ name: 'days', required: false, type: Number })
  async getAiUsageStats(@Query('days') days = 30) {
    return this.statsService.getAiUsageStats(days);
  }
}
