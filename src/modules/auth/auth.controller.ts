import { DoesUserExist } from './../../core/guards/doesUserExist.guard';
import { UserDto } from './../users/dto/user.dto';
import { AuthService } from './auth.service';
import {
  Body,
  Request,
  Controller,
  Post,
  UseGuards,
  Get,
  Put,
  NotFoundException,
  NotAcceptableException,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { hashPassword } from 'src/core/helper/function';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) {}

  @UseGuards(AuthGuard('local'))
  @Post('login')
  async login(@Request() req) {
    return await this.authService.login(req.user);
  }
  @UseGuards(DoesUserExist)
  @Post('signup')
  async signUp(@Body() user: UserDto) {
    return await this.authService.create(user);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('user-info')
  async tokenLogin(@Request() req) {
    return await this.authService.getById(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('change-password')
  async changePassword(
    @Body('oldPassword') oldPassword: string,
    @Body('newPassword') newPassword: string,
    @Request() req,
  ) {
    const { email, id } = req.user;
    const isMatch = await this.authService.validateUser(email, oldPassword);
    if (!isMatch) throw new NotAcceptableException('password do not match');

    return await this.authService.updatePassword(id, newPassword);
    // return await this.usersService.update(req.user.id, includeData);
  }
}
