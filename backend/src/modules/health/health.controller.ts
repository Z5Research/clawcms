import { Controller, Get } from '@nestjs/common';
import {
  HealthCheckService,
  HealthCheck,
  TypeOrmHealthIndicator,
  MemoryHealthIndicator,
  DiskHealthIndicator,
} from '@nestjs/terminus';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
} from '@nestjs/swagger';

@ApiTags('health', '健康检查')
@Controller('health')
export class HealthController {
  constructor(
    private health: HealthCheckService,
    private db: TypeOrmHealthIndicator,
    private memory: MemoryHealthIndicator,
    private disk: DiskHealthIndicator,
  ) {}

  @Get()
  @HealthCheck()
  @ApiOperation({ summary: '健康检查' })
  @ApiResponse({ status: 200, description: '服务健康' })
  @ApiResponse({ status: 503, description: '服务不健康' })
  check() {
    return this.health.check([
      // 数据库连接检查
      () => this.db.pingCheck('database'),
      // 内存检查（堆内存不超过 500MB）
      () => this.memory.checkHeap('memory_heap', 500 * 1024 * 1024),
      // RSS 内存检查
      () => this.memory.checkRSS('memory_rss', 500 * 1024 * 1024),
      // 磁盘检查（剩余空间不少于 1GB）
      () => this.disk.checkStorage('disk', {
        thresholdPercent: 0.9,
        path: '/',
      }),
    ]);
  }

  @Get('liveness')
  @ApiOperation({ summary: '存活检查（Kubernetes）' })
  @ApiResponse({ status: 200, description: '服务存活' })
  liveness() {
    return { status: 'ok', timestamp: new Date().toISOString() };
  }

  @Get('readiness')
  @HealthCheck()
  @ApiOperation({ summary: '就绪检查（Kubernetes）' })
  @ApiResponse({ status: 200, description: '服务就绪' })
  @ApiResponse({ status: 503, description: '服务未就绪' })
  readiness() {
    return this.health.check([
      () => this.db.pingCheck('database'),
    ]);
  }
}
