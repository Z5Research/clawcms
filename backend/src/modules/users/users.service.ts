import { Injectable, NotFoundException, ConflictException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../../entities/user.entity';
import { CreateUserDto, UpdateUserDto } from './dto/user.dto';
import * as bcrypt from 'bcrypt';

interface FindUsersOptions {
  page: number;
  limit: number;
}

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly usersRepository: Repository<User>,
  ) {}

  async findAll(options: FindUsersOptions) {
    const { page, limit } = options;
    const skip = (page - 1) * limit;

    const [users, total] = await this.usersRepository.findAndCount({
      select: ['id', 'username', 'email', 'role', 'avatar', 'isActive', 'createdAt', 'lastLoginAt'],
      skip,
      take: limit,
      order: { createdAt: 'DESC' },
    });

    return {
      data: users,
      meta: { page, limit, total, totalPages: Math.ceil(total / limit) },
    };
  }

  async findOne(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({
      where: { id },
      select: ['id', 'username', 'email', 'role', 'avatar', 'bio', 'isActive', 'createdAt', 'lastLoginAt'],
    });

    if (!user) {
      throw new NotFoundException(`用户 ${id} 不存在`);
    }

    return user;
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { username, email, password, role = 'author' } = createUserDto;

    // 检查用户名或邮箱是否已存在
    const existing = await this.usersRepository.findOne({
      where: [{ username }, { email }],
    });

    if (existing) {
      throw new ConflictException('用户名或邮箱已被使用');
    }

    const passwordHash = await bcrypt.hash(password, 10);

    const user = this.usersRepository.create({
      username,
      email,
      passwordHash,
      role: role as any,
      isActive: true,
    });

    return this.usersRepository.save(user);
  }

  async update(id: string, updateUserDto: UpdateUserDto): Promise<User> {
    const user = await this.findOne(id);

    // 检查邮箱冲突
    if (updateUserDto.email && updateUserDto.email !== user.email) {
      const existing = await this.usersRepository.findOne({
        where: { email: updateUserDto.email },
      });
      if (existing && existing.id !== id) {
        throw new ConflictException('邮箱已被使用');
      }
    }

    Object.assign(user, updateUserDto);
    return this.usersRepository.save(user);
  }

  async updateRole(id: string, role: string): Promise<User> {
    const user = await this.findOne(id);

    const validRoles = ['admin', 'editor', 'author', 'subscriber'];
    if (!validRoles.includes(role)) {
      throw new Error('无效的角色');
    }

    user.role = role as any;
    return this.usersRepository.save(user);
  }

  async toggleActive(id: string): Promise<User> {
    const user = await this.findOne(id);
    user.isActive = !user.isActive;
    return this.usersRepository.save(user);
  }

  async remove(id: string): Promise<void> {
    const result = await this.usersRepository.delete(id);
    if (result.affected === 0) {
      throw new NotFoundException(`用户 ${id} 不存在`);
    }
  }
}
