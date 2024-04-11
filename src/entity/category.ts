import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Todo } from "./todo";

@Entity()
export class Category {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column()
  userUid: string;

  @Column({ type: "varchar" })
  title: string;

  @OneToMany(() => Todo, (todo) => todo.category)
  todos: Todo[] | null;

  @Column()
  color: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @Column({ type: "date", nullable: true }) // 이 부분 수정
  endDate: Date | null;
}
