import { CardGroupModule } from './../card-group/card-group.module';
import { CardProcess } from './card.process.entity';
import { ImageModule } from './../image/image.module';
import { CardStepModule } from './../card-step/card-step.module';
import {
  CARD_REPOSITORY,
  CARD_PROCESS_REPOSITORY,
} from './../../core/constants/index';
import { Module } from '@nestjs/common';
import { CardService } from './card.service';
import { CardController } from './card.controller';
import { Card } from './card.entity';
import { CardProcessService } from './card.process.service';

@Module({
  imports: [CardStepModule, ImageModule, CardGroupModule],
  providers: [
    CardService,
    CardProcessService,
    {
      provide: CARD_REPOSITORY,
      useValue: Card,
    },
    {
      provide: CARD_PROCESS_REPOSITORY,
      useValue: CardProcess,
    },
  ],
  controllers: [CardController],
  exports: [CardService, CardProcessService],
})
export class CardModule {}
