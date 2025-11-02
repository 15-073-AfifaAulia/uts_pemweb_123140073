import React, { useState, useEffect } from 'react';
import { Modal, Button, Image, Spinner, Alert, ListGroup } from 'react-bootstrap';
import axios from 'axios';

// Komponen ini menerima 3 props:
// 1. mealId: ID resep yang akan ditampilkan
// 2. show: boolean (true/false) untuk menampilkan/menyembunyikan modal
// 3. onHide: fungsi untuk menutup modal (dijalankan saat klik 'Close' atau di luar)
function RecipeModal({ mealId, show, onHide }) {
  const [recipe, setRecipe] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (mealId && show) {
      const fetchRecipeDetail = async () => {
        setIsLoading(true);
        setError(null);
        setRecipe(null); // Kosongkan resep sebelumnya
        
        try {
          const url = `https://www.themealdb.com/api/json/v1/1/lookup.php?i=${mealId}`;
          const response = await axios.get(url);
          
          if (response.data.meals && response.data.meals.length > 0) {
            setRecipe(response.data.meals[0]);
          } else {
            setError('Detail resep tidak ditemukan.');
          }
        } catch (err) {
          console.error('Error fetching recipe detail:', err);
          setError('Gagal memuat detail resep.');
        } finally {
          setIsLoading(false);
        }
      };

      fetchRecipeDetail();
    }
  }, [mealId, show]);

  // Helper function untuk merender daftar bahan
  const renderIngredients = () => {
    if (!recipe) return null;

    const ingredients = [];
    // API TheMealDB memiliki format strIngredient1 s/d 20 dan strMeasure1 s/d 20
    for (let i = 1; i <= 20; i++) {
      const ingredient = recipe[`strIngredient${i}`];
      const measure = recipe[`strMeasure${i}`];

      // Jika ada bahan (tidak null atau string kosong)
      if (ingredient && ingredient.trim() !== '') {
        ingredients.push(
          <ListGroup.Item key={i}>
            {measure} <strong>{ingredient}</strong>
          </ListGroup.Item>
        );
      }
    }
    return ingredients;
  };

  return (
    <Modal show={show} onHide={onHide} size="lg" centered>
      <Modal.Header closeButton>
        <Modal.Title>{recipe ? recipe.strMeal : 'Memuat...'}</Modal.Title>
      </Modal.Header>
      
      <Modal.Body>
        {isLoading && (
          <div className="text-center">
            <Spinner animation="border" />
            <p>Memuat detail...</p>
          </div>
        )}

        {error && (
          <Alert variant="danger">{error}</Alert>
        )}

        {!isLoading && !error && recipe && (
          <>
            <Image src={recipe.strMealThumb} alt={recipe.strMeal} fluid rounded className="mb-3" />
            
            <h4>Bahan-Bahan (Ingredients)</h4>
            <ListGroup variant="flush" className="mb-3">
              {renderIngredients()}
            </ListGroup>

            <h4>Instruksi Memasak</h4>

            <p style={{ whiteSpace: 'pre-wrap' }}>
              {recipe.strInstructions}
            </p>

            <hr />
            <p><strong>Kategori:</strong> {recipe.strCategory}</p>
            <p><strong>Asal (Area):</strong> {recipe.strArea}</p>
            {recipe.strTags && <p><strong>Tags:</strong> {recipe.strTags.split(',').join(', ')}</p>}
          </>
        )}
      </Modal.Body>
      
      <Modal.Footer>
        <Button variant="secondary" onClick={onHide}>
          Tutup
        </Button>
      </Modal.Footer>
    </Modal>
  );
}

export default RecipeModal;