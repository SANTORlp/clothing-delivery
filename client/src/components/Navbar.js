import React from 'react';
import { Link } from 'react-router-dom';
import { AppBar, Toolbar, Typography, Button, Badge, Box } from '@mui/material';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useCart } from '../context/CartContext';

const Navbar = () => {
  const { totalItems } = useCart();

  return (
    <AppBar position="static">
      <Toolbar>
        <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
          <Link to="/" style={{ color: 'white', textDecoration: 'none' }}>
            Clothing Store
          </Link>
        </Typography>
        <Box>
          <Button color="inherit" component={Link} to="/">
            Inicio
          </Button>
          <Button color="inherit" component={Link} to="/products">
            Productos
          </Button>
          <Button 
            color="inherit" 
            component={Link} 
            to="/cart"
            startIcon={
              <Badge badgeContent={totalItems} color="error">
                <ShoppingCartIcon />
              </Badge>
            }
          >
            Carrito
          </Button>
        </Box>
      </Toolbar>
    </AppBar>
  );
};

export default Navbar;
