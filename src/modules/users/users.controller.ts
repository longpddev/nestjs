import { SettingsUser } from './dto/settings.user.dto';
import { UsersService } from './users.service';
import {
  Body,
  Controller,
  Put,
  Request,
  UseGuards,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { UserDto } from './dto/user.dto';
import { hashPassword } from 'src/core/helper/function';

@Controller('users')
export class UsersController {
  constructor(protected readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Put('settings')
  async updateSettings(
    @Body('settings') settings: SettingsUser,
    @Request() req,
  ) {
    return await this.usersService.update(req.user.id, { settings });
  }

  @UseGuards(AuthGuard('jwt'))
  @Put()
  async update(@Body('name') name: string, @Request() req) {
    return await this.usersService.update(req.user.id, { name });
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('change-password')
  async changePassword(
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Request() req,
  ) {
    const { email, id } = req.user;

    const user = await this.usersService.findOneByEmail(email);

    if (!user) throw new NotFoundException('User do not found');
    const oldPasswordHash = await hashPassword(oldPassword);
    if (user.password !== oldPasswordHash)
      throw new NotAcceptableException('password do not match');

    const newPasswordHash = await hashPassword(newPassword);
    return await this.usersService.update(id, { password: newPasswordHash });
  }
}
