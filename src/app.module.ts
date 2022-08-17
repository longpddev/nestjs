import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { DatabaseModule } from './core/database/database.module';
import { ConfigModule } from '@nestjs/config';
import { UsersModule } from './modules/users/users.module';
import { AuthModule } from './modules/auth/auth.module';
import { CardModule } from './modules/card/card.module';
import { ImageModule } from './modules/image/image.module';
import { join } from 'path';
import { CardGroupModule } from './modules/card-group/card-group.module';
import { CardStepModule } from './modules/card-step/card-step.module';
@Module({
  imports: [
    DatabaseModule,
    ConfigModule.forRoot({ isGlobal: true }),
    UsersModule,
    AuthModule,
    CardModule,
    ImageModule,
    CardGroupModule,
    CardStepModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
