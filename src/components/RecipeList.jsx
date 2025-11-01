import React from 'react';
import { Row } from 'react-bootstrap';
import RecipeCard from './RecipeCard';

// Komponen ini menerima 'recipes' (array resep)
// dan 'onSelectRecipe' (fungsi untuk diteruskan ke RecipeCard)
function RecipeList({ recipes, onSelectRecipe }) {
  return (
    <Row>
      {/* Loop (map) setiap resep di dalam array 'recipes' 
        dan render satu RecipeCard untuk setiap resep.
      */}
      {recipes.map((recipe) => (
        <RecipeCard
          key={recipe.idMeal}
          recipe={recipe}
          onSelectRecipe={onSelectRecipe}
        />
      ))}
    </Row>
  );
}

export default RecipeList;