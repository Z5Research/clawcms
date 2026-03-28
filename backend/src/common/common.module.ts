import { Module, Global } from '@nestjs/common';
import { JwtAuthGuard } from './guards/jwt-auth.guard';
import { AgentAuthGuard } from './guards/agent-auth.guard';
import { CombinedAuthGuard } from './guards/combined-auth.guard';
import { PermissionGuard } from './guards/permission.guard';
import { AgentsModule } from '../modules/agents/agents.module';

@Global()
@Module({
  imports: [AgentsModule],
  providers: [
    JwtAuthGuard,
    AgentAuthGuard,
    CombinedAuthGuard,
    PermissionGuard,
  ],
  exports: [
    JwtAuthGuard,
    AgentAuthGuard,
    CombinedAuthGuard,
    PermissionGuard,
  ],
})
export class CommonModule {}
