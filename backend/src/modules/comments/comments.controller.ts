import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  ParseUUIDPipe,
  UseGuards,
  Request,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { CommentsService } from './comments.service';
import { CreateCommentDto, UpdateCommentDto, BulkAuditDto } from './dto/comment.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('comments', '评论管理')
@Controller('comments')
export class CommentsController {
  constructor(private readonly commentsService: CommentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '创建评论（公开接口）' })
  @ApiResponse({ status: 201, description: '评论创建成功' })
  async create(@Body() createCommentDto: CreateCommentDto, @Request() req) {
    return this.commentsService.create(createCommentDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: '评论列表' })
  @ApiQuery({ name: 'postId', required: false })
  @ApiQuery({ name: 'status', required: false, enum: ['pending', 'approved', 'rejected', 'spam'] })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('postId') postId?: string,
    @Query('status') status?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.commentsService.findAll({ postId, status, page: +page, limit: +limit });
  }

  @Put(':id/approve')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('editor', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '审核通过评论' })
  async approve(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.updateStatus(id, 'approved');
  }

  @Put(':id/reject')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('editor', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '拒绝评论' })
  async reject(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.updateStatus(id, 'rejected');
  }

  @Put(':id/spam')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('editor', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '标记为垃圾评论' })
  async markAsSpam(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.updateStatus(id, 'spam');
  }

  @Post('bulk-audit')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('editor', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '批量审核（AI 友好）' })
  async bulkAudit(@Body() bulkAuditDto: BulkAuditDto) {
    return this.commentsService.bulkAudit(bulkAuditDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除评论' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.commentsService.remove(id);
  }
}
