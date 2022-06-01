import React from 'react';

import List from '../List/List';
import Badge from '../Badge/Badge';

import './AddList.scss';
import closeSvg from '../../assets/img/close.svg';
import axios from 'axios';

const AddList = ({ colors, onAddList }) => {
  const [visiblePopup, setVisiblePopup] = React.useState(false);
  const [selectColor, setSelectColor] = React.useState(1);
  const [isLoading, setIsloading] = React.useState(false);
  const [inputValue, setInputValue] = React.useState('');

  React.useEffect(() => {
    if (Array.isArray(selectColor)) {
      setSelectColor(colors[0].id);
    }
  }, [colors]);

  const onVisiblePopup = () => {
    setVisiblePopup(true);
  };

  const onClosePopup = () => {
    setVisiblePopup(false);
  };

  const onClickAddList = () => {
    if (!inputValue) {
      alert('Введите название папки');
      return;
    }
    setIsloading(true);
    axios
      .post('http://localhost:3001/lists', {
        name: inputValue,
        colorId: selectColor,
      })
      .then(({ data }) => {
        const color = colors.filter((color) => color.id === selectColor)[0];
        const listObj = { ...data, color, tasks: [] };
        onAddList(listObj);
        setIsloading(false);
        setVisiblePopup(false);
        setInputValue('');
        setSelectColor(colors[0].id);
      });
  };

  return (
    <div className="add-list">
      <List
        onClick={onVisiblePopup}
        items={[
          {
            icon: (
              <svg
                width="12"
                height="12"
                viewBox="0 0 12 12"
                fill="none"
                xmlns="http://www.w3.org/2000/svg">
                <path
                  d="M6 1V11"
                  stroke="#868686"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
                <path
                  d="M1 6H11"
                  stroke="#868686"
                  strokeWidth="1.5"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            ),
            name: 'Добавить',
          },
        ]}
      />
      {visiblePopup && (
        <div className="add-list__popup">
          <img
            onClick={onClosePopup}
            src={closeSvg}
            alt="close"
            className="add-list__popup-close-btn"
          />
          <input
            onChange={(e) => setInputValue(e.target.value)}
            className="field"
            type="text"
            placeholder="Название папки"
          />
          <div className="add-list__popup-colors">
            {colors.map((item) => {
              return (
                <Badge
                  color={item.name}
                  onClick={() => setSelectColor(item.id)}
                  className={selectColor === item.id ? 'active' : ''}
                />
              );
            })}
          </div>
          <button onClick={onClickAddList} className="button">
            {isLoading ? 'Добавяется...' : 'Добавить'}
          </button>
        </div>
      )}
    </div>
  );
};

export default AddList;
