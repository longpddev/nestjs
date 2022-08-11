import { UsersService } from './../users/users.service';
import { Injectable } from '@nestjs/common';
import * as bcrypt from 'bcrypt';
import { JwtService } from '@nestjs/jwt';

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
    const pass = await this.hashPassword(user.password);
    const newUser = await this.userService.create({ ...user, password: pass });
    const { password, ...result } = newUser['dataValues'];
    const token = await this.generateToken(result);
    return { user: result, token };
  }

  private async generateToken(user) {
    const token = await this.jwtService.signAsync(user);
    return token;
  }

  private async hashPassword(password) {
    const hash = await bcrypt.hash(password, 10);
    return hash;
  }
}
