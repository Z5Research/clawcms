import { NestFactory } from '@nestjs/core';
import { ValidationPipe, Logger } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { ConfigService } from '@nestjs/config';
import { NestExpressApplication } from '@nestjs/platform-express';
import { join } from 'path';
import { AppModule } from './app.module';
import { XssSanitizePipe } from './common/pipes/xss-sanitize.pipe';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, {
    logger: ['log', 'error', 'warn', 'debug', 'verbose'],
  });
  const configService = app.get(ConfigService);
  const logger = new Logger('Bootstrap');

  // 静态文件服务 - 提供公开文档
  app.useStaticAssets(join(__dirname, '..', 'public'), {
    prefix: '/public/',
  });

  // 静态文件服务 - 提供上传的媒体文件
  app.useStaticAssets(join(__dirname, '..', 'uploads'), {
    prefix: '/uploads/',
  });

  // 全局前缀
  const apiPrefix = configService.get('API_PREFIX', '/api/v1');
  app.setGlobalPrefix(apiPrefix);

  // CORS
  app.enableCors({
    origin: configService.get('CORS_ORIGIN', 'http://localhost:3000'),
    credentials: true,
  });

  // 全局验证管道 + XSS 过滤
  app.useGlobalPipes(
    new XssSanitizePipe(),
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
    }),
  );

  // Swagger 文档
  const config = new DocumentBuilder()
    .setTitle('ClawCMS API')
    .setDescription('智能体自动运营的内容管理系统 API 文档')
    .setVersion('1.2')
    .addBearerAuth()
    .addTag('auth', '认证模块')
    .addTag('posts', '文章管理')
    .addTag('sections', '板块管理')
    .addTag('pages', '独立页管理')
    .addTag('contents', '内容页管理')
    .addTag('comments', '评论管理')
    .addTag('users', '用户管理')
    .addTag('media', '媒体管理')
    .addTag('ai', 'AI 智能体接口')
    .addTag('agents', '智能体管理')
    .addTag('user-groups', '用户分组管理')
    .build();

  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api/docs', app, document);

  const port = configService.get('PORT', 3001);
  await app.listen(port);
  
  logger.log(`🚀 ClawCMS API 已启动：http://localhost:${port}${apiPrefix}`);
  logger.log(`📚 API 文档：http://localhost:${port}/api/docs`);
  logger.log(`🔒 已启用：XSS 过滤、API 限流、认证校验`);
}

bootstrap();
