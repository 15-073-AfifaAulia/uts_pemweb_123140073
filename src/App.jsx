import React, { useState } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import RecipeList from './components/RecipeList';
import RecipeModal from './components/RecipeModal'; // 1. IMPORT MODAL
import { Container, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  // 2. STATE BARU UNTUK MODAL
  const [selectedMealId, setSelectedMealId] = useState(null);
  const [showModal, setShowModal] = useState(false);

  // Fungsi handleSearch tetap SAMA
  const handleSearch = async (term, category) => {
    setIsLoading(true); 
    setError(null);
    setRecipes([]);

    try {
      let searchUrl = '';

      if (term) {
        searchUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`;
      } else if (category) {
        searchUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
      } else {
        setError('Silakan masukkan nama resep atau pilih kategori.');
        setIsLoading(false);
        return; 
      }

      const response = await axios.get(searchUrl);

      if (response.data.meals) {
        setRecipes(response.data.meals);
      } else {
        setRecipes([]);
        setError('Resep tidak ditemukan. Coba kata kunci lain.');
      }
      
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Gagal mengambil data. Silakan coba lagi nanti.');
    } finally {
      setIsLoading(false);
    }
  };

  // 3. PERBARUI HANDLER CARD CLICK
  const handleSelectRecipe = (id) => {
    console.log(`Resep dipilih dengan ID: ${id}`);
    setSelectedMealId(id); // Simpan ID resep yang diklik
    setShowModal(true); // Buka modal
  };

  // 4. BUAT FUNGSI UNTUK MENUTUP MODAL
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMealId(null); // Reset ID saat modal ditutup
  };


  return (
    <div className="App">
      <Header />
      
      <Container>
        <SearchForm onSearch={handleSearch} setIsLoading={setIsLoading} />

        {/* Bagian ini tetap sama */}
        <div className="mt-4">
          {isLoading && (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p>Sedang memuat resep...</p>
            </div>
          )}

          {error && (
            <Alert variant="danger">{error}</Alert>
          )}

          {!isLoading && !error && recipes.length > 0 && (
            <RecipeList 
              recipes={recipes} 
              onSelectRecipe={handleSelectRecipe} 
            />
          )}
          
          {!isLoading && !error && recipes.length === 0 && (
            <Alert variant="info">
              Silakan cari resep atau pilih kategori untuk memulai.
            </Alert>
          )}
        </div>
      </Container>
      
      {/* 5. RENDER MODAL DI SINI (di luar Container agar bisa fullscreen) */}
      <RecipeModal 
        mealId={selectedMealId}
        show={showModal}
        onHide={handleCloseModal}
      />
    </div>
  );
}

export default App;