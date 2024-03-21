import {
  Column,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
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
  elapsedTime: number;

  @Column("datetime")
  endDateTime: Date;

  @ManyToOne(() => Todo, (todo) => todo.timelines, {
    createForeignKeyConstraints: false,
  })
  @JoinColumn({ name: "todoIdx", referencedColumnName: "idx" })
  todo: Todo;
}
