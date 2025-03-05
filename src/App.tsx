/* eslint-disable no-console */
/* eslint-disable @typescript-eslint/no-shadow */
import React, { useEffect, useRef, useState, useMemo } from 'react';
import { UserWarning } from './UserWarning';
import { USER_ID } from './api/todos';
import { createTodo, getTodos, deleteTodo } from './api/todos';
import { TodoList } from './component/TodoList';
import { Todo } from './types/Todo';
import classNames from 'classnames';
import { Footer } from './component/Footer';

export const App: React.FC = () => {
  const [todos, setTodos] = useState<Todo[]>([]);
  const [title, setTitle] = useState('');
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const [loading, setLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');
  const [filter, setFilter] = useState('all');

  const inputRef = useRef<HTMLInputElement | null>(null);

  const handleDeleteTodo = (todoId: number) => {
    setTodos(todos.filter(todo => todo.id !== todoId));
    deleteTodo(todoId).catch(error => {
      setErrorMessage('Unable to delete todo');
      console.error(error);
    });
  };

  const filterTodos = useMemo(() => {
    return (todos: Todo[], filter: string) => {
      switch (filter) {
        case 'active':
          return todos.filter(todo => !todo.completed);
        case 'completed':
          return todos.filter(todo => todo.completed);
        default:
          return todos;
      }
    };
  }, []);

  const filteredTodos = filterTodos(todos, filter);
  const completedTodos = todos.filter(todo => todo.completed);
  const notCompletedTodos = todos.filter(todo => !todo.completed);

  useEffect(() => {
    setErrorMessage('');
    setLoading(true);

    if (inputRef.current) {
      inputRef.current.focus();
    }

    getTodos()
      .then(setTodos)
      .catch(error => {
        setErrorMessage('Unable to load todos');
        console.error(error);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    const timerId = setTimeout(() => {
      setErrorMessage('');
    }, 3000);

    return () => clearTimeout(timerId);
  }, [errorMessage]);

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setErrorMessage('');
    setTitle(event.target.value);
  };

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    if (title.trim().length === 0) {
      setErrorMessage('Title should not be empty');

      return;
    }

    createTodo({ title, completed: false })
      .then(newTodo => {
        setTodos(currentTodos => [...currentTodos, newTodo]);
      })
      .catch(error => {
        setErrorMessage('Unable to add a todo');
        console.error(error);
      })
      .finally(() => setTitle(''));
  };

  if (!USER_ID) {
    return <UserWarning />;
  }

  return (
    <div className="todoapp">
      <h1 className="todoapp__title">todos</h1>
      <header className="todoapp__header">
        <button
          type="button"
          className={classNames('todoapp__toggle-all', {
            active: completedTodos.length === todos.length,
          })}
        />
        <form onSubmit={handleSubmit}>
          <input
            data-cy="NewTodoField"
            type="text"
            className="todoapp__new-todo"
            placeholder="What needs to be done?"
            value={title}
            onChange={handleChange}
            ref={inputRef}
          />
        </form>
      </header>

      <section className="todoapp__main">
        {todos.length > 0 && (
          <TodoList todos={filteredTodos} onDeleteTodo={handleDeleteTodo} />
        )}
      </section>

      {todos.length !== 0 && (
        <Footer
          filter={filter}
          setFilter={setFilter}
          completedTodos={completedTodos}
          notCompletedTodos={notCompletedTodos}
        />
      )}

      {errorMessage && (
        <div
          data-cy="ErrorNotification"
          className={classNames(
            'notification is-danger is-light has-text-weight-normal',
            {
              hidden: !errorMessage,
            },
          )}
        >
          <button
            data-cy="HideErrorButton"
            type="button"
            className="delete"
            onClick={() => setErrorMessage('')}
          />
          {errorMessage}
        </div>
      )}
    </div>
  ); //updt
};
