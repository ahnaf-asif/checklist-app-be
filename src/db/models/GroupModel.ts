import DbModel from './DbModel';
import Either from '../../utils/either';
import { query } from '../../db';
import { NoRecordFoundError, InvalidFieldError } from '../../utils/errors';

type GroupProps = {
  id: number;
  name: string;
  description: string;
  created_at?: Date;
  updated_at?: Date;
  creator_id: number;
};

export default class Group extends DbModel implements GroupProps {
  public static tableName = 'groups';
  public static primaryKey = 'id';
  public static fields = ['name', 'description', 'created_at', 'updated_at', 'creator_id'];

  public id!: number;
  public name!: string;
  public description!: string;
  public created_at!: Date;
  public updated_at!: Date;
  public creator_id!: number;

  constructor(props: GroupProps) {
    super(props);
    Object.assign(this, props);
  }

  public static async findGroup(userId: number, id: number): Promise<Either<any>> {
    return Either.tryAsync<any>(async () => {
      const result = await query<any>(
        `
            SELECT
                g.id,
                g.name,
                g.description,
                g.created_at,
                u.username AS creator_username,
                COUNT(DISTINCT gm.user_id) AS total_members,
                COUNT(CASE WHEN gm.user_id = ${userId} THEN 1 END) AS is_member,
                COUNT(DISTINCT gc.checklist_id) AS total_checklists
            FROM
                groups g
                    LEFT JOIN
                users u ON g.creator_id = u.id
                    LEFT JOIN
                group_members gm ON gm.group_id = g.id
                    LEFT JOIN
                group_checklist gc ON gc.group_id = g.id
            WHERE
                g.id = ${id}
            GROUP BY
                g.id, u.username;
        `
      );
      if (result.rowCount === 0) {
        throw new NoRecordFoundError(this.tableName, id);
      }
      return result.rows[0];
    });
  }

  public static async findGroups(userId: number): Promise<Either<any[]>> {
    return Either.tryAsync<any[]>(async () => {
      const result = await query<any>(
        `
            SELECT
                g.id,
                g.name,
                g.description,
                u.username AS creator_username,
                COUNT(DISTINCT gm.user_id) AS total_members,
                COUNT(CASE WHEN gm.user_id = ${userId} THEN 1 END) AS is_member,
                COUNT(DISTINCT gc.checklist_id) AS total_checklists
            FROM
                groups g
                    LEFT JOIN
                users u ON g.creator_id = u.id
                    LEFT JOIN
                group_members gm ON gm.group_id = g.id
                    LEFT JOIN
                group_checklist gc ON gc.group_id = g.id
            GROUP BY
                g.id, u.username;
        `
      );
      return result.rows;
    });
  }

  public static async findEnrolledGroups(userId: number) {
    return Either.tryAsync<any[]>(async () => {
      const result = await query<any>(
        `
            SELECT
                g.id,
                g.name,
                g.description,
                u.username AS creator_username,
                COUNT(DISTINCT gm.user_id) AS total_members,
                COUNT(DISTINCT CASE WHEN gm.user_id = ${userId} THEN gm.user_id END) AS is_member,
                COUNT(DISTINCT gc.checklist_id) AS total_checklists
            FROM
                groups g
                    LEFT JOIN users u ON g.creator_id = u.id
                    LEFT JOIN group_members gm ON gm.group_id = g.id
                    LEFT JOIN group_checklist gc ON gc.group_id = g.id
            GROUP BY
                g.id, u.username
            HAVING
                COUNT(CASE WHEN gm.user_id = ${userId} THEN 1 END) > 0;
        `
      );
      return result.rows;
    });
  }

  public static async findCreatedGroups(userId: number) {
    return Either.tryAsync<any[]>(async () => {
      const result = await query<any>(
        `
            SELECT
                g.id,
                g.name,
                g.description,
                u.username AS creator_username,
                COUNT(DISTINCT gm.user_id) AS total_members,
                COUNT(CASE WHEN gm.user_id = ${userId} THEN 1 END) AS is_member,
                COUNT(DISTINCT gc.checklist_id) AS total_checklists
            FROM
                groups g
                    LEFT JOIN
                users u ON g.creator_id = u.id
                    LEFT JOIN
                group_members gm ON gm.group_id = g.id
                    LEFT JOIN
                group_checklist gc ON gc.group_id = g.id
            WHERE
                g.creator_id = ${userId}
            GROUP BY
                g.id, u.username;
        `
      );
      return result.rows;
    });
  }

  public static async findGroupMembers(groupId: number) {
    return Either.tryAsync<any[]>(async () => {
      const result = await query<any>(
        `
            SELECT
                u.id,
                u.name,
                u.username,
                u.email
            FROM
                users u
                    JOIN
                group_members gm ON u.id = gm.user_id
            WHERE
                gm.group_id = ${groupId};
        `
      );
      return result.rows;
    });
  }

  public static async createGroup(userId: number, group_data: any) {
    return Either.tryAsync<any[]>(async () => {
      const result = await query<any>(
        `
            INSERT INTO groups (name, description, creator_id)
            VALUES ('${group_data.name}', '${group_data.description}', ${userId})
            RETURNING id;
        `
      );
      await query<any>(
        `INSERT INTO group_members (group_id, user_id) VALUES (${result.rows[0].id}, ${userId})`
      );
      return result.rows[0];
    });
  }

  public static async updateGroup(id: number, group_data: any) {
    return Either.tryAsync<any[]>(async () => {
      const result = await query<any>(
        `
            UPDATE groups
            SET name = '${group_data.name}', description = '${group_data.description}'
            WHERE id = ${id}
            RETURNING id;
        `
      );
      return result.rows[0];
    });
  }

  public static async deleteGroup(id: number) {
    return Either.tryAsync<any[]>(async () => {
      const result = await query<any>(
        `
            DELETE FROM groups
            WHERE id = ${id}
            RETURNING id;
        `
      );
      return result.rows[0];
    });
  }

  public static async addGroupMember(groupId: number, userId: number) {
    return Either.tryAsync<any[]>(async () => {
      const result = await query<any>(
        `
            INSERT INTO group_members (group_id, user_id)
            VALUES (${groupId}, ${userId})
            RETURNING id;
        `
      );
      return result.rows[0];
    });
  }

  public static async removeGroupMember(groupId: number, userId: number) {
    return Either.tryAsync<any[]>(async () => {
      const result = await query<any>(
        `
            DELETE FROM group_members
            WHERE group_id = ${groupId} AND user_id = ${userId}
            RETURNING id;
        `
      );
      return result.rows[0];
    });
  }
}
