import { IsNumber } from 'class-validator';

export class SettingsUser {
  @IsNumber()
  maxCardInDay: number;
}

export const defaultSetting = new SettingsUser();

defaultSetting.maxCardInDay = 30;
