import DbModel from "./DbModel";
import Either from "../../utils/either";


type ItemProps = {
    id: number,
    checklist_id: number,
    name: number,
    max_steps: number,
    created_at?: Date,
    updated_at?: Date,
    category_id?: number 
}

export default class Item extends DbModel implements ItemProps {
    public static  tableName = 'items';
    public static primaryKey = 'id';
    public static fields = ['checklist_id', 'name', 'max_steps', 'created_at', 'updated_at', 'category_id'];

    public id!: number;
    public checklist_id!: number;
    public name!: number;
    public max_steps!: number;
    public created_at!: Date;
    public updated_at?: Date;
    public category_id?: number;

    constructor(props: ItemProps){
        super(props);
        Object.assign(this, props);
    }
    
  public static async find(id: number): Promise<Either<Item>> {
    const { val: user, err } = await super.find(id);
    if (err) {
      return new Either<Item>(undefined, err);
    }
    // @ts-ignore
    return new Either<Item>(new Item(user as ItemProps), err);
  }

  public static async findAll(): Promise<Either<Item[]>> {
    const { val: items, err } = await super.findAll();
    if (err) {
      return new Either<Item[]>(undefined, err);
    }
    return new Either<Item[]>(
      // @ts-ignore
      items!.map((user) => new Item(user as ItemProps)),
      err
    );
  }

  public static async create(
    props: Omit<ItemProps, 'id'> & { id?: number }
  ): Promise<Either<Item>> {
    const { val: user, err } = await super.create(props);
    if (err) {
      return new Either<Item>(undefined, err);
    }
    // @ts-ignore
    return new Either<Item>(new Item(user as ItemProps), err);
  }

  public static async update(
    id: number,
    props: Partial<Omit<ItemProps, 'id'>>
  ): Promise<Either<Item>> {
    const { val: user, err } = await super.update(id, props);
    if (err) {
      return new Either<Item>(undefined, err);
    }
    // @ts-ignore
    return new Either<Item>(new Item(user as ItemProps), err);
  }

  public async update(props: Partial<Omit<ItemProps, 'id'>>): Promise<Item> {
    return super.update(props as Record<string, any>) as Promise<Item>;
  }


}

