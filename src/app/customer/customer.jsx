'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { 
  Box, 
  Typography, 
  Paper, 
  Table, 
  TableBody, 
  TableCell, 
  TableContainer, 
  TableHead, 
  TableRow,
  TextField,
  Button,
  IconButton,
  Select,
  MenuItem,
  FormControl,
  InputAdornment,
  Grid,
  Avatar,
} from '@mui/material';
import { 
  Search as SearchIcon,
  Person as PersonIcon,
  Delete as DeleteIcon,
  Add as AddIcon,
  Fullscreen as FullscreenIcon,
  FullscreenExit as FullscreenExitIcon,
  PointOfSale as PosIcon,
} from '@mui/icons-material';

export default function POSPage() {
  const router = useRouter();
  const [searchProduct, setSearchProduct] = useState('');
  const [selectedCustomer, setSelectedCustomer] = useState('');
  const [cartItems, setCartItems] = useState([]);
  const [page, setPage] = useState(1);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [taxPercentage, setTaxPercentage] = useState(0);
  const [discountAmount, setDiscountAmount] = useState(0);
  const itemsPerPage = 12;

  // Sample products
  const allProducts = [
    { id: '35085421', name: "Men's T-Shirt", price: 1500.00, stock: 50, image: '/images/products/shirt.jpg' },
    { id: '35085422', name: "Men's T-Shirt", price: 1500.00, stock: 50, image: '/images/products/shirt.jpg' },
    { id: '35085423', name: "Men's T-Shirt", price: 1500.00, stock: 50, image: '/images/products/shirt.jpg' },
    { id: '35085424', name: "Men's T-Shirt", price: 1500.00, stock: 50, image: '/images/products/shirt.jpg' },
    { id: '35085425', name: "Men's T-Shirt", price: 1500.00, stock: 50, image: '/images/products/shirt.jpg' },
    { id: '35085426', name: "Men's T-Shirt", price: 1500.00, stock: 50, image: '/images/products/shirt.jpg' },
    { id: '35085427', name: "Men's T-Shirt", price: 1500.00, stock: 50, image: '/images/products/shirt.jpg' },
    { id: '35085428', name: "Men's T-Shirt", price: 1500.00, stock: 50, image: '/images/products/shirt.jpg' },
    { id: '35085429', name: "Men's T-Shirt", price: 1500.00, stock: 50, image: '/images/products/shirt.jpg' },
    { id: '35085430', name: "Men's T-Shirt", price: 1500.00, stock: 50, image: '/images/products/shirt.jpg' },
    { id: '35085431', name: "Men's T-Shirt", price: 1500.00, stock: 50, image: '/images/products/shirt.jpg' },
    { id: '35085432', name: "Men's T-Shirt", price: 1500.00, stock: 50, image: '/images/products/shirt.jpg' },
    { id: '35085433', name: "Men's T-Shirt", price: 1500.00, stock: 50, image: '/images/products/shirt.jpg' },
    { id: '35085434', name: "Men's T-Shirt", price: 1500.00, stock: 50, image: '/images/products/shirt.jpg' },
    { id: '35085435', name: "Men's T-Shirt", price: 1500.00, stock: 50, image: '/images/products/shirt.jpg' },
  ];

  const totalPages = Math.ceil(allProducts.length / itemsPerPage);
  const startIndex = (page - 1) * itemsPerPage;
  const currentProducts = allProducts.slice(startIndex, startIndex + itemsPerPage);

  const handlePageChange = (newPage) => {
    setPage(newPage);
  };

  const addToCart = (product) => {
    const existingItem = cartItems.find(item => item.id === product.id);
    if (existingItem) {
      setCartItems(cartItems.map(item =>
        item.id === product.id
          ? { ...item, quantity: item.quantity + 1 }
          : item
      ));
    } else {
      setCartItems([...cartItems, { ...product, quantity: 1 }]);
    }
  };

  const removeFromCart = (productId) => {
    setCartItems(cartItems.filter(item => item.id !== productId));
  };

  const updateQuantity = (productId, newQuantity) => {
    if (newQuantity <= 0) {
      removeFromCart(productId);
    } else {
      setCartItems(cartItems.map(item =>
        item.id === productId ? { ...item, quantity: newQuantity } : item
      ));
    }
  };

  const calculateSubtotal = () => {
    return cartItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  };

  const calculateTax = () => {
    return (calculateSubtotal() * taxPercentage) / 100;
  };

  const calculateDiscount = () => {
    return discountAmount;
  };

  const calculateGrandTotal = () => {
    return calculateSubtotal() + calculateTax() - calculateDiscount();
  };

  const handleReset = () => {
    setCartItems([]);
    setSearchProduct('');
    setSelectedCustomer('');
    setTaxPercentage(0);
    setDiscountAmount(0);
  };

  const handleHome = () => {
    router.push('/dashboard');
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
      setIsFullscreen(true);
    } else {
      if (document.exitFullscreen) {
        document.exitFullscreen();
        setIsFullscreen(false);
      }
    }
  };

  return (
    <Box sx={{ minHeight: '100vh', bgcolor: '#f9fafb', p: 3, pb: 12 }}>
      {/* Custom Top Bar for POS */}
      <Box
        sx={{
          bgcolor: 'white',
          borderRadius: '12px',
          p: 2,
          mb: 3,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          boxShadow: '0 1px 3px rgba(0,0,0,0.1)',
        }}
      >
        {/* Left Side - Search and Customer */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 2, flex: 1 }}>
          <TextField
            placeholder="Scan Product"
            value={searchProduct}
            onChange={(e) => setSearchProduct(e.target.value)}
            size="small"
            sx={{
              width: '300px',
              '& .MuiOutlinedInput-root': {
                bgcolor: '#f9fafb',
                borderRadius: '8px',
                fontSize: '14px',
                fontFamily: "'Play', sans-serif",
                '& fieldset': {
                  borderColor: '#e5e7eb',
                },
                '&:hover fieldset': {
                  borderColor: '#d1d5db',
                },
                '&.Mui-focused fieldset': {
                  borderColor: '#ff8c42',
                },
              },
            }}
            InputProps={{
              startAdornment: (
                <InputAdornment position="start">
                  <SearchIcon sx={{ color: '#9ca3af', fontSize: '20px' }} />
                </InputAdornment>
              ),
            }}
          />

          <FormControl size="small" sx={{ minWidth: 250 }}>
            <Select
              value={selectedCustomer}
              onChange={(e) => setSelectedCustomer(e.target.value)}
              displayEmpty
              sx={{
                borderRadius: '8px',
                bgcolor: '#f9fafb',
                fontFamily: "'Play', sans-serif",
                '& .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#e5e7eb',
                },
                '&:hover .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#d1d5db',
                },
                '&.Mui-focused .MuiOutlinedInput-notchedOutline': {
                  borderColor: '#ff8c42',
                },
              }}
            >
              <MenuItem value="">Select Customer</MenuItem>
              <MenuItem value="customer1">John Doe</MenuItem>
              <MenuItem value="customer2">Jane Smith</MenuItem>
              <MenuItem value="customer3">Bob Johnson</MenuItem>
            </Select>
          </FormControl>
        </Box>

        {/* Right Side - Icons */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          <IconButton
            sx={{
              color: '#6b7280',
              bgcolor: '#f3f4f6',
              '&:hover': {
                bgcolor: '#e5e7eb',
              },
            }}
          >
            <PersonIcon />
          </IconButton>
          <IconButton
            sx={{
              color: '#6b7280',
              bgcolor: '#f3f4f6',
              '&:hover': {
                bgcolor: '#e5e7eb',
              },
            }}
          >
            <PosIcon />
          </IconButton>
          <IconButton
            onClick={toggleFullscreen}
            sx={{
              color: '#6b7280',
              bgcolor: '#f3f4f6',
              '&:hover': {
                bgcolor: '#e5e7eb',
              },
            }}
          >
            {isFullscreen ? <FullscreenExitIcon /> : <FullscreenIcon />}
          </IconButton>
          <IconButton
            sx={{
              width: 40,
              height: 40,
              bgcolor: '#2d3748',
              color: 'white',
              '&:hover': {
                bgcolor: '#1a202c',
              },
            }}
          >
            <Typography sx={{ fontSize: '14px', fontWeight: 600 }}>JD</Typography>
          </IconButton>
        </Box>
      </Box>

      {/* Main Content */}
      <Grid container spacing={3}>
        {/* Left Side - Cart Table */}
        <Grid item xs={12} md={5}>
          <Paper sx={{ borderRadius: '12px', height: 'calc(100vh - 240px)', display: 'flex', flexDirection: 'column' }}>
            {/* Table Header */}
            <Box sx={{ p: 2, borderBottom: '1px solid #e5e7eb' }}>
              <Grid container spacing={2}>
                <Grid item xs={4}>
                  <Typography sx={{ fontFamily: "'Play', sans-serif", fontWeight: 600, color: '#6b7280' }}>
                    Product
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography sx={{ fontFamily: "'Play', sans-serif", fontWeight: 600, color: '#6b7280' }}>
                    Price
                  </Typography>
                </Grid>
                <Grid item xs={2}>
                  <Typography sx={{ fontFamily: "'Play', sans-serif", fontWeight: 600, color: '#6b7280' }}>
                    QTY
                  </Typography>
                </Grid>
                <Grid item xs={3}>
                  <Typography sx={{ fontFamily: "'Play', sans-serif", fontWeight: 600, color: '#6b7280' }}>
                    Subtotal
                  </Typography>
                </Grid>
                <Grid item xs={1}></Grid>
              </Grid>
            </Box>

            {/* Cart Items */}
            <Box sx={{ flex: 1, overflowY: 'auto', p: 2 }}>
              {cartItems.length === 0 ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100%' }}>
                  <Typography sx={{ color: '#9ca3af', fontFamily: "'Play', sans-serif" }}>
                    No items in cart
                  </Typography>
                </Box>
              ) : (
                cartItems.map((item) => (
                  <Grid container spacing={2} key={item.id} sx={{ mb: 2, alignItems: 'center' }}>
                    <Grid item xs={4}>
                      <Typography sx={{ fontFamily: "'Play', sans-serif", fontSize: '14px', color: '#374151' }}>
                        {item.name}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <Typography sx={{ fontFamily: "'Play', sans-serif", fontSize: '14px', color: '#6b7280' }}>
                        Rs {item.price.toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={2}>
                      <TextField
                        type="number"
                        value={item.quantity}
                        onChange={(e) => updateQuantity(item.id, parseInt(e.target.value) || 0)}
                        size="small"
                        sx={{
                          width: '60px',
                          '& .MuiOutlinedInput-root': {
                            fontFamily: "'Play', sans-serif",
                            '& input': {
                              textAlign: 'center',
                              padding: '4px',
                            },
                          },
                        }}
                      />
                    </Grid>
                    <Grid item xs={3}>
                      <Typography sx={{ fontFamily: "'Play', sans-serif", fontSize: '14px', color: '#374151', fontWeight: 500 }}>
                        Rs {(item.price * item.quantity).toFixed(2)}
                      </Typography>
                    </Grid>
                    <Grid item xs={1}>
                      <IconButton size="small" onClick={() => removeFromCart(item.id)} sx={{ color: '#ef4444' }}>
                        <DeleteIcon fontSize="small" />
                      </IconButton>
                    </Grid>
                  </Grid>
                ))
              )}
            </Box>

            {/* Totals */}
            <Box sx={{ p: 2, borderTop: '2px solid #e5e7eb' }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                <Typography sx={{ fontFamily: "'Play', sans-serif", color: '#6b7280' }}>Subtotal</Typography>
                <Typography sx={{ fontFamily: "'Play', sans-serif", color: '#374151', fontWeight: 500 }}>
                  Rs {calculateSubtotal().toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                <Typography sx={{ fontFamily: "'Play', sans-serif", color: '#6b7280' }}>Tax (%)</Typography>
                <TextField
                  type="number"
                  value={taxPercentage}
                  onChange={(e) => setTaxPercentage(parseFloat(e.target.value) || 0)}
                  size="small"
                  sx={{width: '100px',
                    '& .MuiOutlinedInput-root': {
                      fontFamily: "'Play', sans-serif",
                      '& input': {
                        textAlign: 'right',
                        padding: '6px 8px',
                      },
                    },
                  }}
                  InputProps={{
                    endAdornment: <InputAdornment position="end">%</InputAdornment>,
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1, alignItems: 'center' }}>
                <Typography sx={{ fontFamily: "'Play', sans-serif", color: '#6b7280' }}>Tax Amount</Typography>
                <Typography sx={{ fontFamily: "'Play', sans-serif", color: '#374151' }}>
                  Rs {calculateTax().toFixed(2)}
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2, alignItems: 'center' }}>
                <Typography sx={{ fontFamily: "'Play', sans-serif", color: '#ef4444' }}>Discount</Typography>
                <TextField
                  type="number"
                  value={discountAmount}
                  onChange={(e) => setDiscountAmount(parseFloat(e.target.value) || 0)}
                  size="small"
                  sx={{
                    width: '100px',
                    '& .MuiOutlinedInput-root': {
                      fontFamily: "'Play', sans-serif",
                      '& input': {
                        textAlign: 'right',
                        padding: '6px 8px',
                      },
                    },
                  }}
                  InputProps={{
                    startAdornment: <InputAdornment position="start">Rs</InputAdornment>,
                  }}
                />
              </Box>
              <Box sx={{ display: 'flex', justifyContent: 'space-between', pt: 2, borderTop: '1px solid #e5e7eb' }}>
                <Typography sx={{ fontFamily: "'Play', sans-serif", fontWeight: 700, fontSize: '18px', color: '#374151' }}>
                  Grand Total
                </Typography>
                <Typography sx={{ fontFamily: "'Play', sans-serif", fontWeight: 700, fontSize: '18px', color: '#374151' }}>
                  Rs {calculateGrandTotal().toFixed(2)}
                </Typography>
              </Box>
            </Box>
          </Paper>
        </Grid>

        {/* Right Side - Available Products */}
        <Grid item xs={12} md={7}>
          <Paper sx={{ borderRadius: '12px', p: 3, height: 'calc(100vh - 240px)', display: 'flex', flexDirection: 'column' }}>
            <Typography sx={{ fontFamily: "'Play', sans-serif", fontWeight: 600, fontSize: '18px', mb: 2 }}>
              Available Products
            </Typography>

            {/* Products Grid */}
            <Box sx={{ flex: 1, overflowY: 'auto' }}>
              <Grid container spacing={2}>
                {currentProducts.map((product) => (
                  <Grid item xs={6} sm={4} md={3} key={product.id}>
                    <Paper
                      sx={{
                        borderRadius: '12px',
                        overflow: 'hidden',
                        position: 'relative',
                        cursor: 'pointer',
                        transition: 'transform 0.2s',
                        '&:hover': {
                          transform: 'scale(1.02)',
                        },
                      }}
                    >
                      {/* Product Image */}
                      <Box
                        sx={{
                          width: '100%',
                          paddingTop: '100%',
                          bgcolor: '#1a1a2e',
                          backgroundImage: 'linear-gradient(to bottom, rgba(0,0,0,0.3), rgba(0,0,0,0.6))',
                          position: 'relative',
                        }}
                      />

                      {/* Product Info */}
                      <Box sx={{ p: 1.5 }}>
                        <Typography sx={{ fontFamily: "'Play', sans-serif", fontSize: '13px', fontWeight: 500, color: '#374151', mb: 0.5 }}>
                          {product.name}
                        </Typography>
                        <Typography sx={{ fontFamily: "'Play', sans-serif", fontSize: '11px', color: '#9ca3af', mb: 0.5 }}>
                          {product.id}
                        </Typography>
                        <Typography sx={{ fontFamily: "'Play', sans-serif", fontSize: '11px', color: '#6b7280', mb: 1 }}>
                          {product.stock} Pcs
                        </Typography>

                        {/* Price and Add Button */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                          <Typography sx={{ fontFamily: "'Play', sans-serif", fontSize: '14px', fontWeight: 600, color: '#ff8c42' }}>
                            Rs {product.price.toFixed(2)}
                          </Typography>
                          <IconButton
                            size="small"
                            onClick={() => addToCart(product)}
                            sx={{
                              bgcolor: '#ff8c42',
                              color: 'white',
                              width: 28,
                              height: 28,
                              '&:hover': {
                                bgcolor: '#ff7a2e',
                              },
                            }}
                          >
                            <AddIcon fontSize="small" />
                          </IconButton>
                        </Box>
                      </Box>
                    </Paper>
                  </Grid>
                ))}
              </Grid>
            </Box>

            {/* Pagination */}
            <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', mt: 1, gap: 1 }}>
              <IconButton
                disabled={page === 1}
                onClick={() => handlePageChange(page - 1)}
                sx={{
                  color: '#6b7280',
                  '&.Mui-disabled': {
                    color: '#d1d5db',
                  },
                }}
              >
                ‹
              </IconButton>

              {[...Array(Math.min(3, totalPages))].map((_, index) => {
                const pageNum = index + 1;
                return (
                  <IconButton
                    key={pageNum}
                    onClick={() => handlePageChange(pageNum)}
                    sx={{
                      width: 30,
                      height: 30,
                      borderRadius: '50%',
                      bgcolor: page === pageNum ? '#ff8c42' : 'transparent',
                      color: page === pageNum ? 'white' : '#6b7280',
                      fontFamily: "'Play', sans-serif",
                      fontSize: '12px',
                      fontWeight: 500,
                      '&:hover': {
                        bgcolor: page === pageNum ? '#ff7a2e' : '#f3f4f6',
                      },
                    }}
                  >
                    {pageNum}
                  </IconButton>
                );
              })}

              <IconButton
                disabled={page === totalPages}
                onClick={() => handlePageChange(page + 1)}
                sx={{
                  color: '#6b7280',
                  '&.Mui-disabled': {
                    color: '#d1d5db',
                  },
                }}
              >
                ›
              </IconButton>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      {/* Fixed Bottom Bar */}
      <Box
        sx={{
          position: 'fixed',
          bottom: 0,
          left: 0,
          right: 0,
          bgcolor: 'white',
          borderTop: '1px solid #e5e7eb',
          p: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          boxShadow: '0 -2px 10px rgba(0,0,0,0.05)',
          zIndex: 1000,
        }}
      >
        {/* Left Side - Home and Reset Buttons */}
        <Box sx={{ display: 'flex', gap: 2 }}>
          <Button
            variant="outlined"
            onClick={handleHome}
            sx={{
              borderColor: '#d1d5db',
              color: '#6b7280',
              textTransform: 'none',
              fontFamily: "'Play', sans-serif",
              px: 4,
              py: 1,
              borderRadius: '8px',
              fontSize: '14px',
              '&:hover': {
                borderColor: '#9ca3af',
                bgcolor: '#f9fafb',
              },
            }}
          >
            Home
          </Button>
          <Button
            variant="outlined"
            onClick={handleReset}
            sx={{
              borderColor: '#d1d5db',
              color: '#6b7280',
              textTransform: 'none',
              fontFamily: "'Play', sans-serif",
              px: 4,
              py: 1,
              borderRadius: '8px',
              fontSize: '14px',
              '&:hover': {
                borderColor: '#9ca3af',
                bgcolor: '#f9fafb',
              },
            }}
          >
            Reset
          </Button>
        </Box>

        {/* Right Side - Total Payable and Pay Now Button */}
        <Box sx={{ display: 'flex', alignItems: 'center', gap: 3 }}>
          <Box sx={{ textAlign: 'right' }}>
            <Typography
              sx={{
                fontSize: '14px',
                color: '#9ca3af',
                fontFamily: "'Play', sans-serif",
                mb: 0.5,
              }}
            >
              Total Payable
            </Typography>
            <Typography
              sx={{
                fontSize: '28px',
                fontWeight: 700,
                color: '#ff8c42',
                fontFamily: "'Play', sans-serif",
                lineHeight: 1,
              }}
            >
              {calculateGrandTotal().toFixed(2)}
            </Typography>
          </Box>
          <Button
            variant="contained"
            sx={{
              bgcolor: '#ff8c42',
              color: 'white',
              textTransform: 'none',
              fontFamily: "'Play', sans-serif",
              px: 5,
              py: 1.5,
              borderRadius: '8px',
              fontSize: '16px',
              fontWeight: 600,
              '&:hover': {
                bgcolor: '#ff7a2e',
              },
            }}
          >
            Pay Now
          </Button>
        </Box>
      </Box>
    </Box>
  );
}
