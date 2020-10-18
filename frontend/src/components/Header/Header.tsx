import React from 'react';
import { History } from 'history';
import './Header.scss';

interface NavigationProps {
  history: History;
}

const Header: React.FC<NavigationProps> = ({history}) => {
    return (
      <div id="header" className="d-flex justify-content-around">
          <button id="my-freeger-button"
                  onClick={()=> history.push('/fridge')}>
              나의 냉장고
          </button>
          <button id="my-recipe-button" 
                  onClick={()=> history.push('/recipe')}>
              레시피 찾기</button>
          <button id="my-article-button" 
                  onClick={()=> history.push('/article')}>
              게시판
          </button>
      </div>
    );
};

export default Header; 