import { CardModule } from './../card/card.module';
import { CARD_GROUP_REPOSITORY } from './../../core/constants/index';
import { Module, forwardRef } from '@nestjs/common';
import { CardGroupService } from './card-group.service';
import { CardGroupController } from './card-group.controller';
import { CardGroup } from './card-group.entity';

@Module({
  imports: [forwardRef(() => CardModule)],
  providers: [
    CardGroupService,
    {
      provide: CARD_GROUP_REPOSITORY,
      useValue: CardGroup,
    },
  ],
  controllers: [CardGroupController],
  exports: [CardGroupService],
})
export class CardGroupModule {}
