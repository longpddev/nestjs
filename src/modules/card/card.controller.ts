import { CardGroupService } from './../card-group/card-group.service';
import { CardProcessService } from './card.process.service';
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
  ParseBoolPipe,
  ParseIntPipe,
  Post,
  Put,
  Query,
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
    private readonly cardProcessService: CardProcessService,
    private readonly cardGroupService: CardGroupService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Get()
  async getAll(@Request() req, @Query() query: { groupId?: number }) {
    const userId = req.user.id;
    if (query.groupId)
      return await this.cardService.getAllByParent(query.groupId);
    return await this.cardService.getAll(userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('learned')
  async learnedToday(@Query('groupId') groupId: number) {
    return await this.cardProcessService.getLearnedToday(groupId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get('learn-today')
  async learnToday(
    @Query('limit') limit: number,
    @Query('groupId') groupId: number,
  ) {
    return await this.cardProcessService.getLearnToday(groupId, limit);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('learned')
  async leaned(
    @Body('cardId', ParseIntPipe) cardId: number,
    @Body('isHard', ParseBoolPipe) isHard: boolean,
  ) {
    return await this.cardProcessService.markLearned(cardId, isHard);
  }

  @UseGuards(AuthGuard('jwt'))
  @Get(':id')
  async getById(@Param('id') id: number, @Request() req) {
    const userId = req.user.id;
    return await this.cardService.getById(id, userId);
  }

  @UseGuards(AuthGuard('jwt'))
  @Post('fake-data')
  async fakeData(
    @Body('groupId', ParseIntPipe) groupId: number,
    @Body('limit', ParseIntPipe) limit: number,
    @Request() req,
  ) {
    const result = await Promise.all(
      Array(limit)
        .fill(1)
        .map(() => this.cardService.fakeData(groupId, req.user.id)),
    );

    return result;
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

    const result = await this.cardGroupService.getById(
      info.cardGroupId,
      userId,
    );

    if (!result) throw new NotAcceptableException('group is not found');

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
      const [rowQuestion, rowAnswer, rowExplain] = await Promise.all([
        this.cardStepService.create(cardQuestion),
        this.cardStepService.create(cardAnswer),
        this.cardStepService.create(cardExplain),
      ]);

      await Promise.all([
        this.cardProcessService.create({
          frontCardId: rowQuestion.id,
          backCardId: rowAnswer.id,
          times: 0,
          timeLastLearn: new Date(),
          timeNextLearn: new Date(),
          cardMainId: card.id,
          cardGroupId: info.cardGroupId,
        }),
        this.cardProcessService.create({
          frontCardId: rowAnswer.id,
          backCardId: rowExplain.id,
          times: 0,
          timeLastLearn: new Date(),
          timeNextLearn: new Date(),
          cardMainId: card.id,
          cardGroupId: info.cardGroupId,
        }),
      ]);
    } catch (e) {
      throw e;
    }

    return card;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put('step/:id')
  async updateStep(@Param('id') id: number, @Body() body: CardStepDto) {
    const numberEffect = await this.cardStepService.update(id, body);

    if (numberEffect === 0) throw new NotFoundException('No card update');

    return numberEffect;
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id')
  async update(@Param('id') id: number, @Body() body: CardDto, @Request() req) {
    const userId = req.user.id;
    return '';
  }

  @UseGuards(AuthGuard('jwt'))
  @Put(':id/changeGroup')
  async changeGroup(
    @Param('id') id: number,
    @Body('groupId') groupId: number,
    @Request() req,
  ) {
    const card = await this.cardService.getById(id, req.user.id);
    if (!card) throw new NotFoundException("card doesn't found");

    const { cardStep, id: idStep, ...cardField } = card;

    const countRowEffect = this.cardService.update(
      id,
      {
        ...cardField,
        cardGroupId: groupId,
      },
      req.user.id,
    );

    return countRowEffect;
  }

  @UseGuards(AuthGuard('jwt'))
  @Delete(':id')
  async delete(@Param('id') id: number) {
    return await this.cardService.delete(id);
  }
}
