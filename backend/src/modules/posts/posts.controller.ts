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
import { PostsService } from './posts.service';
import { CreatePostDto, UpdatePostDto, PublishPostDto } from './dto/post.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('posts', '文章管理')
@Controller('posts')
export class PostsController {
  constructor(private readonly postsService: PostsService) {}

  // ========== 公开 API ==========
  
  @Get('public')
  @ApiOperation({ summary: '公开文章列表（已发布）' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'sectionId', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findPublic(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('sectionId') sectionId?: string,
    @Query('search') search?: string,
  ) {
    return this.postsService.findPublic({
      page: +page,
      limit: +limit,
      sectionId,
      search,
    });
  }

  // ========== 管理 API ==========

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('editor', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建文章' })
  @ApiResponse({ status: 201, description: '文章创建成功' })
  async create(@Request() req, @Body() createPostDto: CreatePostDto) {
    return this.postsService.create(createPostDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: '文章列表' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'status', required: false, enum: ['draft', 'published', 'archived'] })
  @ApiQuery({ name: 'sectionId', required: false })
  @ApiQuery({ name: 'categoryId', required: false })
  @ApiQuery({ name: 'tagId', required: false })
  @ApiQuery({ name: 'authorId', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('status') status?: string,
    @Query('sectionId') sectionId?: string,
    @Query('categoryId') categoryId?: string,
    @Query('tagId') tagId?: string,
    @Query('authorId') authorId?: string,
    @Query('search') search?: string,
  ) {
    return this.postsService.findAll({
      page: +page,
      limit: +limit,
      status,
      sectionId,
      categoryId,
      tagId,
      authorId,
      search,
    });
  }

  @Get('slug/:slug')
  @ApiOperation({ summary: '根据 slug 获取文章详情' })
  @ApiResponse({ status: 200, description: '返回文章完整信息' })
  @ApiResponse({ status: 404, description: '文章不存在' })
  async findBySlug(@Param('slug') slug: string) {
    return this.postsService.findBySlug(slug);
  }

  @Get(':id')
  @ApiOperation({ summary: '文章详情' })
  @ApiResponse({ status: 200, description: '返回文章完整信息' })
  @ApiResponse({ status: 404, description: '文章不存在' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('editor', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新文章' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Request() req,
    @Body() updatePostDto: UpdatePostDto,
  ) {
    return this.postsService.update(id, updatePostDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除文章' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.remove(id);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('editor', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '发布文章' })
  async publish(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() publishPostDto: PublishPostDto,
  ) {
    return this.postsService.publish(id, publishPostDto);
  }

  @Get(':id/stats')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '文章统计' })
  async getStats(@Param('id', ParseUUIDPipe) id: string) {
    return this.postsService.getStats(id);
  }
}
