import { CARD_STEP_REPOSITORY } from './../../core/constants/index';
import { Module } from '@nestjs/common';
import { CardStepService } from './card-step.service';
import { CardStep } from './card-step.entity';

@Module({
  providers: [
    CardStepService,
    {
      provide: CARD_STEP_REPOSITORY,
      useValue: CardStep,
    },
  ],
})
export class CardStepModule {}
