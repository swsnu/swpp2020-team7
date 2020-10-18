import React from 'react';
import { History } from 'history';
import './Header.scss';

interface NavigationProps {
  history: History;
}

class Header extends React.Component<NavigationProps> {
  render() {
    return (
      <div id="header" className="d-flex justify-content-around">
          <button id="my-freeger-button"
                  onClick={()=> this.props.history.push('/freezers')}>
              나의 냉장고
          </button>
          <button id="my-recipe-button" 
                  onClick={()=> this.props.history.push('/recipes')}>
              레시피 찾기</button>
          <button id="my-article-button" 
                  onClick={()=> this.props.history.push('/articles')}>
              게시판
          </button>
      </div>
    );
  }
};

export default Header; 