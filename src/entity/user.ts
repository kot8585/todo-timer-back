import {
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryColumn,
  UpdateDateColumn,
} from "typeorm";
import { Category } from "./category";

@Entity()
export class User {
  @PrimaryColumn()
  uid: string;

  @OneToMany(() => Category, (category) => category.user)
  categories: Category[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date | null;
}
