import { Table, Model } from 'sequelize-typescript';

@Table
export class Card extends Model<Card> {}
