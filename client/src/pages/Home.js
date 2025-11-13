import React from 'react';
import { Container, Typography, Button, Box, Grid, Card, CardContent, CardMedia } from '@mui/material';
import { Link } from 'react-router-dom';

const featuredProducts = [
  {
    id: 1,
    name: 'Camiseta Básica',
    price: 19.99,
    image: 'https://via.placeholder.com/300x300?text=Camiseta+Basica',
  },
  {
    id: 2,
    name: 'Pantalón Vaquero',
    price: 49.99,
    image: 'https://via.placeholder.com/300x300?text=Pantalon+Vaquero',
  },
  {
    id: 3,
    name: 'Zapatillas Deportivas',
    price: 79.99,
    image: 'https://via.placeholder.com/300x300?text=Zapatillas+Deportivas',
  },
];

const Home = () => {
  return (
    <Box>
      {/* Hero Section */}
      <Box 
        sx={{
          bgcolor: 'primary.main',
          color: 'white',
          py: 8,
          textAlign: 'center',
          mb: 6,
        }}
      >
        <Container maxWidth="md">
          <Typography variant="h2" component="h1" gutterBottom>
            Bienvenido a Nuestra Tienda
          </Typography>
          <Typography variant="h5" gutterBottom>
            Descubre las últimas tendencias en moda
          </Typography>
          <Button 
            variant="contained" 
            color="secondary" 
            size="large" 
            component={Link}
            to="/products"
            sx={{ mt: 3 }}
          >
            Ver Productos
          </Button>
        </Container>
      </Box>

      {/* Featured Products */}
      <Container maxWidth="lg" sx={{ mb: 8 }}>
        <Typography variant="h4" component="h2" align="center" gutterBottom>
          Productos Destacados
        </Typography>
        <Grid container spacing={4}>
          {featuredProducts.map((product) => (
            <Grid item key={product.id} xs={12} sm={6} md={4}>
              <Card sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
                <CardMedia
                  component="img"
                  height="200"
                  image={product.image}
                  alt={product.name}
                />
                <CardContent sx={{ flexGrow: 1 }}>
                  <Typography gutterBottom variant="h6" component="h3">
                    {product.name}
                  </Typography>
                  <Typography variant="h6" color="text.secondary">
                    ${product.price.toFixed(2)}
                  </Typography>
                </CardContent>
              </Card>
            </Grid>
          ))}
        </Grid>
      </Container>
    </Box>
  );
};

export default Home;
