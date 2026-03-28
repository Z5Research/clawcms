import { IsString, IsOptional, IsEmail, IsEnum, IsBoolean } from 'class-validator';
import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: '用户名', example: 'zhangsan' })
  @IsString()
  username: string;

  @ApiProperty({ description: '邮箱', example: 'zhang@example.com' })
  @IsEmail()
  email: string;

  @ApiProperty({ description: '密码' })
  @IsString()
  password: string;

  @ApiPropertyOptional({ description: '角色', enum: ['admin', 'editor', 'author', 'subscriber'], example: 'author' })
  @IsEnum(['admin', 'editor', 'author', 'subscriber'])
  @IsOptional()
  role?: string;
}

export class UpdateUserDto {
  @ApiPropertyOptional({ description: '用户名' })
  @IsString()
  @IsOptional()
  username?: string;

  @ApiPropertyOptional({ description: '邮箱' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiPropertyOptional({ description: '头像 URL' })
  @IsString()
  @IsOptional()
  avatar?: string;

  @ApiPropertyOptional({ description: '个人简介' })
  @IsString()
  @IsOptional()
  bio?: string;
}
