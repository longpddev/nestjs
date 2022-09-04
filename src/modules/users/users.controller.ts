import { SettingsUser } from './dto/settings.user.dto';
import { UsersService } from './users.service';
import { Body, Controller, Put, Request, UseGuards } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Controller('users')
export class UsersController {
  constructor(protected readonly usersService: UsersService) {}

  @UseGuards(AuthGuard('jwt'))
  @Put('settings')
  async updateSettings(
    @Body('settings') settings: SettingsUser,
    @Request() req,
  ) {
    await this.usersService.update(req.user.id, { settings });
  }
}
