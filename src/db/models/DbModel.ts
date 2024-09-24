import { QueryResultRow } from 'pg';

import { query } from '../';
import Either from '../../utils/either';
import { NoRecordFoundError, InvalidFieldError } from '../../utils/errors';

export default class DbModel implements QueryResultRow {
  public static tableName: string;
  public static primaryKey: string;
  public static fields: string[];
  public id!: number;

  constructor(_props: Record<string, any>) {}

  public static async find(id: number): Promise<Either<DbModel>> {
    return Either.tryAsync<DbModel>(async () => {
      const result = await query<DbModel>(
        `SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ${id}`
      );
      if (result.rowCount === 0) {
        throw new NoRecordFoundError(this.tableName, id);
      }
      return result.rows[0];
    });
  }

  public static async findAll(): Promise<Either<DbModel[]>> {
    return Either.tryAsync<DbModel[]>(async () => {
      const result = await query<DbModel>(`SELECT * FROM ${this.tableName}`);
      return result.rows;
    });
  }

  public static async findBy(data: Record<string, any>): Promise<Either<DbModel[]>> {
    return Either.tryAsync<DbModel[]>(async () => {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const conditions = [];

      for (let i = 0; i < keys.length; i++) {
        let value = values[i];
        const key = keys[i];

        if (!this.fields.includes(key)) {
          throw new InvalidFieldError(this.tableName, key);
        }

        if (typeof value === 'string') {
          value = `'${value}'`;
        }

        conditions.push(`${keys[i]} = ${value}`);
      }

      const result = await query<DbModel>(
        `SELECT * FROM ${this.tableName} WHERE ${conditions.join(' AND ')}`
      );
      return result.rows;
    });
  }

  public static async create(data: Record<string, any>): Promise<Either<DbModel>> {
    return Either.tryAsync<DbModel>(async () => {
      const columns = Object.keys(data).join(', ');
      for (const field of Object.keys(data)) {
        if (field === this.primaryKey) {
          continue;
        }
        if (!this.fields.includes(field)) {
          throw new InvalidFieldError(this.tableName, field);
        }
      }

      const values = Object.values(data)
        .map((value) => {
          if (typeof value === 'string') {
            return `'${value}'`;
          }

          return value;
        })
        .join(', ');

      const result = await query<DbModel>(
        `INSERT INTO ${this.tableName} (${columns}) VALUES (${values}) RETURNING *`
      );
      return result.rows[0];
    });
  }

  public static async update(id: number, data: Record<string, any>): Promise<Either<DbModel>> {
    return Either.tryAsync<DbModel>(async () => {
      const keys = Object.keys(data);
      const values = Object.values(data);
      const updData = [];

      for (const field of keys) {
        if (!this.fields.includes(field)) {
          throw new InvalidFieldError(this.tableName, field);
        }
      }

      for (let i = 0; i < keys.length; i++) {
        let value = values[i];
        if (typeof value === 'string') {
          value = `'${value}'`;
        }

        updData.push(`${keys[i]} = ${value}`);
      }

      const result = await query<DbModel>(
        `UPDATE ${this.tableName} SET ${updData} WHERE ${this.primaryKey} = ${id} RETURNING *`
      );
      if (result.rowCount === 0) {
        throw new NoRecordFoundError(this.tableName, id);
      }
      return result.rows[0];
    });
  }

  public async update(data: Record<string, any>): Promise<DbModel> {
    const { val: _updated, err } = await (this.constructor as typeof DbModel).update(this.id, data);
    if (err) {
      throw err;
    }

    // update the instance with the new data
    for (const key of Object.keys(data)) {
      // @ts-ignore: Allow dynamic property assignment
      this[key] = data[key];
    }
    return this;
  }

  public static async delete(id: number): Promise<Either<void>> {
    return Either.tryAsync<void>(async () => {
      const result = await query(`DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ${id}`);
      if (result.rowCount === 0) {
        throw new NoRecordFoundError(this.tableName, id);
      }
    });
  }

  public async delete(): Promise<void> {
    try {
      await (this.constructor as typeof DbModel).delete(this.id);
    } catch (error) {
      throw error;
    }
  }

  [column: string]: any;
}
