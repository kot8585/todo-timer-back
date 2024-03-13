import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { User } from "./user";
import { Todo } from "./todo";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  idx: number;

  @ManyToOne(() => User, (user) => user.categories)
  user: User;

  @Column({ type: "varchar" })
  title: string;

  @OneToMany(() => Todo, (todo) => todo.category)
  todos: Todo[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date | null;
}
