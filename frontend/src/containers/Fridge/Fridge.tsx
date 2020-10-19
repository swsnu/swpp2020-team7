import React from 'react';
import TodayNote from '../../components/TodayNote/TodayNote';
import AddIngredient from '../AddIngredient/AddIngredient';
import TodayRecipe from '../../components/TodayRecipe/TodayRecipe';
import TodayStar from '../../components/TodayStar/TodayStar';

const Fridge: React.FC = () => {
    return (
      <div id="fridge" className="d-flex m-5 justify-content-around">
        <div id="fridge-notes-and-ingredients" className="d-flex flex-column">
          <TodayNote/> 
          <AddIngredient/>
        </div>
        <div> Fridge </div>
        <div id="today-recipe-and-star" className="d-flex flex-column">
          <TodayRecipe/> 
          <TodayStar/> 
        </div>
      </div>
    ); 
};

export default Fridge;