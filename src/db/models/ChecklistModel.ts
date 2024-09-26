import DbModel from './DbModel';
import Either from '../../utils/either';
import { query } from '../db';
import User from './UserModel';

type ChecklistProps = {
  id: number;
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
  creator_id: Number;
};

export default class Checklist extends DbModel implements ChecklistProps {
  public static tableName = 'checklists';
  public static primaryKey = 'id';
  public static fields = ['name', 'description', 'created_at', 'updated_at', 'creator_id'];
  public static itemsTableName = 'items';
  public static categoriesTableName = 'categories';

  public id!: number;
  public name!: string;
  public description!: string;
  public created_at!: Date;
  public updated_at?: Date;
  public creator_id!: Number;
  public creator_name?: string;
  public creator_username?: string;
  public used_by?: Number;
  public enrolled?: boolean;

  constructor(props: ChecklistProps) {
    super(props);
    Object.assign(this, props);
  }

  public static async findWithCreatorDetails(
    id: number,
    user_id: number
  ): Promise<Either<Checklist>> {
    return Either.tryAsync<Checklist>(async () => {
      const result = await query(`
            SELECT 
                c.*,
                COALESCE(u.name, 'deleted') AS creator_name,
                COALESCE(u.username, 'deleted') AS creator_username,
                COUNT(uc.user_id)::INT AS used_by,
                CASE 
                        WHEN COUNT(CASE WHEN uc.user_id = ${user_id} THEN 1 END) > 0 THEN TRUE 
                        ELSE FALSE 
                    END AS enrolled
            FROM ${this.tableName} AS c
            LEFT JOIN ${User.tableName} AS u ON c.creator_id = u.id     
            LEFT JOIN user_checklists AS uc ON c.id = uc.checklist_id
            GROUP BY c.id, u.name, u.username
            HAVING c.id = ${id};
        `);
      return new Checklist(result.rows[0]);
    });
  }

  public static async findAllWithCreatorDetails(
    user_id: number,
    searchQuery: string = ''
  ): Promise<Either<Checklist[]>> {
    return Either.tryAsync<Checklist[]>(async () => {
      const result = await query(`
            SELECT 
                c.*,
                COALESCE(u.name, 'deleted') AS creator_name,
                COALESCE(u.username, 'deleted') AS creator_username,
                COUNT(uc.user_id)::INT AS used_by,
                CASE 
                        WHEN COUNT(CASE WHEN uc.user_id = ${user_id} THEN 1 END) > 0 THEN TRUE 
                        ELSE FALSE 
                    END AS enrolled
            FROM ${this.tableName} AS c
            LEFT JOIN ${User.tableName} AS u ON c.creator_id = u.id     
            LEFT JOIN user_checklists AS uc ON c.id = uc.checklist_id
            GROUP BY c.id, u.name, u.username
            HAVING c.name ILIKE '%${searchQuery}%';
        `);
      return result.rows;
    });
  }

  public static async create(
    props: Omit<ChecklistProps, 'id'> & { id?: number }
  ): Promise<Either<Checklist>> {
    const { val: checklist, err } = await super.create(props);
    if (err) {
      return new Either<Checklist>(undefined, err);
    }
    // @ts-ignore
    return new Either<Checklist>(new Checklist(checklist as ChecklistProps), err);
  }

  public static async update(
    id: number,
    props: Partial<Omit<ChecklistProps, 'id'>>
  ): Promise<Either<Checklist>> {
    const { val: checklist, err } = await super.update(id, props);
    if (err) {
      return new Either<Checklist>(undefined, err);
    }
    // @ts-ignore
    return new Either<Checklist>(new Checklist(checklist as ChecklistProps), err);
  }

  public async update(props: Partial<Omit<ChecklistProps, 'id'>>): Promise<Checklist> {
    return super.update(props as Record<string, any>) as Promise<Checklist>;
  }

  public static async get_items(
    id: number,
    user_id: number
  ): Promise<Either<[Record<string, any>]>> {
    return Either.tryAsync<[Record<string, any>]>(async () => {
      const result = await query(`
        SELECT item.*, 
            category.name AS category_name, 
            category.parent_id, 
            category.display_order AS category_display_order,
            ip.completed_steps as completed_steps
        FROM ${Checklist.itemsTableName} item
        LEFT JOIN ${Checklist.categoriesTableName} category ON item.category_id = category.id
        LEFT JOIN item_progress ip ON item.id = ip.item_id
        WHERE item.checklist_id = ${id} AND ip.user_id = ${user_id};
      `);
      return result.rows as [Record<string, any>];
    });
  }

  public async get_categories(): Promise<Either<[Record<string, any>]>> {
    return Either.tryAsync<[Record<string, any>]>(async () => {
      const result = await query(`
           SELECT *
           FROM ${Checklist.categoriesTableName}
           WHERE checklist_id = ${this.id};
      `);
      return result.rows as [Record<string, any>];
    });
  }

  public static async enroll(user_id: number, checklist_id: number) {
    return Either.tryAsync(async () => {
      const results = await query(`
                INSERT INTO user_checklists (user_id, checklist_id) VALUES (${user_id}, ${checklist_id}) RETURNING *; 
      `);
      return results.rows[0];
    });
  }

  public static async leave(user_id: number, checklist_id: number) {
    return Either.tryAsync(async () => {
      const results = await query(`
                DELETE FROM user_checklists WHERE user_id = ${user_id} AND checklist_id = ${checklist_id}) ; 
      `);
      return results.rows[0];
    });
  }

  public static async created_checklists(user_id: number) {
    return Either.tryAsync(async () => {
      const results = await query(`
                SELECT c.*, COUNT(uc.*)
                FROM ${this.tableName} AS c 
                LEFT JOIN user_checklists as uc ON uc.checklist_id = c.id
                GROUP BY c.id
                HAVING c.creator_id = ${user_id}
      `);
      return results.rows;
    });
  }

  public static async create_categories(categories: any, checklist_id: number) {
    for (const cat of categories) {
      const q = `INSERT INTO categories (name, display_order, checklist_id) VALUES ('${cat}', 0, ${checklist_id})`;
      console.log(q);
      await query(q);
    }
  }
}
