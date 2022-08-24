import { CARD_STEP_TYPE } from './../../core/constants/index';
import { CardStepDto } from './../card-step/dto/card-step.dto';
import { AuthGuard } from '@nestjs/passport';
import { CardStepService } from './../card-step/card-step.service';
import {
  Body,
  Controller,
  Delete,
  Get,
  NotAcceptableException,
  NotFoundException,
  Param,
  Post,
  Put,
  Request,
  UseGuards,
  ValidationPipe,
} from '@nestjs/common';
import { CardService } from './card.service';
import { CardDto } from './dto/card.dto';

@Controller('card')
export class CardController {
  constructor(
    private readonly cardService: CardService,
    private readonly cardStepService: CardStepService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAll(@Request() req) {
    const userId = req.user.id;
    return await this.cardService.getAll(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getById(@Param('id') id: number, @Request() req) {
    const userId = req.user.id;
    return await this.cardService.getById(id, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post()
  async create(
    @Body('info') info: CardDto,
    @Body('cardQuestion') cardQuestion: CardStepDto,
    @Body('cardAnswer') cardAnswer: CardStepDto,
    @Body('cardExplain') cardExplain: CardStepDto,
    @Request() req,
  ) {
    const userId = req.user.id;
    const createError = (field, type) => {
      throw new NotAcceptableException(
        `field type in ${field} must be ${type}`,
      );
    };
    const card = await this.cardService.create(info, userId);
    if (!card) throw new NotFoundException("can't create card");
    cardQuestion.cardId = card.id;
    cardAnswer.cardId = card.id;
    cardExplain.cardId = card.id;
    if (cardQuestion.type !== CARD_STEP_TYPE.question)
      createError('cardQuestion', CARD_STEP_TYPE.question);
    if (cardAnswer.type !== CARD_STEP_TYPE.answer)
      createError('cardAnswer', CARD_STEP_TYPE.answer);
    if (cardExplain.type !== CARD_STEP_TYPE.explain)
      createError('cardExplain', CARD_STEP_TYPE.explain);

    try {
      await Promise.all([
        this.cardStepService.create(cardQuestion),
        this.cardStepService.create(cardAnswer),
        this.cardStepService.create(cardExplain),
      ]);
    } catch (e) {
      return e.message();
    }

    return card;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(@Param('id') id: number, @Body() body: CardDto, @Request() req) {
    const userId = req.user.id;
    return '';
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Body() body: CardDto, @Request() req) {
    const userId = req.user.id;
    return '';
  }
}
