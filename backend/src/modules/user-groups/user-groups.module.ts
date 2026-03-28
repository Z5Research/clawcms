import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UserGroup } from '../../entities/user-group.entity';
import { User } from '../../entities/user.entity';
import { UserGroupsController } from './user-groups.controller';
import { UserGroupsService } from './user-groups.service';

@Module({
  imports: [TypeOrmModule.forFeature([UserGroup, User])],
  controllers: [UserGroupsController],
  providers: [UserGroupsService],
  exports: [UserGroupsService],
})
export class UserGroupsModule {}
