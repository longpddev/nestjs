import { PostsService } from './posts.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { PostDto } from './dto/post.dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('posts')
export class PostsController {
  constructor(private readonly postService: PostsService) {}
  @Get(':id')
  async findOne(@Param('id') id: number) {
    const post = await this.postService.findById(id);

    if (!post) throw new NotFoundException("This Post doesn't exits");

    return post;
  }

  @Get()
  async findAll() {
    return await this.postService.findAll();
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() post: PostDto, @Request() req) {
    return await this.postService.create(post, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(@Param('id') id: number, @Body() post: PostDto, @Request() req) {
    const { numberOfAffectedRows, updatedPost } = await this.postService.update(
      post,
      id,
      req.user.id,
    );

    if (numberOfAffectedRows === 0)
      throw new NotFoundException("This Post doesn't exit");

    return updatedPost;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async remove(@Param('id') id: number, @Request() req) {
    const result = await this.postService.delete(id, req.user.id);

    if (result === 0) throw new NotFoundException("This Post doesn't exit");

    return 'Successfully deleted';
  }
}
