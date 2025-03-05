import { Todo } from '../types/Todo';
import { client } from '../utils/fetchClient';

export const USER_ID = 2397;

export const getTodos = () => {
  return client.get<Todo[]>(`/todos?userId=${USER_ID}`);
};

export const createTodo = ({
  title,
  completed,
}: Omit<Todo, 'id' | 'userId'>) => {
  return client.post<Todo>('/todos', { userId: USER_ID, title, completed });
};

// api/todos.ts
export const deleteTodo = async (todoId: number): Promise<void> => {
  try {
    const response = await fetch(`/api/todos/${todoId}`, {
      method: 'DELETE',
    });

    if (!response.ok) {
      throw new Error('Failed to delete todo');
    }
  } catch (error) {
    throw error;
  }
};
