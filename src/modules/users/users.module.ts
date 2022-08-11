import { usersProvider } from './users.providers';
import { Module } from '@nestjs/common';
import { UsersService } from './users.service';

@Module({
  providers: [UsersService, ...usersProvider],
  exports: [UsersService],
})
export class UsersModule {}
