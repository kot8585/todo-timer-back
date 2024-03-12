import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from "typeorm";

@Entity()
export class User {
  @PrimaryGeneratedColumn()
  idx: number;

  @Column({ type: "varchar", length: 30, comment: "회원 아이디" })
  id: string;

  @CreateDateColumn({ comment: "회원 생성 날짜" })
  created_at: Date;
}
