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
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

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
}
