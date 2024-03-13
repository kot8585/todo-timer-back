import { AppDataSource } from "../data-source";
import { User } from "../entity/user";
import { Category } from "../entity/category";
import { Todo } from "../entity/todo";
import { Timeline } from "../entity/timeline";

export const userRepository = AppDataSource.getRepository(User);
export const categoryRepository = AppDataSource.getRepository(Category);
export const todoRepository = AppDataSource.getRepository(Todo);
export const timelineRepository = AppDataSource.getRepository(Timeline);
