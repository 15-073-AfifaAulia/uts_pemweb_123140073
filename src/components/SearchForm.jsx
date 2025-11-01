import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Spinner, ButtonGroup } from 'react-bootstrap'; // 1. Import ButtonGroup
import axios from 'axios';

// 2. Tambahkan props baru: 'onRandom' dan 'isMainLoading'
function SearchForm({ onSearch, onRandom, setIsLoading, isMainLoading }) {
  const [categories, setCategories] = useState([]);
  const [areas, setAreas] = useState([]); 
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [selectedArea, setSelectedArea] = useState('');

  const [isLoadingCategories, setIsLoadingCategories] = useState(true);
  const [isLoadingAreas, setIsLoadingAreas] = useState(true);

  const CATEGORIES_URL = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';
  const AREAS_URL = 'https://www.themealdb.com/api/json/v1/1/list.php?a=list';

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(CATEGORIES_URL);
        setCategories(response.data.meals || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    const fetchAreas = async () => {
      try {
        const response = await axios.get(AREAS_URL);
        setAreas(response.data.meals || []);
      } catch (error) {
        console.error('Error fetching areas:', error);
      } finally {
        setIsLoadingAreas(false);
      }
    };

    fetchCategories();
    fetchAreas();
  }, []); 

  const handleSubmit = (event) => {
    event.preventDefault();
    setIsLoading(true); // Ini adalah loading untuk pencarian
    onSearch(searchTerm, selectedCategory, selectedArea); 
  };
  
  // 3. Buat handler untuk tombol acak
  const handleRandomClick = () => {
    // Kosongkan form (opsional, tapi rapi)
    setSearchTerm('');
    setSelectedCategory('');
    setSelectedArea('');
    // Panggil fungsi 'onRandom' dari App.jsx
    onRandom(); 
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      {/* 4. Sesuaikan layout grid (md="4", md="3", md="3", md="2") */}
      <Row className="align-items-end gy-3">
        {/* Input Teks Pencarian */}
        <Form.Group as={Col} md="4" controlId="formSearchTerm">
          <Form.Label>Cari berdasarkan Nama Resep</Form.Label>
          <Form.Control
            type="text"
            placeholder="Contoh: Chicken..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            disabled={isMainLoading} // Disable saat loading
          />
        </Form.Group>

        {/* Dropdown Kategori */}
        <Form.Group as={Col} md="3" controlId="formCategory">
          <Form.Label>Kategori</Form.Label>
          {isLoadingCategories ? ( <Spinner animation="border" size="sm" /> ) : (
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
              disabled={isMainLoading} // Disable saat loading
            >
              <option value="">Semua Kategori</option>
              {categories.map((category) => (
                <option key={category.strCategory} value={category.strCategory}>
                  {category.strCategory}
                </option>
              ))}
            </Form.Select>
          )}
        </Form.Group>
        
        {/* Dropdown Area */}
        <Form.Group as={Col} md="3" controlId="formArea">
          <Form.Label>Area (Country)</Form.Label>
          {isLoadingAreas ? ( <Spinner animation="border" size="sm" /> ) : (
            <Form.Select
              value={selectedArea}
              onChange={(e) => setSelectedArea(e.target.value)}
              disabled={isMainLoading} // Disable saat loading
            >
              <option value="">Semua Area</option>
              {areas.map((area) => (
                <option key={area.strArea} value={area.strArea}>
                  {area.strArea}
                </option>
              ))}
            </Form.Select>
          )}
        </Form.Group>

        {/* 5. Grup Tombol Submit & Acak */}
        <Col md="2" className="d-grid">
          <ButtonGroup>
            <Button 
              variant="primary" 
              type="submit" 
              disabled={isMainLoading} // Disable saat loading
            >
              Cari
            </Button>
            <Button 
              variant="info" 
              type="button" // PENTING: type="button" agar tidak submit form
              onClick={handleRandomClick} 
              disabled={isMainLoading} // Disable saat loading
              title="Cari Resep Acak"
            >
              🎲
            </Button>
          </ButtonGroup>
        </Col>
      </Row>
    </Form>
  );
}

export default SearchForm;