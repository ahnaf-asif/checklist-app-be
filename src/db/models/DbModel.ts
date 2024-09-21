import { query } from '../';

export default class DbModel {
  public tableName: string;
  public primaryKey: string;
  public fields: string[];

  constructor(tableName: string, primaryKey: string, fields: string[]) {
    this.tableName = tableName;
    this.primaryKey = tableName;
    this.fields = fields;
  }

  public async find(id: number) {
    return await query(`SELECT * FROM ${this.tableName} WHERE ${this.primaryKey} = ${id}`);
  }

  public async findAll() {
    return `SELECT * FROM ${this.tableName}`;
  }

  public async create(data: Record<string, any>) {
    const columns = Object.keys(data).join(', ');

    for (const field of columns) {
      if (!this.fields.includes(field)) {
        throw new Error(`Field ${field} is not allowed`);
      }
    }

    const values = Object.values(data).join(', ');

    return await query(`INSERT INTO ${this.tableName} (${columns}) VALUES (${values})`);
  }

  public async update(id: number, data: Record<string, any>) {
    const keys = Object.keys(data);
    const values = Object.values(data);
    const updData = [];

    for (const field of keys) {
      if (!this.fields.includes(field)) {
        throw new Error(`Field ${field} is not allowed`);
      }
    }

    for (let i = 0; i < keys.length; i++) {
      updData.push(`${keys[i]} = ${values[i]}`);
    }

    return await query(`UPDATE ${this.tableName} SET ${updData} WHERE ${this.primaryKey} = ${id}`);
  }

  public async delete(id: number) {
    return query(`DELETE FROM ${this.tableName} WHERE ${this.primaryKey} = ${id}`);
  }
}
