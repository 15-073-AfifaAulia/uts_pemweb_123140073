import React from 'react';
import { Card, Col } from 'react-bootstrap';

// Komponen ini menerima 'recipe' (objek resep)
// dan 'onSelectRecipe' (fungsi yg dipanggil saat diklik)
function RecipeCard({ recipe, onSelectRecipe }) {
  
  // Data dari API pencarian/filter memiliki properti ini
  const { idMeal, strMeal, strMealThumb } = recipe;

  return (
    // Kita bungkus Card di dalam Col agar bisa masuk ke layout grid
    // md={4} -> 3 kartu per baris di tablet
    // lg={3} -> 4 kartu per baris di desktop
    <Col md={4} lg={3} className="mb-4">
      <Card
        className="h-100" // h-100 membuat semua kartu sama tinggi
        onClick={() => onSelectRecipe(idMeal)} // Memanggil fungsi dari App saat diklik
        style={{ cursor: 'pointer' }} // Mengubah kursor jadi 'pointer' saat di-hover
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