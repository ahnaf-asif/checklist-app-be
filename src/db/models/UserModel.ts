import DbModel from './DbModel';
import Either from '../../utils/either';
import { query } from '../../db';

type UserProps = {
  id: number;
  username: string;
  email: string;
  password: string;
  name: string;
  created_at?: Date;
  updated_at?: Date;
};

export default class User extends DbModel implements UserProps {
  public static tableName = 'users';
  public static primaryKey = 'id';
  public static fields = ['username', 'email', 'password', 'name', 'created_at', 'updated_at'];

  public id!: number;
  public username!: string;
  public email!: string;
  public password!: string;
  public name!: string;
  public created_at!: Date;
  public updated_at!: Date;

  constructor(props: UserProps) {
    super(props);
    Object.assign(this, props);
  }

  public static async find(id: number): Promise<Either<User>> {
    const { val: user, err } = await super.find(id);
    if (err) {
      return new Either<User>(undefined, err);
    }
    // @ts-ignore
    return new Either<User>(new User(user as UserProps), err);
  }

  public static async create(
    props: Omit<UserProps, 'id'> & { id?: number }
  ): Promise<Either<User>> {
    const { val: user, err } = await super.create(props);
    if (err) {
      return new Either<User>(undefined, err);
    }
    // @ts-ignore
    return new Either<User>(new User(user as UserProps), err);
  }

  public static async update(
    id: number,
    props: Partial<Omit<UserProps, 'id' | 'username'>>
  ): Promise<Either<User>> {
    const { val: user, err } = await super.update(id, props);
    if (err) {
      return new Either<User>(undefined, err);
    }
    // @ts-ignore
    return new Either<User>(new User(user as UserProps), err);
  }

  public async update(props: Partial<Omit<UserProps, 'id'>>): Promise<User> {
    return super.update(props as Record<string, any>) as Promise<User>;
  }

  public async findFriends(): Promise<Either<User[]>> {
    return Either.tryAsync(async () => {
      const result = await query<User>(
        `SELECT id, name, username, email FROM users WHERE id IN (SELECT friend_id FROM friends WHERE user_id = ${this.id})`
      );
      return result.rows;
    });
  }

  public async addFriend(friendId: number) {
    return Either.tryAsync(async () => {
      await query(`INSERT INTO friends (user_id, friend_id) VALUES (${this.id}, ${friendId})`);
    });
  }

  public async unFriend(friendId: number) {
    return Either.tryAsync(async () => {
      await query(`DELETE FROM friends WHERE user_id = ${this.id} AND friend_id = ${friendId}`);
    });
  }
  public static async findAllUsers(id: number): Promise<Either<any[]>> {
    return Either.tryAsync<any[]>(async () => {
      const result = await query<any>(
        `SELECT u.id, u.name, u.username, u.email, 
      (f.friend_id IS NOT NULL) AS is_friend 
      FROM ${User.tableName} u 
      LEFT JOIN friends f 
      ON u.id = f.friend_id 
      AND f.user_id = ${id} 
      WHERE u.id != ${id}`
      );
      return result.rows;
    });
  }
}
