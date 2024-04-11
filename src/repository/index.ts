import { AppDataSource } from "../data-source";
import { Category } from "../entity/category";
import { Todo } from "../entity/todo";
import { Timeline } from "../entity/timeline";

export const categoryRepository = AppDataSource.getRepository(Category);
export const todoRepository = AppDataSource.getRepository(Todo);
export const timelineRepository = AppDataSource.getRepository(Timeline);
