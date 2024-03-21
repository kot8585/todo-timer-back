import {
  Column,
  CreateDateColumn,
  Entity,
  Index,
  JoinColumn,
  ManyToOne,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./category";
import { User } from "./user";
import { Timeline } from "./timeline";

@Entity()
@Index("idx_todo_1", ["category"])
export class Todo {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column()
  userUid: string;

  @Column()
  categoryIdx: number;

  @Column({ type: "varchar" })
  title: string;

  @Column()
  startDate: Date;

  @Column({ type: "boolean", default: false })
  isCompleted: boolean;

  @Column({ default: 0 })
  executionTime: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @ManyToOne(() => Category, (category) => category.todos, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: "categoryIdx", referencedColumnName: "idx" })
  category: Category;

  @ManyToOne(() => User, (user) => user.todos, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: "userUid", referencedColumnName: "uid" })
  user: User;

  @OneToMany(() => Timeline, (timeline) => timeline.todo)
  timelines: Timeline[];
}
