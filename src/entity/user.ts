import {
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./category";
import { Todo } from "./todo";

@Entity()
export class User {
  @PrimaryColumn()
  uid: string;

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  // 얘도 하는게 맞을까나...
  @OneToMany(() => Todo, (todo) => todo.user)
  todos: Todo[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date | null;
}
