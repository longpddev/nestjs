import { ModelService } from 'src/core/interfaces/ModelService';
import { defaultSetting } from './dto/settings.user.dto';
import { UserDto } from './dto/user.dto';
import { User } from './users.entity';
import { USER_REPOSITORY } from './../../core/constants/index';
import { Inject, Injectable } from '@nestjs/common';

@Injectable()
export class UsersService implements ModelService<User> {
  constructor(
    @Inject(USER_REPOSITORY) private readonly userRepository: typeof User,
  ) {}

  async create(user: UserDto): Promise<User> {
    return await this.userRepository.create<User>({
      ...user,
      settings: defaultSetting,
    });
  }

  async findOneByEmail(email: string): Promise<User> {
    return await this.userRepository.findOne<User>({ where: { email } });
  }

  async findOneById(id: number): Promise<User> {
    return await this.getById(id);
  }

  async getById(id: number) {
    return await this.userRepository.findOne<User>({
      where: { id },
      attributes: { exclude: ['password', 'createdAt', 'updatedAt'] },
    });
  }
  async getAll() {
    return await this.userRepository.findAndCountAll();
  }
  async update(id: number, data: { [key in keyof UserDto]?: UserDto[key] }) {
    const { email, ...includeData } = data;

    const [count] = await this.userRepository.update(includeData, {
      where: {
        id,
      },
    });

    return count;
  }
  async delete(id: number) {
    return await this.userRepository.destroy({
      where: {
        id,
      },
    });
  }
}
