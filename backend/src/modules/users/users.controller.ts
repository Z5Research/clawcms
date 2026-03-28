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
import { UsersService } from './users.service';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('users', '用户管理')
@Controller('users')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: '用户列表' })
  async findAll(@Query('page') page = 1, @Query('limit') limit = 20) {
    return this.usersService.findAll({ page: +page, limit: +limit });
  }

  @Get('me')
  @ApiOperation({ summary: '当前用户信息' })
  async getMe(@Request() req) {
    return this.usersService.findOne(req.user.id);
  }

  @Get(':id')
  @Roles('admin')
  @ApiOperation({ summary: '用户详情' })
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.findOne(id);
  }

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @Roles('admin')
  @ApiOperation({ summary: '创建用户（管理员）' })
  async create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Put(':id')
  @ApiOperation({ summary: '更新用户信息' })
  async update(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() updateUserDto: UpdateUserDto,
    @Request() req,
  ) {
    // 用户只能更新自己的信息，管理员除外
    if (req.user.role !== 'admin' && req.user.id !== id) {
      throw new Error('无权修改此用户信息');
    }
    return this.usersService.update(id, updateUserDto);
  }

  @Put(':id/role')
  @Roles('admin')
  @ApiOperation({ summary: '修改用户角色（管理员）' })
  async updateRole(
    @Param('id', ParseUUIDPipe) id: string,
    @Body() body: { role: string },
  ) {
    return this.usersService.updateRole(id, body.role);
  }

  @Put(':id/disable')
  @Roles('admin')
  @ApiOperation({ summary: '禁用/启用用户（管理员）' })
  async toggleActive(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.toggleActive(id);
  }

  @Delete(':id')
  @Roles('admin')
  @ApiOperation({ summary: '删除用户（管理员）' })
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    return this.usersService.remove(id);
  }
}
