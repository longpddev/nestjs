export interface ParentModelService<M> {
  getAllByParent(id: number, userId?: number): Promise<M[]>;
  deleteAllByParent(id: number, userId?: number): Promise<number>;
}
