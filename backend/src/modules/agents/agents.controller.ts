import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  UseGuards,
  Req,
  Res,
  HttpStatus,
  HttpCode,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiResponse,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { Response } from 'express';
import { AgentsService, CreateAgentDto, UpdateAgentDto } from './agents.service';
import { JwtAuthGuard } from '../../common/guards/jwt-auth.guard';
import { RolesGuard } from '../../common/guards/roles.guard';
import { Roles } from '../../common/decorators/roles.decorator';

@ApiTags('agents', '智能体管理')
@Controller('agents')
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles('admin')
@ApiBearerAuth()
export class AgentsController {
  constructor(private readonly agentsService: AgentsService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: '创建智能体' })
  @ApiResponse({ status: 201, description: '智能体创建成功' })
  async create(@Body() createAgentDto: CreateAgentDto) {
    return this.agentsService.create(createAgentDto);
  }

  @Get()
  @ApiOperation({ summary: '获取所有智能体' })
  async findAll() {
    const agents = await this.agentsService.findAll();
    // 隐藏敏感信息
    return agents.map(agent => ({
      ...agent,
      apiSecret: '******', // 不返回 secret
    }));
  }

  @Get(':id')
  @ApiOperation({ summary: '获取智能体详情' })
  async findOne(@Param('id') id: string) {
    const agent = await this.agentsService.findOne(id);
    return {
      ...agent,
      apiSecret: '******',
    };
  }

  @Put(':id')
  @ApiOperation({ summary: '更新智能体' })
  async update(
    @Param('id') id: string,
    @Body() updateAgentDto: UpdateAgentDto,
  ) {
    return this.agentsService.update(id, updateAgentDto);
  }

  @Delete(':id')
  @ApiOperation({ summary: '删除智能体' })
  async remove(@Param('id') id: string) {
    await this.agentsService.remove(id);
    return { message: '删除成功' };
  }

  @Post(':id/regenerate-key')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: '重新生成 API Key' })
  async regenerateKey(@Param('id') id: string) {
    return this.agentsService.regenerateKey(id);
  }

  @Get(':id/guide.md')
  @ApiOperation({ summary: '获取智能体 API 文档 (Markdown)' })
  async getGuide(
    @Param('id') id: string,
    @Res() res: Response,
  ) {
    const agent = await this.agentsService.findOne(id);
    const content = await this.agentsService.generateGuideContent(agent);

    res.setHeader('Content-Type', 'text/markdown; charset=utf-8');
    res.setHeader('Content-Disposition', `inline; filename="${agent.name}-guide.md"`);
    res.send(content);
  }
}
