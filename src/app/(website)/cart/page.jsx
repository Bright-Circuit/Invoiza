'use client';

import { useState } from 'react';
import {
  Container,
  Box,
  Typography,
  Paper,
  Checkbox,
  IconButton,
  Button,
  Collapse,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Delete as DeleteIcon,
  Remove as RemoveIcon,
  Add as AddIcon,
  KeyboardArrowUp as KeyboardArrowUpIcon,
  KeyboardArrowDown as KeyboardArrowDownIcon,
} from '@mui/icons-material';
import { useStore } from '../../../store/useStore';

export default function CartPage() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('lg'));
  const { cart, cartCount, removeFromCart, updateCartItemQuantity, wishlist, addToWishlist, removeFromWishlist } = useStore();
  const [selectedItems, setSelectedItems] = useState(cart.map(item => item.id));
  const [summaryOpen, setSummaryOpen] = useState(false);

  const handleSelectAll = (event) => {
    if (event.target.checked) {
      setSelectedItems(cart.map(item => item.id));
    } else {
      setSelectedItems([]);
    }
  };

  const handleSelectItem = (itemId) => {
    setSelectedItems(prev => 
      prev.includes(itemId) 
        ? prev.filter(id => id !== itemId)
        : [...prev, itemId]
    );
  };

  const handleQuantityChange = (productId, newQuantity) => {
    if (newQuantity < 1) return;
    updateCartItemQuantity(productId, newQuantity);
  };

  const isInWishlist = (itemId) => wishlist?.some(item => item.id === itemId);

  const handleWishlistToggle = (item) => {
    if (isInWishlist(item.id)) {
      removeFromWishlist(item.id);
    } else {
      addToWishlist(item);
    }
  };

  // Calculate totals for selected items
  const selectedCartItems = cart.filter(item => selectedItems.includes(item.id));
  const itemsTotal = selectedCartItems.reduce((sum, item) => sum + item.price * item.quantity, 0);
  const originalTotal = selectedCartItems.reduce((sum, item) => sum + (item.originalPrice || item.price) * item.quantity, 0);
  const itemsDiscount = originalTotal - itemsTotal;
  const subtotal = itemsTotal;
  const delivery = 340;
  const total = subtotal + delivery;

  return (
    <Box sx={{ bgcolor: '#F7F7F7', minHeight: '100vh', py: 4 }}>
      <Container maxWidth="lg">
        {cart.length === 0 ? (
          <Paper sx={{ p: 4, textAlign: 'center', borderRadius: '12px' }}>
            <Typography variant="h6" gutterBottom sx={{ fontWeight: 600 }}>
              Your cart is empty
            </Typography>
            <Button 
              variant="contained" 
              href="/shop" 
              sx={{ 
                mt: 2,
                bgcolor: '#FF8C42',
                '&:hover': { bgcolor: '#FF7A29' },
                textTransform: 'none',
                px: 4,
                py: 1.5,
              }}
            >
              Continue Shopping
            </Button>
          </Paper>
        ) : (
          <Box sx={{ display: 'flex', gap: 3, flexDirection: { xs: 'column', lg: 'row' }, pb: { xs: 10, lg: 0 } }}>
            {/* Left Side - Cart Items */}
            <Box sx={{ flex: 1 }}>
              <Paper sx={{ p: { xs: 2, md: 3 }, borderRadius: '12px', bgcolor: 'white' }}>
                {/* Header */}
                <Typography variant="h5" sx={{ fontWeight: 700, mb: 3, fontSize: { xs: '1.25rem', md: '1.5rem' } }}>
                  Shopping Cart ({cartCount})
                </Typography>

                {/* Select All */}
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 3, pb: 2, borderBottom: '1px solid #F0F0F0' }}>
                  <Checkbox
                    checked={selectedItems.length === cart.length}
                    indeterminate={selectedItems.length > 0 && selectedItems.length < cart.length}
                    onChange={handleSelectAll}
                    sx={{
                      color: '#E0E0E0',
                      '&.Mui-checked': { color: '#000' },
                      '&.MuiCheckbox-indeterminate': { color: '#000' },
                    }}
                  />
                  <Typography sx={{ fontSize: '0.9375rem' }}>Select all items</Typography>
                </Box>

                {/* Cart Items */}
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2 } }}>
                  {cart.map((item) => (
                    <Box
                      key={item.id}
                      sx={{
                        display: 'flex',
                        gap: { xs: 1.5, md: 2 },
                        p: { xs: 1.5, md: 2 },
                        bgcolor: 'white',
                        borderRadius: { xs: '8px', md: '12px' },
                        border: '1px solid #F0F0F0',
                        position: 'relative',
                      }}
                    >
                      {/* Checkbox */}
                      <Box sx={{ display: 'flex', alignItems: 'flex-start', pt: { xs: 0.5, md: 0 } }}>
                        <Checkbox
                          checked={selectedItems.includes(item.id)}
                          onChange={() => handleSelectItem(item.id)}
                          sx={{
                            color: '#E0E0E0',
                            '&.Mui-checked': { color: '#000' },
                            p: 0,
                          }}
                        />
                      </Box>

                      {/* Product Image */}
                      <Box
                        component="img"
                        src={item.image || '/images/placeholder.webp'}
                        alt={item.name}
                        sx={{
                          width: { xs: 50, sm: 70, md: 100 },
                          height: { xs: 50, sm: 70, md: 100 },
                          borderRadius: { xs: '6px', md: '8px' },
                          objectFit: 'cover',
                          bgcolor: '#F5F5F5',
                          flexShrink: 0,
                        }}
                      />

                      {/* Product Details */}
                      <Box sx={{ flex: 1, minWidth: 0, display: 'flex', flexDirection: 'column' }}>
                        {/* Top Section: Title and Icons */}
                        <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 0.5 }}>
                          <Typography 
                            variant="subtitle1" 
                            sx={{ 
                              fontWeight: 600, 
                              fontSize: { xs: '0.7rem', sm:'0.875rem', md: '1rem' },
                              lineHeight: 1.3,
                              pr: 1,
                            }}
                          >
                            {item.name}
                          </Typography>
                          
                          {/* Wishlist & Delete - Desktop */}
                          <Box sx={{ display: { xs: 'none', md: 'flex' }, gap: 0.5, flexShrink: 0 }}>
                            <IconButton 
                              size="small"
                              onClick={() => handleWishlistToggle(item)}
                              sx={{ p: 0.5 }}
                            >
                              {isInWishlist(item.id) ? (
                                <FavoriteIcon sx={{ fontSize: 20, color: '#FF8C42' }} />
                              ) : (
                                <FavoriteBorderIcon sx={{ fontSize: 20 }} />
                              )}
                            </IconButton>
                            <IconButton 
                              size="small"
                              onClick={() => removeFromCart(item.id)}
                              sx={{ p: 0.5 }}
                            >
                              <DeleteIcon sx={{ fontSize: 20 }} />
                            </IconButton>
                          </Box>
                        </Box>
                        
                        {/* Description */}
                        <Typography 
                          variant="body2" 
                          sx={{ 
                            color: '#666', 
                            mb: 0.5,
                            fontSize: { xs: '0.7rem', md: '0.875rem' },
                            display: '-webkit-box',
                            WebkitLineClamp: 2,
                            WebkitBoxOrient: 'vertical',
                            overflow: 'hidden',
                            lineHeight: 1.4,
                          }}
                        >
                          {item.description || 'New Women\'s Sneakers Breathable Mesh Casual Shoes for Women Comfortable Soft Sole...'}
                        </Typography>

                        {/* Color/Size */}
                        <Typography 
                          variant="caption" 
                          sx={{ 
                            color: '#999', 
                            display: 'block',
                            mb: { xs: 1, md: 1.5 },
                            fontSize: { xs: '0.75rem', md: '0.8125rem' },
                          }}
                        >
                          {item.selectedColor || 'Red'}/{item.selectedSize || 'XL'}
                        </Typography>

                        {/* Bottom Section: Price and Quantity */}
                        <Box sx={{ 
                          display: 'flex', 
                          justifyContent: 'space-between', 
                          alignItems: 'center',
                          mt: '-0.7rem',
                        }}>
                          {/* Price */}
                          <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                            <Typography 
                              variant="h6" 
                              sx={{ 
                                fontWeight: 700,
                                fontSize: { xs: '0.7rem', md: '0.875rem' },
                              }}
                            >
                              LKR {item.price?.toFixed(2)}
                            </Typography>
                            {item.originalPrice && item.originalPrice > item.price && (
                              <Typography
                                variant="body2"
                                sx={{
                                  color: '#999',
                                  textDecoration: 'line-through',
                                  fontSize: { xs: '0.5rem', md: '0.8rem' },
                                }}
                              >
                                LKR {item.originalPrice?.toFixed(2)}
                              </Typography>
                            )}
                          </Box>

                          {/* Quantity Controls */}
                          <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 0.5, md: 0.75 } }}>
                            <IconButton
                              onClick={() => handleQuantityChange(item.id, item.quantity - 1)}
                              disabled={item.quantity <= 1}
                              sx={{
                                width: { xs: 25, md: 30 },
                                height: { xs: 25, md: 30 },
                                bgcolor: '#FF8C42',
                                color: 'white',
                                borderRadius: '50%',
                                p: 0,
                                '&:hover': { bgcolor: '#FF7A29' },
                                '&:disabled': { bgcolor: '#E8E8E8', color: '#999' },
                              }}
                            >
                              <RemoveIcon sx={{ fontSize: { xs: 14, md: 18 } }} />
                            </IconButton>
                            <Typography
                              sx={{
                                minWidth: { xs: 24, md: 30 },
                                textAlign: 'center',
                                fontWeight: 600,
                                fontSize: { xs: '0.8rem', md: '0.9375rem' },
                              }}
                            >
                              {item.quantity}
                            </Typography>
                            <IconButton
                              onClick={() => handleQuantityChange(item.id, item.quantity + 1)}
                              sx={{
                                width: { xs: 25, md: 30 },
                                height: { xs: 25, md: 30 },
                                bgcolor: '#FF8C42',
                                color: 'white',
                                borderRadius: '50%',
                                p: 0,
                                '&:hover': { bgcolor: '#FF7A29' },
                              }}
                            >
                              <AddIcon sx={{ fontSize: { xs: 14, md: 18 } }} />
                            </IconButton>
                          </Box>
                        </Box>
                      </Box>

                      {/* Wishlist & Delete - Mobile (Top Right) */}
                      <Box sx={{ 
                        display: { xs: 'flex', md: 'none' }, 
                        gap: 0.5, 
                        position: 'absolute',
                        top: 12,
                        right: 12,
                      }}>
                        <IconButton 
                          size="small"
                          onClick={() => handleWishlistToggle(item)}
                          sx={{ p: 0.5, bgcolor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                        >
                          {isInWishlist(item.id) ? (
                            <FavoriteIcon sx={{ fontSize: 18, color: '#FF8C42' }} />
                          ) : (
                            <FavoriteBorderIcon sx={{ fontSize: 18 }} />
                          )}
                        </IconButton>
                        <IconButton 
                          size="small"
                          onClick={() => removeFromCart(item.id)}
                          sx={{ p: 0.5, bgcolor: 'white', boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}
                        >
                          <DeleteIcon sx={{ fontSize: 18 }} />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Paper>
            </Box>

            {/* Right Side - Order Summary (Desktop) */}
            {!isMobile && (
              <Box sx={{ width: '360px', flexShrink: 0 }}>
                <Paper sx={{ p: 3, borderRadius: '12px', bgcolor: 'white', position: 'sticky', top: 100 }}>
                  <Typography variant="h6" sx={{ fontWeight: 700, mb: 3, fontSize: '1.25rem' }}>
                    Order Summary
                  </Typography>

                  <Box sx={{ mb: 3 }}>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography sx={{ fontSize: '0.9375rem' }}>Items Total</Typography>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>LKR {itemsTotal.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography sx={{ fontSize: '0.9375rem' }}>Items Discount</Typography>
                      <Typography sx={{ fontWeight: 600, color: '#FF8C42', fontSize: '0.9375rem' }}>-LKR {itemsDiscount.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                      <Typography sx={{ fontSize: '0.9375rem' }}>Subtotal</Typography>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>LKR {subtotal.toFixed(2)}</Typography>
                    </Box>
                    <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3 }}>
                      <Typography sx={{ fontSize: '0.9375rem' }}>Delivery</Typography>
                      <Typography sx={{ fontWeight: 600, fontSize: '0.9375rem' }}>LKR {delivery.toFixed(2)}</Typography>
                    </Box>

                    <Box 
                      sx={{ 
                        display: 'flex', 
                        justifyContent: 'space-between', 
                        pt: 2.5, 
                        borderTop: '1px solid #E8E8E8',
                      }}
                    >
                      <Typography sx={{ fontWeight: 700, fontSize: '1.125rem' }}>Total</Typography>
                      <Typography sx={{ fontWeight: 700, fontSize: '1.125rem' }}>LKR {total.toFixed(2)}</Typography>
                    </Box>
                  </Box>

                  <Button
                    variant="contained"
                    fullWidth
                    disabled={selectedItems.length === 0}
                    sx={{
                      bgcolor: '#FF8C42',
                      color: 'white',
                      py: 1.5,
                      fontSize: '1rem',
                      fontWeight: 600,
                      borderRadius: '8px',
                      textTransform: 'none',
                      boxShadow: 'none',
                      '&:hover': {
                        bgcolor: '#FF7A29',
                        boxShadow: 'none',
                      },
                      '&:disabled': {
                        bgcolor: '#E8E8E8',
                        color: '#999',
                      },
                    }}
                    href="/checkout"
                  >
                    Checkout ({selectedItems.length})
                  </Button>
                </Paper>
              </Box>
            )}
          </Box>
        )}

        {/* Mobile Bottom Summary */}
        {isMobile && cart.length > 0 && (
          <Box
            sx={{
              position: 'fixed',
              bottom: 65,
              left: 0,
              right: 0,
              zIndex: 999,
              bgcolor: 'white',
              borderTop: '1px solid #E8E8E8',
              boxShadow: '0 -4px 12px rgba(0,0,0,0.1)',
            }}
          >
            {/* Collapsible Order Summary */}
            <Collapse in={summaryOpen}>
              <Box sx={{ p: 2, maxHeight: '60vh', overflowY: 'auto' }}>
                <Box sx={{ mb: 2 }}>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.875rem' }}>Items Total</Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>LKR {itemsTotal.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.875rem' }}>Items Discount</Typography>
                    <Typography sx={{ fontWeight: 600, color: '#FF8C42', fontSize: '0.875rem' }}>-LKR {itemsDiscount.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1.5 }}>
                    <Typography sx={{ fontSize: '0.875rem' }}>Subtotal</Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>LKR {subtotal.toFixed(2)}</Typography>
                  </Box>
                  <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
                    <Typography sx={{ fontSize: '0.875rem' }}>Delivery</Typography>
                    <Typography sx={{ fontWeight: 600, fontSize: '0.875rem' }}>LKR {delivery.toFixed(2)}</Typography>
                  </Box>
                </Box>
              </Box>
            </Collapse>

            {/* Bottom Bar with Total and Checkout */}
            <Box sx={{ p: 2, display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flex: 1 }}>
                <Box>
                  <Typography sx={{ fontSize: '0.875rem', color: '#666', mb: 0.25 }}>
                    LKR {total.toFixed(2)}
                  </Typography>
                  <IconButton
                    size="small"
                    onClick={() => setSummaryOpen(!summaryOpen)}
                    sx={{ p: 0, color: '#666' }}
                  >
                    {summaryOpen ? <KeyboardArrowDownIcon sx={{ fontSize: 16 }} /> : <KeyboardArrowUpIcon sx={{ fontSize: 16 }} />}
                  </IconButton>
                </Box>
              </Box>

              <Button
                variant="contained"
                disabled={selectedItems.length === 0}
                sx={{
                  bgcolor: '#FF8C42',
                  color: 'white',
                  py: 1.25,
                  px: 4,
                  fontSize: '0.9375rem',
                  fontWeight: 600,
                  borderRadius: '8px',
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#FF7A29',
                    boxShadow: 'none',
                  },
                  '&:disabled': {
                    bgcolor: '#E8E8E8',
                    color: '#999',
                  },
                }}
                href="/checkout"
              >
                Checkout ({selectedItems.length})
              </Button>
            </Box>
          </Box>
        )}
      </Container>
    </Box>
  );
}