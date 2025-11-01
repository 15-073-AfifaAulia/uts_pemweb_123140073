import React, { useState, useEffect } from 'react';
import { Form, Row, Col, Button, Spinner } from 'react-bootstrap';
import axios from 'axios';

// Kita akan meneruskan fungsi 'onSearch' dari App.jsx
function SearchForm({ onSearch, setIsLoading }) {
  const [categories, setCategories] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('');
  const [isLoadingCategories, setIsLoadingCategories] = useState(true);

  // URL API untuk daftar kategori
  const CATEGORIES_URL = 'https://www.themealdb.com/api/json/v1/1/list.php?c=list';

  // useEffect ini akan berjalan SATU KALI saat komponen dimuat
  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const response = await axios.get(CATEGORIES_URL);
        // API mengembalikan daftar kategori di dalam properti 'meals'
        setCategories(response.data.meals || []);
      } catch (error) {
        console.error('Error fetching categories:', error);
      } finally {
        setIsLoadingCategories(false);
      }
    };

    fetchCategories();
  }, []); // Array dependensi kosong berarti 'jalankan sekali saat mount'

  // Fungsi ini dipanggil saat tombol "Cari" ditekan
  const handleSubmit = (event) => {
    event.preventDefault(); // Mencegah halaman refresh
    setIsLoading(true); // Memberi tahu App.jsx untuk menampilkan loading
    onSearch(searchTerm, selectedCategory); // Mengirim data ke App.jsx
  };

  return (
    <Form onSubmit={handleSubmit} className="mb-4">
      <Row className="align-items-end">
        {}
        <Form.Group as={Col} md="5" controlId="formSearchTerm">
          <Form.Label>Cari berdasarkan Nama Resep</Form.Label>
          <Form.Control
            type="text"
            placeholder="Contoh: Chicken..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </Form.Group>

        {}
        <Form.Group as={Col} md="5" controlId="formCategory">
          <Form.Label>Filter berdasarkan Kategori</Form.Label>
          {isLoadingCategories ? (
            // Tampilkan spinner kecil selagi loading kategori
            <Spinner animation="border" size="sm" /> 
          ) : (
            <Form.Select
              value={selectedCategory}
              onChange={(e) => setSelectedCategory(e.target.value)}
            >
              <option value="">Semua Kategori</option>
              {}
              {categories.map((category) => (
                <option key={category.strCategory} value={category.strCategory}>
                  {category.strCategory}
                </option>
              ))}
            </Form.Select>
          )}
        </Form.Group>

        {}
        <Col md="2" className="d-grid">
          <Button variant="primary" type="submit">
            Cari
          </Button>
        </Col>
      </Row>
    </Form>
  );
}

export default SearchForm;