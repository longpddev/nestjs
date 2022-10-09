import { QueryOptions } from './common';

export interface ModelService<M, DTO = any> {
  getById(id: number, userId?: number): Promise<M>;
  getAll(
    userId?: number,
    options?: QueryOptions,
  ): Promise<{ rows: M[]; count: number }>;
  create(data: DTO, userId?: number): Promise<M>;
  update(id: number, data: DTO, userId?: number): Promise<number>;
  delete(id: number, userId?: number): Promise<number>;
}
