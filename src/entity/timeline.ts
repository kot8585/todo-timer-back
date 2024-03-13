import { Column, Entity, PrimaryGeneratedColumn } from "typeorm";

// pk는 어떤 걸로 해야되지?
@Entity()
export class Timeline {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column()
  todoIdx: number;

  // timestamp?? datetime??
  @Column()
  startTime: Date;

  // timestamp?? datetime??
  @Column()
  EndTime: Date;
}
