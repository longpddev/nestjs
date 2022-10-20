import { UsersService } from './../users/users.service';
import { Injectable, NotFoundException } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';
import { hashPassword } from 'src/core/helper/function';

@Injectable()
export class AuthService {
  constructor(
    private readonly userService: UsersService,
    private readonly jwtService: JwtService,
  ) {}

  async validateUser(username: string, pass: string) {
    const user = await this.userService.findOneByEmail(username);

    if (!user) return null;

    const match = await this.comparePassword(pass, user.password);

    if (!match) return null;
    // eslint-disable-next-line @typescript-eslint/no-unused-vars
    const { password, ...result } = user['dataValues'];

    return result;
  }

  private async comparePassword(enteredPassword: string, dbPassword: string) {
    return await bcrypt.compare(enteredPassword, dbPassword);
  }

  public async login(user) {
    const token = await this.generateToken(user);

    return { user, token };
  }

  public async create(user) {
    const pass = await hashPassword(user.password);
    const newUser = await this.userService.create({ ...user, password: pass });
    const { password, ...result } = newUser['dataValues'];
    const token = await this.generateToken(result);
    return { user: result, token };
  }

  public async updatePassword(id, password) {
    const pass = await hashPassword(password);
    const isSuccess = await this.userService.update(id, { password: pass });
    if (!isSuccess) throw new NotFoundException('Update fail');

    const user = await this.userService.findOneById(id);
    const { password: _, ...result } = user['dataValues'];
    const token = await this.generateToken(result);
    return { user: result, token };
  }

  private async generateToken(user) {
    const token = await this.jwtService.signAsync(user);
    return token;
  }

  public async getById(id: number) {
    return await this.userService.findOneById(id);
  }
}
