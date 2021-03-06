import React, { useState } from 'react';
import axios from 'axios';

import editSvg from '../../assets/img/edit.svg';

import './Tasks.scss';
import { Link } from 'react-router-dom';

const Tasks = ({
  items,
  onAddTask,
  editListTask,
  onDeleteTask,
  onEditTaskValue,
  withoutEmpty,
  onChekedTask,
}) => {
  const [activeAddTask, setActiveAddTask] = useState(false);
  const [inputValue, setInputValue] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const onActiveTask = () => {
    setActiveAddTask(!activeAddTask);
  };

  const onEditTask = () => {
    const newItem = window.prompt('Название списка', items.name);

    if (newItem) {
      editListTask(items.id, newItem);
      axios
        .patch('http://localhost:3001/lists/' + items.id, {
          name: newItem,
        })
        .catch(() => {
          alert('Не удалось изменить заголовок');
        });
    }
  };

  const onChangeValueTask = () => {
    const newObj = {
      listId: items.id,
      text: inputValue,
      completed: false,
    };
    setIsLoading(true);
    axios
      .post('http://localhost:3001/tasks', newObj)
      .then(({ data }) => {
        onAddTask(items.id, data);
        setInputValue('');
        setActiveAddTask(false);
      })
      .catch(() => {
        alert('Не удалось добавить задачу');
      })
      .finally(() => {
        setIsLoading(false);
      });
  };

  const onDeleteItem = (id) => {
    if (window.confirm('Вы действительно хотите удалить задачу ?')) {
      axios.delete('http://localhost:3001/tasks/' + id).then(({ data }) => {
        onDeleteTask(items.id, id);
      });
    }
  };

  const onEditValueTask = (task) => {
    const newItem = window.prompt('Название задачи', task.text);
    if (newItem) {
      onEditTaskValue(items.id, task.id, newItem);
      axios
        .patch('http://localhost:3001/tasks/' + task.id, {
          text: newItem,
        })
        .catch(() => {
          alert('Не удалось изменить задачу');
        });
    }
  };

  const onTaskCheck = (taskId, completed) => {
    onChekedTask(items.id, taskId, completed);

    axios
      .patch('http://localhost:3001/tasks/' + taskId, {
        completed,
      })
      .catch(() => {
        alert('Ошибка');
      });
  };

  return (
    <div className="tasks">
      <Link to={process.env.PUBLIC_URL + `/lists/${items.id}`}>
        <div className="title">
          <h2 style={{ color: items && items.color.hex }}>{items.name}</h2>
          <img onClick={onEditTask} className="title__img" src={editSvg} alt="editSvg" />
        </div>
      </Link>
      <div className="tasks__items">
        {!withoutEmpty && items.tasks && !items.tasks.length && <h2>Задачи отсутствуют</h2>}
        {items.tasks &&
          items.tasks.map((task) => {
            return (
              <div key={task.id} className="tasks__items-row">
                <div className="checkbox">
                  <input
                    onChange={(e) => onTaskCheck(task.id, e.target.checked)}
                    id={`check--${task.id}`}
                    type="checkbox"
                    checked={task.completed}
                  />
                  <label htmlFor={`check--${task.id}`}>
                    <svg
                      width="16"
                      height="16"
                      viewBox="0 0 11 8"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M9.29999 1.20001L3.79999 6.70001L1.29999 4.20001"
                        stroke="white"
                        strokeWidth="1.5"
                        strokeLinecap="round"
                        strokeLinejoin="round"
                      />
                    </svg>
                  </label>
                </div>
                <p>{task.text}</p>
                <div className="tasks__items-row-actions">
                  <div onClick={() => onEditValueTask(task)}>
                    <svg
                      width="15"
                      height="15"
                      viewBox="0 0 15 15"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M0 12.0504V14.5834C0 14.8167 0.183308 15 0.41661 15H2.9496C3.05792 15 3.16624 14.9583 3.24123 14.875L12.34 5.78458L9.21542 2.66001L0.124983 11.7504C0.0416611 11.8338 0 11.9337 0 12.0504ZM14.7563 3.36825C14.8336 3.29116 14.8949 3.1996 14.9367 3.0988C14.9785 2.99801 15 2.88995 15 2.78083C15 2.6717 14.9785 2.56365 14.9367 2.46285C14.8949 2.36205 14.8336 2.27049 14.7563 2.19341L12.8066 0.24367C12.7295 0.166428 12.638 0.105146 12.5372 0.0633343C12.4364 0.021522 12.3283 0 12.2192 0C12.1101 0 12.002 0.021522 11.9012 0.0633343C11.8004 0.105146 11.7088 0.166428 11.6318 0.24367L10.107 1.76846L13.2315 4.89304L14.7563 3.36825V3.36825Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                  <div onClick={() => onDeleteItem(task.id)}>
                    <svg
                      width="11"
                      height="11"
                      viewBox="0 0 11 11"
                      fill="none"
                      xmlns="http://www.w3.org/2000/svg">
                      <path
                        d="M6.87215 5.5L10.7129 1.65926C10.8952 1.47731 10.9977 1.23039 10.9979 0.972832C10.9982 0.715276 10.8961 0.468178 10.7141 0.285898C10.5321 0.103617 10.2852 0.00108525 10.0277 0.000857792C9.77011 0.000630336 9.52302 0.102726 9.34074 0.284685L5.5 4.12542L1.65926 0.284685C1.47698 0.102404 1.22976 0 0.971974 0C0.714191 0 0.466965 0.102404 0.284685 0.284685C0.102404 0.466965 0 0.714191 0 0.971974C0 1.22976 0.102404 1.47698 0.284685 1.65926L4.12542 5.5L0.284685 9.34074C0.102404 9.52302 0 9.77024 0 10.028C0 10.2858 0.102404 10.533 0.284685 10.7153C0.466965 10.8976 0.714191 11 0.971974 11C1.22976 11 1.47698 10.8976 1.65926 10.7153L5.5 6.87458L9.34074 10.7153C9.52302 10.8976 9.77024 11 10.028 11C10.2858 11 10.533 10.8976 10.7153 10.7153C10.8976 10.533 11 10.2858 11 10.028C11 9.77024 10.8976 9.52302 10.7153 9.34074L6.87215 5.5Z"
                        fill="black"
                      />
                    </svg>
                  </div>
                </div>
              </div>
            );
          })}
      </div>

      {activeAddTask && (
        <div key={items.id} className="tasks__add">
          <input
            onChange={(e) => setInputValue(e.target.value)}
            value={inputValue}
            className="field field__add"
            type="text"
            placeholder="Текст задачи"
          />
          <div>
            <button disabled={isLoading} onClick={onChangeValueTask} className="button">
              {isLoading ? 'Добавление задачи...' : 'Добавить задачу'}
            </button>
            <button onClick={onActiveTask} className="button__cancel">
              Отмена
            </button>
          </div>
        </div>
      )}
      {!activeAddTask ? (
        <div onClick={onActiveTask} className="tasks__new">
          <svg
            width="16"
            height="16"
            viewBox="0 0 16 16"
            fill="none"
            xmlns="http://www.w3.org/2000/svg">
            <path
              d="M8 1V15"
              stroke="#B4B4B4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
            <path
              d="M1 8H15"
              stroke="#B4B4B4"
              strokeWidth="2"
              strokeLinecap="round"
              strokeLinejoin="round"
            />
          </svg>

          <span>Новая задача</span>
        </div>
      ) : (
        ''
      )}
    </div>
  );
};

export default Tasks;
