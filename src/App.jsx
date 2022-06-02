import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Route, Routes, useNavigate, useLocation } from 'react-router-dom';

import AddList from './components/AddList/AddList';
import List from './components/List/List';
import Tasks from './components/Tasks/Tasks';

import './index.scss';

function App() {
  const [addList, setAddList] = useState(null);
  const [colors, setColors] = useState(null);
  const [activeList, setActiveList] = useState(null);

  let navigate = useNavigate();
  let location = useLocation();
  useEffect(() => {
    axios.get('http://localhost:3001/lists?_expand=color&_embed=tasks').then(({ data }) => {
      setAddList(data);
    });

    axios.get('http://localhost:3001/colors').then(({ data }) => {
      setColors(data);
    });
  }, []);

  const onAddList = (obj) => {
    const newObj = [...addList, obj];
    setAddList(newObj);
  };

  const onAddTask = (id, obj) => {
    const newObj = addList.map((item) => {
      if (item.id === id) {
        item.tasks = [...item.tasks, obj];
      }
      return item;
    });

    setAddList(newObj);
  };

  const onDeleteItem = (id) => {
    // console.log(addList.filter((item) => item.id !== id));
    const newItem = addList.filter((item) => item.id !== id);
    setAddList(newItem);
  };

  const onDeleteTask = (listId, id) => {
    const newItem = addList.map((item) => {
      if (item.id === listId) {
        item.tasks = item.tasks.filter((item) => {
          return item.id !== id;
        });
      }
      return item;
    });
    setAddList(newItem);
  };

  const onEditListTitle = (id, title) => {
    const newItem = addList.map((item) => {
      if (item.id === id) {
        item.name = title;
      }
      return item;
    });
    setAddList(newItem);
  };

  const onEditTask = (listId, id, title) => {
    const newItem = addList.map((item) => {
      if (item.id === listId) {
        item.tasks = item.tasks.map((task) => {
          if (task.id === id) {
            task.text = title;
          }
          return task;
        });
      }
      return item;
    });
    setAddList(newItem);
  };

  const onChekedTask = (listId, taskId, completed) => {
    const newList = addList.map((list) => {
      if (list.id === listId) {
        list.tasks = list.tasks.filter((task) => {
          if (task.id === taskId) {
            task.completed = completed;
          }
          return task;
        });
      }
      return list;
    });
    setAddList(newList);
  };

  useEffect(() => {
    const listId = location.pathname.split('lists/')[1];
    if (addList) {
      const list = addList.find((item) => item.id === Number(listId));
      setActiveList(list);
    }
  }, [addList, location.pathname]);
  return (
    <div className="todo">
      <div className="todo__sidebar">
        <List
          onClickItem={(list) => {
            navigate(`/`);
          }}
          items={[
            {
              active: location.pathname === process.env.PUBLIC_URL + '/',
              icon: (
                <svg
                  width="14"
                  height="12"
                  viewBox="0 0 14 12"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M10.96 5.10001H5.74C5.2432 5.10001 5.2 5.50231 5.2 6.00001C5.2 6.49771 5.2432 6.90001 5.74 6.90001H10.96C11.4568 6.90001 11.5 6.49771 11.5 6.00001C11.5 5.50231 11.4568 5.10001 10.96 5.10001ZM12.76 9.60001H5.74C5.2432 9.60001 5.2 10.0023 5.2 10.5C5.2 10.9977 5.2432 11.4 5.74 11.4H12.76C13.2568 11.4 13.3 10.9977 13.3 10.5C13.3 10.0023 13.2568 9.60001 12.76 9.60001ZM5.74 2.40001H12.76C13.2568 2.40001 13.3 1.99771 13.3 1.50001C13.3 1.00231 13.2568 0.600006 12.76 0.600006H5.74C5.2432 0.600006 5.2 1.00231 5.2 1.50001C5.2 1.99771 5.2432 2.40001 5.74 2.40001ZM2.86 5.10001H1.24C0.743197 5.10001 0.699997 5.50231 0.699997 6.00001C0.699997 6.49771 0.743197 6.90001 1.24 6.90001H2.86C3.3568 6.90001 3.4 6.49771 3.4 6.00001C3.4 5.50231 3.3568 5.10001 2.86 5.10001ZM2.86 9.60001H1.24C0.743197 9.60001 0.699997 10.0023 0.699997 10.5C0.699997 10.9977 0.743197 11.4 1.24 11.4H2.86C3.3568 11.4 3.4 10.9977 3.4 10.5C3.4 10.0023 3.3568 9.60001 2.86 9.60001ZM2.86 0.600006H1.24C0.743197 0.600006 0.699997 1.00231 0.699997 1.50001C0.699997 1.99771 0.743197 2.40001 1.24 2.40001H2.86C3.3568 2.40001 3.4 1.99771 3.4 1.50001C3.4 1.00231 3.3568 0.600006 2.86 0.600006Z"
                    fill="#7C7C7C"
                  />
                </svg>
              ),
              name: 'Все категории',
            },
          ]}
        />
        {addList ? (
          <List
            activeList={activeList}
            onClickItem={(list) => {
              navigate(process.env.PUBLIC_URL + `/lists/${list.id}`);
            }}
            onDeleteItem={(id) => onDeleteItem(id)}
            isRemoveble={true}
            items={addList}
          />
        ) : (
          'Загрузка...'
        )}
        <AddList onAddList={onAddList} colors={colors} isRemoveble={true} />
      </div>
      <div className="todo__tasks">
        <Routes>
          <Route
            exact
            path="/"
            element={
              addList &&
              addList.map((list) => {
                return (
                  <Tasks
                    key={list.id}
                    onAddTask={onAddTask}
                    items={list}
                    editListTask={onEditListTitle}
                    onDeleteTask={onDeleteTask}
                    onChekedTask={onChekedTask}
                    withoutEmpty
                  />
                );
              })
            }
          />
          <Route
            path={process.env.PUBLIC_URL + '/lists/:id'}
            element={
              addList &&
              activeList && (
                <Tasks
                  key={addList.id}
                  onAddTask={onAddTask}
                  items={activeList}
                  editListTask={onEditListTitle}
                  onDeleteTask={onDeleteTask}
                  onEditTaskValue={onEditTask}
                  onChekedTask={onChekedTask}
                />
              )
            }></Route>
        </Routes>
      </div>
    </div>
  );
}

export default App;
