import React from 'react';
import { 
  Container, 
  Typography, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow, 
  Paper, 
  Button, 
  Box, 
  IconButton,
  Grid,
  Divider,
  TextField
} from '@mui/material';
import { useCart } from '../context/CartContext';
import DeleteIcon from '@mui/icons-material/Delete';
import AddIcon from '@mui/icons-material/Add';
import RemoveIcon from '@mui/icons-material/Remove';
import { Link } from 'react-router-dom';

const Cart = () => {
  const { 
    items, 
    totalItems, 
    totalPrice, 
    removeFromCart, 
    updateQuantity, 
    clearCart 
  } = useCart();

  const handleQuantityChange = (productId, newQuantity) => {
    const quantity = parseInt(newQuantity, 10) || 0;
    updateQuantity(productId, quantity);
  };

  if (items.length === 0) {
    return (
      <Container maxWidth="md" sx={{ py: 8, textAlign: 'center' }}>
        <Typography variant="h4" gutterBottom>
          Tu carrito está vacío
        </Typography>
        <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
          Parece que aún no has añadido ningún producto a tu carrito.
        </Typography>
        <Button 
          variant="contained" 
          color="primary" 
          component={Link}
          to="/products"
          size="large"
        >
          Ver Productos
        </Button>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" gutterBottom>
        Carrito de Compras
      </Typography>
      
      <TableContainer component={Paper} sx={{ mb: 4 }}>
        <Table>
          <TableHead>
            <TableRow>
              <TableCell>Producto</TableCell>
              <TableCell align="right">Precio</TableCell>
              <TableCell align="center">Cantidad</TableCell>
              <TableCell align="right">Total</TableCell>
              <TableCell align="right">Acciones</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {items.map((item) => (
              <TableRow key={item.id}>
                <TableCell>
                  <Box sx={{ display: 'flex', alignItems: 'center' }}>
                    <img 
                      src={item.image} 
                      alt={item.name} 
                      style={{ width: 60, height: 60, objectFit: 'cover', marginRight: 16 }} 
                    />
                    <Typography variant="body1">{item.name}</Typography>
                  </Box>
                </TableCell>
                <TableCell align="right">${item.price.toFixed(2)}</TableCell>
                <TableCell align="center">
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                    <IconButton 
                      size="small" 
                      onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                    >
                      <RemoveIcon />
                    </IconButton>
                    <TextField
                      value={item.quantity}
                      onChange={(e) => handleQuantityChange(item.id, e.target.value)}
                      type="number"
                      size="small"
                      inputProps={{ min: 1, style: { textAlign: 'center', width: '50px' } }}
                      sx={{ mx: 1 }}
                    />
                    <IconButton 
                      size="small" 
                      onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                    >
                      <AddIcon />
                    </IconButton>
                  </Box>
                </TableCell>
                <TableCell align="right">
                  ${(item.price * item.quantity).toFixed(2)}
                </TableCell>
                <TableCell align="right">
                  <IconButton 
                    color="error" 
                    onClick={() => removeFromCart(item.id)}
                  >
                    <DeleteIcon />
                  </IconButton>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>

      <Grid container spacing={4}>
        <Grid item xs={12} md={8}>
          <Button 
            variant="outlined" 
            color="error"
            startIcon={<DeleteIcon />}
            onClick={clearCart}
          >
            Vaciar carrito
          </Button>
        </Grid>
        <Grid item xs={12} md={4}>
          <Paper elevation={2} sx={{ p: 3 }}>
            <Typography variant="h6" gutterBottom>
              Resumen del Pedido
            </Typography>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
              <Typography>Productos ({totalItems})</Typography>
              <Typography>${totalPrice.toFixed(2)}</Typography>
            </Box>
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
              <Typography>Envío</Typography>
              <Typography>Gratis</Typography>
            </Box>
            <Divider sx={{ my: 2 }} />
            <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6">Total</Typography>
              <Typography variant="h6">${totalPrice.toFixed(2)}</Typography>
            </Box>
            <Button 
              variant="contained" 
              color="primary" 
              fullWidth
              size="large"
              component={Link}
              to="/checkout"
            >
              Proceder al pago
            </Button>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default Cart;
