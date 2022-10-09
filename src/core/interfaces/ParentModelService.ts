import { QueryOptions } from './common';

export interface ParentModelService<M> {
  getAllByParent(
    id: number,
    userId?: number,
    options?: QueryOptions,
  ): Promise<{
    rows: M[];
    count: number;
  }>;
  deleteAllByParent(id: number, userId?: number): Promise<number>;
}
