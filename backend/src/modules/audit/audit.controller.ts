import {
  Controller,
  Get,
  Param,
  Query,
  UseGuards,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
  ApiQuery,
} from '@nestjs/swagger';
import { AuditService } from './audit.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('audit', '操作日志')
@Controller('audit')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class AuditController {
  constructor(private readonly auditService: AuditService) {}

  @Get('logs')
  @ApiOperation({ summary: '查询操作日志' })
  @ApiQuery({ name: 'userId', required: false })
  @ApiQuery({ name: 'action', required: false })
  @ApiQuery({ name: 'entityType', required: false })
  @ApiQuery({ name: 'entityId', required: false })
  @ApiQuery({ name: 'page', required: false, type: Number })
  @ApiQuery({ name: 'limit', required: false, type: Number })
  async findAll(
    @Query('userId') userId?: string,
    @Query('action') action?: string,
    @Query('entityType') entityType?: string,
    @Query('entityId') entityId?: string,
    @Query('page') page = 1,
    @Query('limit') limit = 20,
  ) {
    return this.auditService.findAll({
      userId,
      action,
      entityType,
      entityId,
      page: +page,
      limit: +limit,
    });
  }

  @Get('logs/:id')
  @ApiOperation({ summary: '获取日志详情' })
  async findOne(@Param('id') id: string) {
    return this.auditService.findOne(id);
  }

  @Get('users/:userId/history')
  @ApiOperation({ summary: '获取用户操作历史' })
  async getUserHistory(
    @Param('userId') userId: string,
    @Query('limit') limit = 50,
  ) {
    return this.auditService.getUserHistory(userId, +limit);
  }

  @Get('entities/:entityType/:entityId/history')
  @ApiOperation({ summary: '获取实体操作历史' })
  async getEntityHistory(
    @Param('entityType') entityType: string,
    @Param('entityId') entityId: string,
  ) {
    return this.auditService.getEntityHistory(entityType, entityId);
  }
}
