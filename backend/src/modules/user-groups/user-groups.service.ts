import { Injectable, NotFoundException, BadRequestException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { UserGroup } from '../../entities/user-group.entity';
import { User } from '../../entities/user.entity';

export interface CreateUserGroupDto {
  name: string;
  displayName: string;
  description?: string;
  permissions?: string[];
  level?: number;
}

export interface UpdateUserGroupDto {
  displayName?: string;
  description?: string;
  permissions?: string[];
  isActive?: boolean;
  level?: number;
}

@Injectable()
export class UserGroupsService {
  constructor(
    @InjectRepository(UserGroup)
    private userGroupsRepository: Repository<UserGroup>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async create(createDto: CreateUserGroupDto): Promise<UserGroup> {
    const existing = await this.userGroupsRepository.findOne({
      where: { name: createDto.name },
    });
    if (existing) {
      throw new BadRequestException(`分组 ${createDto.name} 已存在`);
    }

    const group = this.userGroupsRepository.create({
      ...createDto,
      permissions: createDto.permissions || [],
      level: createDto.level || 0,
      isActive: true,
    });

    return this.userGroupsRepository.save(group);
  }

  async findAll(): Promise<UserGroup[]> {
    return this.userGroupsRepository.find({
      relations: ['users'],
      order: { level: 'DESC', createdAt: 'ASC' },
    });
  }

  async findOne(id: string): Promise<UserGroup> {
    const group = await this.userGroupsRepository.findOne({
      where: { id },
      relations: ['users'],
    });
    if (!group) {
      throw new NotFoundException(`分组 ${id} 不存在`);
    }
    return group;
  }

  async update(id: string, updateDto: UpdateUserGroupDto): Promise<UserGroup> {
    const group = await this.findOne(id);
    Object.assign(group, updateDto);
    return this.userGroupsRepository.save(group);
  }

  async remove(id: string): Promise<void> {
    const group = await this.findOne(id);
    if (group.users && group.users.length > 0) {
      throw new BadRequestException(`分组下有 ${group.users.length} 个用户，无法删除`);
    }
    await this.userGroupsRepository.delete(id);
  }

  async addUsers(id: string, userIds: string[]): Promise<UserGroup> {
    const group = await this.findOne(id);
    const users = await this.usersRepository.find({ where: { id: In(userIds) } });
    if (!group.users) group.users = [];
    const existingIds = group.users.map(u => u.id);
    const newUsers = users.filter(u => !existingIds.includes(u.id));
    group.users.push(...newUsers);
    return this.userGroupsRepository.save(group);
  }

  async removeUsers(id: string, userIds: string[]): Promise<UserGroup> {
    const group = await this.findOne(id);
    if (!group.users) return group;
    group.users = group.users.filter(u => !userIds.includes(u.id));
    return this.userGroupsRepository.save(group);
  }
}
