import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { UserGroupsService, CreateUserGroupDto, UpdateUserGroupDto } from './user-groups.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('user-groups', '用户分组管理')
@Controller('user-groups')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class UserGroupsController {
  constructor(private readonly userGroupsService: UserGroupsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '创建用户分组' })
  @ApiResponse({ status: 201, description: '分组创建成功' })
  async create(@Body() createDto: CreateUserGroupDto) {
    return this.userGroupsService.create(createDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有用户分组' })
  async findAll() {
    return this.userGroupsService.findAll();
  }

  @Get(':id')
  @ApiOperation({ summary: '获取用户分组详情' })
  async findOne(@Param('id') id: string) {
    return this.userGroupsService.findOne(id);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新用户分组' })
  async update(
    @Param('id') id: string,
    @Body() updateDto: UpdateUserGroupDto,
  ) {
    return this.userGroupsService.update(id, updateDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除用户分组' })
  async remove(@Param('id') id: string) {
    await this.userGroupsService.remove(id);
    return { message: '删除成功' };
  }

  @Post(':id/users')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '添加用户到分组' })
  async addUsers(
    @Param('id') id: string,
    @Body() body: { userIds: string[] },
  ) {
    return this.userGroupsService.addUsers(id, body.userIds);
  }

  @Delete(':id/users')
  @ApiOperation({ summary: '从分组移除用户' })
  async removeUsers(
    @Param('id') id: string,
    @Body() body: { userIds: string[] },
  ) {
    return this.userGroupsService.removeUsers(id, body.userIds);
  }
}
