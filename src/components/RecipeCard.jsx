import React from 'react';
import { Card, Col } from 'react-bootstrap';

// Komponen ini menerima 'recipe' (objek resep)
// dan 'onSelectRecipe' (fungsi yg dipanggil saat diklik)
function RecipeCard({ recipe, onSelectRecipe }) {
  
  // Data dari API pencarian/filter memiliki properti ini
  const { idMeal, strMeal, strMealThumb } = recipe;

  return (
    // Kita bungkus Card di dalam Col agar bisa masuk ke layout grid
    <Col md={4} lg={3} className="mb-4">
      <Card
        className="h-100"
        onClick={() => onSelectRecipe(idMeal)}
        style={{ cursor: 'pointer' }}
      >
        <Card.Img variant="top" src={strMealThumb} alt={strMeal} />
        <Card.Body>
          <Card.Title>{strMeal}</Card.Title>
        </Card.Body>
      </Card>
    </Col>
  );
}

export default RecipeCard;