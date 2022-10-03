import { IsNotEmpty, IsNumber } from 'class-validator';

type CardAnimate = 'fade' | 'slide' | 'none';
export class SettingsUser {
  @IsNumber()
  maxCardInDay: number;

  @IsNotEmpty()
  cardAnimate: CardAnimate;
}

export const defaultSetting = new SettingsUser();

defaultSetting.maxCardInDay = 30;
defaultSetting.cardAnimate = 'fade';
