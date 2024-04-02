import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from "typeorm";
import { Todo } from "./todo";

@Entity()
export class Timeline {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column()
  todoIdx: number;

  @Column("datetime")
  startDateTime: Date;

  @Column()
  executionTime: number;

  @Column("datetime")
  endDateTime: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date | null;

  @ManyToOne(() => Todo, (todo) => todo.timelines, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: "todoIdx", referencedColumnName: "idx" })
  todo: Todo;
}
