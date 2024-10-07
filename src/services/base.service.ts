import { EntityRepository, FindOptionsWhere, Repository } from "typeorm";
import { QueryDeepPartialEntity } from "typeorm/query-builder/QueryPartialEntity";
import { ICRUDService } from "../utils/ICRUDService";

export abstract class BaseService<T> implements ICRUDService<T> {
  public readonly repository: Repository<T>;

  constructor(repository: Repository<T>) {
    this.repository = repository;
  }

  async beforeCreate(data: T): Promise<void> {}
  async beforeUpdate(
    id: number,
    data: QueryDeepPartialEntity<T>
  ): Promise<void> {}

  async findAll(): Promise<T[]> {
    return await this.repository.find();
  }

  async findById(value: any, option: string): Promise<T | null> {
    return await this.repository.findOneBy({
      [option]: value,
    } as FindOptionsWhere<T>);
  }

  async create(data: T): Promise<T> {
    await this.beforeCreate(data);
    return await this.repository.save(data);
  }

  async update(id: any, data: QueryDeepPartialEntity<T>): Promise<T | null> {
    await this.beforeUpdate(id, data);
    const updatedEntity = await this.repository.update({ id }, data);

    if (updatedEntity.affected === 0) {
      return null;
    }

    return await this.repository.findOneBy({
      id,
    } as unknown as FindOptionsWhere<T>);
  }

  async delete(id: number): Promise<boolean> {
    const deletedEntity = await this.repository.delete({
      id,
    } as unknown as FindOptionsWhere<T>);

    return deletedEntity.affected > 0;
  }
}
