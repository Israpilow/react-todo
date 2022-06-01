import React from 'react';
import axios from 'axios';

import './List.scss';
import '../Badge/Badge.scss';

import closeList from '../../assets/img/closeList.svg';
import classNames from 'classnames';

const List = ({ items, onClick, isRemoveble, onDeleteItem, onClickItem, activeList }) => {
  const onRemoveList = (id) => {
    if (window.confirm('Вы действительно хотите удалить список ?')) {
      axios.delete('http://localhost:3001/lists/' + id).then(() => {
        onDeleteItem(id);
      });
    }
  };
  return (
    <ul onClick={onClick} className="list">
      {items &&
        items.map((item, index) => {
          return (
            <li
              key={index}
              className={classNames(item.className, {
                active: item.active ? item.active : activeList && activeList.id === item.id,
              })}
              onClick={() => onClickItem(item)}>
              <i>{item.icon ? item.icon : <i className={`badge badge--${item.color.name}`}></i>}</i>
              <span>
                {item.name} {item.tasks && ` (${item.tasks.length})`}
              </span>
              {isRemoveble && (
                <img onClick={() => onRemoveList(item.id)} src={closeList} alt="closeList" />
              )}
            </li>
          );
        })}
    </ul>
  );
};

export default List;
