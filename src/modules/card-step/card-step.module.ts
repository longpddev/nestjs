import { ImageModule } from './../image/image.module';
import { CARD_STEP_REPOSITORY } from './../../core/constants/index';
import { Module } from '@nestjs/common';
import { CardStepService } from './card-step.service';
import { CardStep } from './card-step.entity';

@Module({
  imports: [ImageModule],
  providers: [
    CardStepService,
    {
      provide: CARD_STEP_REPOSITORY,
      useValue: CardStep,
    },
  ],
  exports: [CardStepService],
})
export class CardStepModule {}
