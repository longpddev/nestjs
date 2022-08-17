import { CARD_REPOSITORY } from './../../core/constants/index';
import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { Card } from './card.entity';

@Module({
  providers: [
    CardService,
    {
      provide: CARD_REPOSITORY,
      useValue: Card,
    },
  ],
  controllers: [CardController],
})
export class CardModule {}
