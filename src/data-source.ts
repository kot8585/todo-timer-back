import { DataSource } from "typeorm";
import { User } from "./entity/user";

export const AppDataSource = new DataSource({
  type: "mysql",
  host: "localhost", //DB HOST
  port: 3306, // DB 포트 mysql default port는 3306
  username: "root", // DB 접속시 계정
  password: "0000", // DB 접속시 비밀번호
  database: "todolist", // DB내 사용하는 DATABASE
  synchronize: true, // 엔티티 동기화 여부, 개발 중일땐 true를 해도 상관없으나 실서버에서는 false로 하고 migration을 하거나, 직접 수정한다.
  logging: true,
  entities: [User],
  subscribers: [],
  migrations: [],
});
