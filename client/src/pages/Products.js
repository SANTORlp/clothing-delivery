import React, { useState } from 'react';
import { 
  Container, 
  Grid, 
  Card, 
  CardContent, 
  CardMedia, 
  Typography, 
  Button, 
  Box, 
  TextField,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Pagination,
  Rating
} from '@mui/material';
import { useCart } from '../context/CartContext';

// Datos de ejemplo - en una aplicación real, estos vendrían de tu API
const products = [
  {
    id: 1,
    name: 'Camiseta Básica Blanca',
    price: 19.99,
    image: 'https://via.placeholder.com/300x300?text=Camiseta+Blanca',
    category: 'Camisetas',
    rating: 4.5,
  },
  {
    id: 2,
    name: 'Pantalón Vaquero Azul',
    price: 49.99,
    image: 'https://via.placeholder.com/300x300?text=Pantalon+Azul',
    category: 'Pantalones',
    rating: 4.2,
  },
  {
    id: 3,
    name: 'Zapatillas Deportivas',
    price: 79.99,
    image: 'https://via.placeholder.com/300x300?text=Zapatillas',
    category: 'Zapatos',
    rating: 4.7,
  },
  {
    id: 4,
    name: 'Sudadera con Capucha',
    price: 39.99,
    image: 'https://via.placeholder.com/300x300?text=Sudadera',
    category: 'Abrigos',
    rating: 4.3,
  },
  {
    id: 5,
    name: 'Vestido Floral',
    price: 34.99,
    image: 'https://via.placeholder.com/300x300?text=Vestido',
    category: 'Vestidos',
    rating: 4.6,
  },
  {
    id: 6,
    name: 'Chaqueta de Cuero',
    price: 89.99,
    image: 'https://via.placeholder.com/300x300?text=Chaqueta',
    category: 'Chaquetas',
    rating: 4.8,
  },
];

const categories = ['Todas', ...new Set(products.map(product => product.category))];

const Products = () => {
  const { addToCart } = useCart();
  const [searchTerm, setSearchTerm] = useState('');
  const [category, setCategory] = useState('Todas');
  const [page, setPage] = useState(1);
  const itemsPerPage = 6;

  const filteredProducts = products.filter(product => {
    const matchesSearch = product.name.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesCategory = category === 'Todas' || product.category === category;
    return matchesSearch && matchesCategory;
  });

  const pageCount = Math.ceil(filteredProducts.length / itemsPerPage);
  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const handlePageChange = (event, value) => {
    setPage(value);
    window.scrollTo(0, 0);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Box sx={{ mb: 4, display: 'flex', flexDirection: { xs: 'column', md: 'row' }, gap: 2 }}>
        <TextField
          label="Buscar productos"
          variant="outlined"
          fullWidth
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          sx={{ flex: 2 }}
        />
        <FormControl sx={{ minWidth: 200 }}>
          <InputLabel id="category-label">Categoría</InputLabel>
          <Select
            labelId="category-label"
            value={category}
            label="Categoría"
            onChange={(e) => setCategory(e.target.value)}
          >
            {categories.map((cat) => (
              <MenuItem key={cat} value={cat}>
                {cat}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>

      <Grid container spacing={4}>
        {paginatedProducts.map((product) => (
          <Grid item key={product.id} xs={12} sm={6} md={4}>
            <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={product.image}
                alt={product.name}
                sx={{ objectFit: 'cover' }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="h3">
                  {product.name}
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={product.rating} precision={0.5} readOnly />
                  <Typography variant="body2" color="text.secondary" sx={{ ml: 1 }}>
                    {product.rating}
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary" sx={{ mb: 2 }}>
                  ${product.price.toFixed(2)}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                  {product.category}
                </Typography>
                <Button 
                  variant="contained" 
                  fullWidth 
                  onClick={() => addToCart(product)}
                >
                  Añadir al carrito
                </Button>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {pageCount > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination 
            count={pageCount} 
            page={page} 
            onChange={handlePageChange} 
            color="primary" 
          />
        </Box>
      )}
    </Container>
  );
};

export default Products;
