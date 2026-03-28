import { Injectable, UnauthorizedException, ConflictException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

export interface RegisterDto {
  username: string;
  email: string;
  password: string;
  role?: 'author' | 'editor';
}

export interface LoginDto {
  username: string;
  password: string;
}

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    private jwtService: JwtService,
  ) {}

  /**
   * 用户注册
   */
  async register(registerDto: RegisterDto) {
    const { username, email, password, role = 'author' } = registerDto;

    // 检查用户名是否存在
    const existingUser = await this.usersRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existingUser) {
      throw new ConflictException('用户名或邮箱已被注册');
    }

    // 密码加密
    const passwordHash = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      username,
      email,
      passwordHash,
      role,
      isActive: true,
    });

    await this.usersRepository.save(user);

    // 生成 Token
    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
      ...tokens,
    };
  }

  /**
   * 用户登录
   */
  async login(loginDto: LoginDto) {
    const { username, password } = loginDto;

    const user = await this.usersRepository.findOne({
      where: { username },
      select: ['id', 'username', 'email', 'passwordHash', 'role', 'isActive', 'avatar'],
    });

    if (!user) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    if (!user.isActive) {
      throw new UnauthorizedException('账号已被禁用');
    }

    const isPasswordValid = await bcrypt.compare(password, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('用户名或密码错误');
    }

    // 更新最后登录时间
    user.lastLoginAt = new Date();
    await this.usersRepository.save(user);

    const tokens = await this.generateTokens(user);

    return {
      user: {
        id: user.id,
        username: user.username,
        email: user.email,
        role: user.role,
        avatar: user.avatar,
      },
      ...tokens,
    };
  }

  /**
   * 刷新 Token
   */
  async refreshToken(userId: string, refreshToken: string) {
    const user = await this.usersRepository.findOne({ where: { id: userId } });

    if (!user || !user.isActive) {
      throw new UnauthorizedException('用户不存在或已禁用');
    }

    try {
      const payload = this.jwtService.verify(refreshToken, {
        secret: process.env.JWT_REFRESH_SECRET,
      });

      if (payload.sub !== userId) {
        throw new UnauthorizedException('Token 不匹配');
      }

      const tokens = await this.generateTokens(user);
      return tokens;
    } catch (error) {
      throw new UnauthorizedException('Refresh Token 已失效');
    }
  }

  /**
   * 修改密码
   */
  async changePassword(userId: string, oldPassword: string, newPassword: string) {
    const user = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['passwordHash'],
    });

    if (!user) {
      throw new UnauthorizedException('用户不存在');
    }

    const isPasswordValid = await bcrypt.compare(oldPassword, user.passwordHash);

    if (!isPasswordValid) {
      throw new UnauthorizedException('原密码错误');
    }

    user.passwordHash = await bcrypt.hash(newPassword, 10);
    await this.usersRepository.save(user);

    return { message: '密码修改成功' };
  }

  /**
   * 生成 JWT Tokens
   */
  private async generateTokens(user: User) {
    const jwtExpiration = process.env.JWT_EXPIRATION || '1d';
    const jwtRefreshExpiration = process.env.JWT_REFRESH_EXPIRATION || '7d';
    
    const [accessToken, refreshToken] = await Promise.all([
      this.jwtService.signAsync(
        { 
          sub: user.id, 
          username: user.username, 
          role: user.role 
        },
        {
          secret: process.env.JWT_SECRET,
          expiresIn: jwtExpiration as any,
        },
      ),
      this.jwtService.signAsync(
        { sub: user.id },
        {
          secret: process.env.JWT_REFRESH_SECRET,
          expiresIn: jwtRefreshExpiration as any,
        },
      ),
    ]);

    return {
      accessToken,
      refreshToken,
      expiresIn: 86400, // 1 day in seconds
    };
  }

  /**
   * 为 AI 智能体生成专用 Token
   */
  async generateAgentToken(agentName: string, permissions: string[] = ['posts', 'contents']) {
    const agentUser = await this.usersRepository.findOne({
      where: { username: `agent_${agentName}` },
    });

    if (!agentUser) {
      throw new BadRequestException(`智能体 ${agentName} 不存在`);
    }

    return this.jwtService.signAsync(
      {
        sub: agentUser.id,
        username: agentUser.username,
        role: agentUser.role,
        permissions,
      },
      {
        secret: process.env.JWT_SECRET,
        expiresIn: '365d' as any, // AI 智能体 Token 长期有效
      },
    );
  }
}
