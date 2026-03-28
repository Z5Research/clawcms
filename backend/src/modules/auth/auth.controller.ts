import {
  Controller,
  Post,
  Body,
  Request,
  UseGuards,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { AuthService, RegisterDto, LoginDto } from './auth.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';

@ApiTags('auth', '认证模块')
@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @Post('register')
  @ApiOperation({ summary: '用户注册' })
  @ApiResponse({ status: 201, description: '注册成功' })
  @ApiResponse({ status: 409, description: '用户名或邮箱已存在' })
  async register(@Body() registerDto: RegisterDto) {
    return this.authService.register(registerDto);
  }

  @Post('login')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '用户登录' })
  @ApiResponse({ status: 200, description: '登录成功' })
  @ApiResponse({ status: 401, description: '用户名或密码错误' })
  async login(@Body() loginDto: LoginDto) {
    return this.authService.login(loginDto);
  }

  @Post('refresh')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '刷新 Token' })
  @ApiBearerAuth()
  @ApiResponse({ status: 200, description: '刷新成功' })
  async refresh(@Request() req, @Body('refreshToken') refreshToken: string) {
    return this.authService.refreshToken(req.user.id, refreshToken);
  }

  @Post('change-password')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '修改密码' })
  @ApiResponse({ status: 200, description: '修改成功' })
  async changePassword(
    @Request() req,
    @Body() body: { oldPassword: string; newPassword: string },
  ) {
    return this.authService.changePassword(
      req.user.id,
      body.oldPassword,
      body.newPassword,
    );
  }

  @Post('agent/token')
  @UseGuards(JwtAuthGuard)
  @ApiBearerAuth()
  @ApiOperation({ summary: '为 AI 智能体生成 Token (管理员专用)' })
  @ApiResponse({ status: 200, description: '生成成功' })
  async generateAgentToken(
    @Request() req,
    @Body() body: { agentName: string; permissions?: string[] },
  ) {
    return this.authService.generateAgentToken(
      body.agentName,
      body.permissions,
    );
  }
}
