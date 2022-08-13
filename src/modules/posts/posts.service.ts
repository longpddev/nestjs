import { User } from './../users/users.entity';
import { Inject, Injectable } from '@nestjs/common';
import { POST_REPOSITORY } from 'src/core/constants';
import { PostDto } from './dto/post.dto';
import { Post } from './post.entiry';

@Injectable()
export class PostsService {
  constructor(
    @Inject(POST_REPOSITORY) private readonly postRepository: typeof Post,
  ) {}

  private includeUser() {
    return {
      model: User,
      attributes: { exclude: ['password'] },
    };
  }

  async create(post: PostDto, userId: number) {
    return await this.postRepository.create<Post>({ ...post, userId });
  }

  async update(post: PostDto, userId: number, id: string) {
    const [numberOfAffectedRows, [updatedPost]] =
      await this.postRepository.update<Post>(
        { ...post },
        { where: { id, userId }, returning: true },
      );

    return { numberOfAffectedRows, updatedPost };
  }

  async findAll() {
    return await this.postRepository.findAll({
      include: [this.includeUser()],
    });
  }

  async findById(id: number) {
    return await this.postRepository.findOne({
      where: { id },
      include: [this.includeUser()],
    });
  }

  async delete(id: number, userId: number) {
    return await this.postRepository.destroy({ where: { id, userId } });
  }
}
