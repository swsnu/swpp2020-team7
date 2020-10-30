import React, {useEffect, MouseEvent} from 'react';
import { useSelector } from 'react-redux';
import {History} from 'history';
import {AppState} from '../../index';

interface RecipeListProps {
  history: History;
}

const RecipeList: React.FC<RecipeListProps> = ({history}) => {
  const recipe_list = useSelector((state:AppState) => state.recipes);
 
  const onClickRecipeRegister = (e: MouseEvent<HTMLButtonElement>):void => {
    e.preventDefault();
    history.push('/recipes/create');
  }
  
  useEffect( () => {
    console.log(recipe_list);
  }, []);

  return (
      <div id="recipe-list">
        {/* TODO: RECIPE compoenet로 list 출력해야함 */}
        {recipe_list.recipes}
        <button id="recipe-register-button" 
                onClick={onClickRecipeRegister}>
                레시피 등록하기
        </button>
      </div>
  );
};

export default React.memo(RecipeList);