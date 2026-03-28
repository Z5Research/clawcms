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
  Res,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import { Response } from 'express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { ContentsService } from './contents.service';
import { CreateContentDto, UpdateContentDto, PublishContentDto } from './dto/content.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('contents', '内容页管理')
@Controller('contents')
export class ContentsController {
  constructor(private readonly contentsService: ContentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('editor', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建内容页 (AI 友好)' })
  @ApiResponse({ status: 201, description: '内容创建成功' })
  async create(@Request() req, @Body() createContentDto: CreateContentDto) {
    return this.contentsService.create(createContentDto, req.user);
  }

  @Get()
  @ApiOperation({ summary: '内容页列表' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'isPublished', required: false, type: Boolean })
  @ApiQuery({ name: 'sectionId', required: false })
  @ApiQuery({ name: 'postId', required: false })
  @ApiQuery({ name: 'template', required: false })
  @ApiQuery({ name: 'search', required: false })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 10,
    @Query('isPublished') isPublished?: boolean,
    @Query('sectionId') sectionId?: string,
    @Query('postId') postId?: string,
    @Query('template') template?: string,
    @Query('search') search?: string,
  ) {
    return this.contentsService.findAll({
      page: +page,
      limit: +limit,
      isPublished,
      sectionId,
      postId,
      template,
      search,
    });
  }

  @Get(':id')
  @ApiOperation({ summary: '内容页详情' })
  @ApiResponse({ status: 200, description: '返回内容完整信息' })
  @ApiResponse({ status: 404, description: '内容不存在' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.contentsService.findOne(id);
  }

  @Get(':id/preview')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '生成预览链接' })
  async generatePreview(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const html = await this.contentsService.generatePreview(id);
    res.type('html').status(HttpStatus.OK).send(html);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('editor', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新内容页' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateContentDto: UpdateContentDto,
    @Request() req,
  ) {
    return this.contentsService.update(id, updateContentDto, req.user);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除内容页' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.contentsService.remove(id);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('editor', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '发布内容页' })
  async publish(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() publishContentDto: PublishContentDto,
  ) {
    return this.contentsService.publish(id, publishContentDto);
  }

  @Post(':id/clone')
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('editor', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '克隆内容页' })
  async clone(@Param('id', ParseUUIDPipe) id: string, @Request() req) {
    return this.contentsService.clone(id, req.user);
  }

  @Post(':id/render')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '渲染内容页 HTML (公开接口)' })
  async render(@Param('id', ParseUUIDPipe) id: string, @Res() res: Response) {
    const html = await this.contentsService.render(id);
    res.type('html').status(HttpStatus.OK).send(html);
  }
}
