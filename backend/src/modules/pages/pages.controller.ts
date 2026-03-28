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
} from '@nestjs/swagger';
import { PagesService } from './pages.service';
import { CreatePageDto, UpdatePageDto } from './dto/page.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('pages', '独立页管理')
@Controller('pages')
export class PagesController {
  constructor(private readonly pagesService: PagesService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('editor', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建独立页' })
  async create(@Body() createPageDto: CreatePageDto) {
    return this.pagesService.create(createPageDto);
  }

  @Get()
  @ApiOperation({ summary: '独立页列表' })
  async findAll(@Query('isPublished') isPublished?: boolean) {
    return this.pagesService.findAll(isPublished);
  }

  @Get(':slug')
  @ApiOperation({ summary: '独立页详情（通过 slug）' })
  async findBySlug(@Param('slug') slug: string) {
    return this.pagesService.findBySlug(slug);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('editor', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新独立页' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updatePageDto: UpdatePageDto,
  ) {
    return this.pagesService.update(id, updatePageDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除独立页' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.pagesService.remove(id);
  }

  @Post(':id/publish')
  @HttpCode(HttpStatus.OK)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('editor', 'admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '发布独立页' })
  async publish(@Param('id', ParseUUIDPipe) id: string) {
    return this.pagesService.publish(id);
  }
}
