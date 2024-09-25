import DbModel from './DbModel';
import Either from '../../utils/either';

type ChecklistProps = {
  id: number;
  name: string;
  description?: string;
  created_at?: Date;
  updated_at?: Date;
  creator_id: Number;
};

export default class Checklist extends DbModel implements ChecklistProps {
  public static tableName = 'checklist';
  public static primaryKey = 'id';
  public static fields = ['name', 'description', 'created_at', 'updated_at', 'creator_id'];

  public id!: number;
  public name!: string;
  public description!: string;
  public created_at!: Date;
  public updated_at?: Date;
  public creator_id!: Number;

  constructor(props: ChecklistProps) {
    super(props);
    Object.assign(this, props);
  }

  public static async find(id: number): Promise<Either<Checklist>> {
    const { val: checklist, err } = await super.find(id);
    if (err) {
      return new Either<Checklist>(undefined, err);
    }
    // @ts-ignore
    return new Either<User>(new Checklist(checklist as ChecklistProps), err);
  }

  public static async findAll(): Promise<Either<Checklist[]>> {
    const { val: checklists, err } = await super.findAll();
    if (err) {
      return new Either<Checklist[]>(undefined, err);
    }
    return new Either<Checklist[]>(
      // @ts-ignore
      checklists!.map((checklist) => new Checklist(checklist as ChecklistProps)),
      err
    );
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
}
