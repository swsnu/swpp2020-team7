import React, {useEffect, ChangeEvent, Component, MouseEvent, FormEvent, useState} from 'react';
import {Form, Input, Button} from 'antd';
import {useDispatch, useSelector} from 'react-redux';
import {History} from 'history';

interface RecipeListProps {
  history: History;
}
interface StateProps {
  userName: string;
  userImage: HTMLImageElement; // or File(as input element) or String(url to image)
  foodName: string;
  foodCategory: string; 
  cookTime: number;
  foodLike: number; 
}

type RecipeProps = {

}

const RecipeList: React.FC<RecipeListProps> = (props) => {
  // userEffect(() => {
  //   if(recipes){
  //     setRecipes(data);
  //   }
  // }, [recipes])

  const onClickRecipeRegister = (e: MouseEvent<HTMLButtonElement>):void => {
    e.preventDefault();
    props.history.push('/recipe/create');
  }
  
  return (
      <div id="recipe-list">
        RecipeList
        <button id="recipe-register-button" 
                onClick={onClickRecipeRegister}>
          레시피 등록하기
        </button>
      </div>
  );
};

export default RecipeList;