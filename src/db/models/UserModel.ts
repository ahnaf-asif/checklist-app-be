import DbModel from './DbModel';
import Either from '../../utils/either';

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

  public static async findAll(): Promise<Either<User[]>> {
    const { val: users, err } = await super.findAll();
    if (err) {
      return new Either<User[]>(undefined, err);
    }
    return new Either<User[]>(
      // @ts-ignore
      users!.map((user) => new User(user as UserProps)),
      err
    );
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
    props: Partial<Omit<UserProps, 'id'>>
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
}
