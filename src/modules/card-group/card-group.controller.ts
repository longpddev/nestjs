import { CardGroupService } from './card-group.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
} from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { CardGroupDto } from './dto/card-group.dto';

@Controller('group-card')
export class CardGroupController {
  constructor(private readonly cardGroupService: CardGroupService) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAll(@Request() req) {
    return await this.cardGroupService.getAll(req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getById(@Param('id') id: number, @Request() req) {
    return await this.cardGroupService.getById(id, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(@Body() body: CardGroupDto, @Request() req) {
    return await this.cardGroupService.create(body, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(
    @Param('id') id: number,
    @Body() body: CardGroupDto,
    @Request() req,
  ) {
    return await this.cardGroupService.update(id, body, req.user.id);
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delele(@Param('id') id: number, @Request() req) {
    return await this.cardGroupService.delete(id, req.user.id);
  }
}
