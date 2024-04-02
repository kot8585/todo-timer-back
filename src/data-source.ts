import { DataSource } from "typeorm";
import { User } from "./entity/user";
import { Category } from "./entity/category";
import { Todo } from "./entity/todo";
import { Timeline } from "./entity/timeline";
import dotenv from "dotenv";

dotenv.config();

console.log(process.env.DB_USERNAME);
export const AppDataSource = new DataSource({
  type: "mysql",
  host: process.env.DB_HOST, //DB HOST
  port: 3306, // DB 포트 mysql default port는 3306
  username: process.env.DB_USERNAME, // DB 접속시 계정
  password: process.env.DB_PWD, // DB 접속시 비밀번호
  database: "todolist", // DB내 사용하는 DATABASE
  synchronize: true, // 엔티티 동기화 여부, 개발 중일땐 true를 해도 상관없으나 실서버에서는 false로 하고 migration을 하거나, 직접 수정한다.
  logging: true,
  entities: [User, Category, Todo, Timeline],
  subscribers: [],
  migrations: [],
});
