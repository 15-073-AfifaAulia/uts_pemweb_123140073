import React, { useState } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import RecipeList from './components/RecipeList';
import RecipeModal from './components/RecipeModal';
import { Container, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

function App() {
  // State untuk menyimpan hasil pencarian
  const [recipes, setRecipes] = useState([]);
  // State untuk status loading (saat mencari resep)
  const [isLoading, setIsLoading] = useState(false);
  // State untuk pesan error
  const [error, setError] = useState(null);

  // State untuk modal detail resep
  const [selectedMealId, setSelectedMealId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const handleSearch = async (term, category, area) => {
    setIsLoading(true); 
    setError(null);
    setRecipes([]);

    console.log(`Mencari... Term: ${term}, Category: ${category}, Area: ${area}`);

    try {
      let searchUrl = '';
      let errorMsg = 'Resep tidak ditemukan. Coba kata kunci lain.';

      // Prioritas 1: Pencarian berdasarkan Nama (Term)
      if (term) {
        searchUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`;
      } 
      // Prioritas 2: Filter berdasarkan Kategori
      else if (category) {
        searchUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?c=${category}`;
      } 
      // Prioritas 3: Filter berdasarkan Area
      else if (area) {
        searchUrl = `https://www.themealdb.com/api/json/v1/1/filter.php?a=${area}`;
      } 
      // Jika semua kosong
      else {
        setError('Silakan masukkan nama resep atau pilih filter (Kategori/Area).');
        setIsLoading(false);
        return; 
      }

      const response = await axios.get(searchUrl);

      if (response.data.meals) {
        setRecipes(response.data.meals);
      } else {
        // Jika API mengembalikan 'null' (tidak ditemukan)
        setRecipes([]);
        if (category) errorMsg = `Tidak ada resep ditemukan untuk kategori: ${category}`;
        if (area) errorMsg = `Tidak ada resep ditemukan untuk area: ${area}`;
        setError(errorMsg);
      }
      
    } catch (err) {
      console.error('Error fetching recipes:', err);
      setError('Gagal mengambil data. Silakan coba lagi nanti.');
    } finally {
      setIsLoading(false);
    }
  };

  /**
   * Dipanggil oleh SearchForm saat tombol "Acak" (🎲) ditekan.
   * Mengambil resep acak dan langsung membuka modal detail.
   */
  const handleRandomSearch = async () => {
    setIsLoading(true); // Gunakan loading global
    setError(null);
    setRecipes([]); // Kosongkan hasil pencarian di latar belakang
    
    try {
      const url = 'https://www.themealdb.com/api/json/v1/1/random.php';
      const response = await axios.get(url);

      if (response.data.meals && response.data.meals.length > 0) {
        const randomMeal = response.data.meals[0];
        
        // Langsung set state untuk membuka modal
        setSelectedMealId(randomMeal.idMeal);
        setShowModal(true);
      } else {
        setError('Gagal mendapatkan resep acak.');
      }
    } catch (err) {
      console.error('Error fetching random recipe:', err);
      setError('Gagal mengambil data. Silakan coba lagi nanti.');
    } finally {
      setIsLoading(false); // Matikan loading global
    }
  };

  /**
   * Dipanggil oleh RecipeCard saat sebuah kartu diklik.
   * Menyimpan ID resep dan membuka modal.
   */
  const handleSelectRecipe = (id) => {
    console.log(`Resep dipilih dengan ID: ${id}`);
    setSelectedMealId(id);
    setShowModal(true);
  };

  /**
   * Dipanggil oleh RecipeModal saat modal ingin ditutup.
   * Mereset state modal.
   */
  const handleCloseModal = () => {
    setShowModal(false);
    setSelectedMealId(null);
  };

  return (
    <div className="App">
      <Header />
      
      <Container>
        {/* Teruskan semua props yang diperlukan ke SearchForm */}
        <SearchForm 
          onSearch={handleSearch} 
          setIsLoading={setIsLoading} 
          onRandom={handleRandomSearch}
          isMainLoading={isLoading}
        />

        {/* --- Area Tampilan Hasil --- */}
        <div className="mt-4">
          {/* 1. Tampilan Loading */}
          {isLoading && (
            <div className="text-center">
              <Spinner animation="border" variant="primary" />
              <p>Sedang memuat resep...</p>
            </div>
          )}

          {/* 2. Tampilan Error */}
          {error && (
            <Alert variant="danger">{error}</Alert>
          )}

          {/* 3. Tampilan Hasil (jika tidak loading, tidak error, dan ada resep) */}
          {!isLoading && !error && recipes.length > 0 && (
            <RecipeList 
              recipes={recipes} 
              onSelectRecipe={handleSelectRecipe} 
            />
          )}
          
          {/* 4. Tampilan Awal (jika tidak loading, tidak error, dan resep kosong) */}
          {!isLoading && !error && recipes.length === 0 && (
            <Alert variant="info">
              Silakan cari resep atau pilih filter (Kategori/Area) untuk memulai, atau klik 🎲 untuk resep acak.
            </Alert>
          )}
        </div>
      </Container>
      
      {/* --- Modal Detail Resep --- */}
      {/* Dirender di luar Container agar bisa overlay penuh */}
      <RecipeModal 
        mealId={selectedMealId}
        show={showModal}
        onHide={handleCloseModal}
      />
    </div>
  );
}

export default App;
