import { CardProcess } from './../../modules/card/card.process.entity';
import { CardStep } from './../../modules/card-step/card-step.entity';
import { Sequelize } from 'sequelize-typescript';
import { CardGroup } from 'src/modules/card-group/card-group.entity';
import { Card } from 'src/modules/card/card.entity';
import { Image } from 'src/modules/image/image.entity';
import { User } from 'src/modules/users/users.entity';
import { SEQUELIZE, DEVELOPMENT, TEST, PRODUCTION } from '../constants';
import { databaseConfig } from './database.config';

export const databaseProviders = [
  {
    provide: SEQUELIZE,
    useFactory: async () => {
      let config;
      switch (process.env.NODE_ENV) {
        case DEVELOPMENT:
          config = databaseConfig.development;
          break;
        case TEST:
          config = databaseConfig.test;
          break;
        case PRODUCTION:
          config = databaseConfig.production;
          break;
        default:
          config = databaseConfig.development;
      }
      const sequelize = new Sequelize(config);
      sequelize.addModels([
        User,
        Image,
        CardGroup,
        Card,
        CardStep,
        CardProcess,
      ]);
      await sequelize.sync();
      return sequelize;
    },
  },
];
