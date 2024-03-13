import {
  Column,
  CreateDateColumn,
  Entity,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./category";

@Entity()
export class Todo {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: "varchar", comment: "회원 uid" })
  user_uid: string;

  @ManyToOne(() => Category, (category) => category.todos)
  category: Category;

  @Column({ type: "varchar" })
  title: string;

  @Column()
  startDate: Date;

  @Column({ type: "boolean" })
  isCompleted: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date | null;
}
