import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { AuditLog } from '../../entities/audit-log.entity';

export interface AuditLogData {
  userId?: string;
  action: string;
  entityType: string;
  entityId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  ipAddress?: string;
}

@Injectable()
export class AuditService {
  constructor(
    @InjectRepository(AuditLog)
    private auditLogRepo: Repository<AuditLog>,
  ) {}

  /**
   * 记录操作日志
   */
  async log(data: AuditLogData): Promise<AuditLog> {
    const log = this.auditLogRepo.create({
      userId: data.userId,
      action: data.action,
      entityType: data.entityType,
      entityId: data.entityId,
      oldValues: data.oldValues,
      newValues: data.newValues,
      ipAddress: data.ipAddress,
    });
    return this.auditLogRepo.save(log);
  }

  /**
   * 查询操作日志
   */
  async findAll(params: {
    userId?: string;
    action?: string;
    entityType?: string;
    entityId?: string;
    page?: number;
    limit?: number;
  }) {
    const { userId, action, entityType, entityId, page = 1, limit = 20 } = params;

    const query = this.auditLogRepo.createQueryBuilder('log')
      .leftJoinAndSelect('log.user', 'user')
      .orderBy('log.createdAt', 'DESC');

    if (userId) {
      query.andWhere('log.userId = :userId', { userId });
    }
    if (action) {
      query.andWhere('log.action = :action', { action });
    }
    if (entityType) {
      query.andWhere('log.entityType = :entityType', { entityType });
    }
    if (entityId) {
      query.andWhere('log.entityId = :entityId', { entityId });
    }

    const skip = (page - 1) * limit;
    query.skip(skip).take(limit);

    const [data, total] = await query.getManyAndCount();

    return {
      data,
      meta: {
        total,
        page,
        limit,
        totalPages: Math.ceil(total / limit),
      },
    };
  }

  /**
   * 获取操作日志详情
   */
  async findOne(id: string) {
    return this.auditLogRepo.findOne({
      where: { id },
      relations: ['user'],
    });
  }

  /**
   * 获取用户操作历史
   */
  async getUserHistory(userId: string, limit = 50) {
    return this.auditLogRepo.find({
      where: { userId },
      order: { createdAt: 'DESC' },
      take: limit,
    });
  }

  /**
   * 获取实体操作历史
   */
  async getEntityHistory(entityType: string, entityId: string) {
    return this.auditLogRepo.find({
      where: { entityType, entityId },
      order: { createdAt: 'DESC' },
      relations: ['user'],
    });
  }
}
