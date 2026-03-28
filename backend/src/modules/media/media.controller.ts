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
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiConsumes,
  ApiQuery,
  ApiSecurity,
} from '@nestjs/swagger';
import { MediaService } from './media.service';
import { CombinedAuthGuard } from '../../common/guards/combined-auth.guard';
import { PermissionGuard } from '../../common/guards/permission.guard';
import { RequirePermission } from '../../common/decorators/permission.decorator';

@ApiTags('media', '媒体管理')
@Controller('media')
export class MediaController {
  constructor(private readonly mediaService: MediaService) {}

  @Post('upload')
  @UseGuards(CombinedAuthGuard, PermissionGuard)
  @RequirePermission('media')
  @ApiBearerAuth()
  @ApiSecurity('agent-auth')
  @ApiOperation({ summary: '上传媒体文件（支持用户和智能体）' })
  @ApiConsumes('multipart/form-data')
  @UseInterceptors(FileInterceptor('file'))
  async upload(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { folder?: string; alt?: string; description?: string },
    @Request() req,
  ) {
    return this.mediaService.upload(file, body, req.user);
  }

  @Get()
  @ApiOperation({ summary: '媒体文件列表' })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  @ApiQuery({ name: 'type', required: false, enum: ['image', 'video', 'audio', 'document'] })
  @ApiQuery({ name: 'folder', required: false })
  async findAll(
    @Query('page') page = 1,
    @Query('limit') limit = 20,
    @Query('type') type?: string,
    @Query('folder') folder?: string,
  ) {
    return this.mediaService.findAll({ page: +page, limit: +limit, type, folder });
  }

  @Get(':id')
  @ApiOperation({ summary: '媒体文件详情' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.mediaService.findOne(id);
  }

  @Delete(':id')
  @UseGuards(CombinedAuthGuard, PermissionGuard)
  @RequirePermission('media')
  @ApiBearerAuth()
  @ApiSecurity('agent-auth')
  @ApiOperation({ summary: '删除媒体文件' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.mediaService.remove(id);
  }

  @Put(':id/category')
  @UseGuards(CombinedAuthGuard, PermissionGuard)
  @RequirePermission('media')
  @ApiBearerAuth()
  @ApiSecurity('agent-auth')
  @ApiOperation({ summary: '归类媒体文件' })
  async updateCategory(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { folderPath: string },
  ) {
    return this.mediaService.updateFolder(id, body.folderPath);
  }
}
