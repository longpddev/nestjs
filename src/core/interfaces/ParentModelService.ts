export interface ParentModelService<M> {
  getAllByParent(
    id: number,
    userId?: number,
  ): Promise<{
    rows: M[];
    count: number;
  }>;
  deleteAllByParent(id: number, userId?: number): Promise<number>;
}
