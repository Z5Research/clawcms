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
import { SectionsService } from './sections.service';
import { CreateSectionDto, UpdateSectionDto } from './dto/section.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('sections', '板块管理')
@Controller('sections')
export class SectionsController {
  constructor(private readonly sectionsService: SectionsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '创建板块' })
  async create(@Body() createSectionDto: CreateSectionDto) {
    return this.sectionsService.create(createSectionDto);
  }

  @Get()
  @ApiOperation({ summary: '板块列表（树形结构）' })
  async findAll() {
    return this.sectionsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '板块详情' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.sectionsService.findOne(id);
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '更新板块' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateSectionDto: UpdateSectionDto,
  ) {
    return this.sectionsService.update(id, updateSectionDto);
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '删除板块' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.sectionsService.remove(id);
  }

  @Put('order')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiBearerAuth()
  @ApiOperation({ summary: '板块排序（拖拽排序）' })
  async updateOrder(@Body() body: { orders: { id: string; sortOrder: number }[] }) {
    return this.sectionsService.updateOrder(body.orders);
  }
}
