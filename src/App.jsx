import React, { useState } from 'react';
import Header from './components/Header';
import SearchForm from './components/SearchForm';
import { Container, Spinner, Alert } from 'react-bootstrap';
import axios from 'axios';

function App() {
  // State untuk menyimpan hasil pencarian
  const [recipes, setRecipes] = useState([]);
  // State untuk status loading
  const [isLoading, setIsLoading] = useState(false);
  // State untuk pesan error
  const [error, setError] = useState(null);

  // Fungsi ini akan dipanggil oleh SearchForm
  const handleSearch = async (term, category) => {
    setIsLoading(true); 
    setError(null);
    setRecipes([]);

    console.log(`Mencari resep... Term: ${term}, Category: ${category}`);

    try {
      let searchUrl = '';
      if (term) {
        // Jika ada input teks, utamakan cari berdasarkan nama
        searchUrl = `https://www.themealdb.com/api/json/v1/1/search.php?s=${term}`;
      } else if (category) {
        // Jika tidak ada input teks tapi ada kategori, cari berdasarkan kategori
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
      // Set loading jadi false setelah selesai (baik sukses atau error)
      setIsLoading(false);
    }
  };

  return (
    <div className="App">
      <Header />
      
      <Container>
        {}
        <SearchForm onSearch={handleSearch} setIsLoading={setIsLoading} />

        {}
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

          {!isLoading && !error && (
            <div>
              {}
              <h3>Hasil Pencarian: ({recipes.length} resep ditemukan)</h3>
              <pre style={{backgroundColor: '#f0f0f0', padding: '10px', borderRadius: '5px'}}>
                {JSON.stringify(recipes, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </Container>
    </div>
  );
}

export default App;