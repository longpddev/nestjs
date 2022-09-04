import { usersProvider } from './users.providers';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';

@Module({
  providers: [UsersService, ...usersProvider],
  exports: [UsersService],
  controllers: [UsersController],
})
export class UsersModule {}
