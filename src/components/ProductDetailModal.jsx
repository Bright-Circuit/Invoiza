'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  Dialog,
  DialogContent,
  Box,
  Typography,
  IconButton,
  Rating,
  Button,
  Card,
  useMediaQuery,
  useTheme,
  Divider,
} from '@mui/material';
import {
  Close as CloseIcon,
  LocalShipping as DeliveryIcon,
  Security as SecurityIcon,
  AssignmentReturn as ReturnIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
} from '@mui/icons-material';
import { useStore } from '../store/useStore';

export default function ProductDetailModal({ open, onClose, product }) {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('sm'));
  const isTablet = useMediaQuery(theme.breakpoints.down('md'));
  const { addToCart, wishlist, addToWishlist, removeFromWishlist, showSnackbar } = useStore();

  const [selectedColor, setSelectedColor] = useState(product?.colors?.[0] || 'Red');
  const [selectedSize, setSelectedSize] = useState(product?.sizes?.[0] || 'M');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);

  if (!product) return null;

  const isInWishlist = wishlist?.some((item) => item.id === product.id);

  const handleWishlistToggle = () => {
    if (isInWishlist) {
      removeFromWishlist(product.id);
      showSnackbar('Removed from wishlist', 'info');
    } else {
      addToWishlist(product);
      showSnackbar('Added to wishlist', 'success');
    }
  };

  const handleQuantityChange = (change) => {
    const newQuantity = quantity + change;
    if (newQuantity >= 1 && newQuantity <= 180) {
      setQuantity(newQuantity);
    }
  };

  const handleAddToCart = () => {
    const productWithOptions = {
      ...product,
      selectedColor,
      selectedSize,
      quantity,
    };
    addToCart(productWithOptions);
    showSnackbar('Added to cart', 'success');
    onClose();
  };

  const handleViewDetails = () => {
    router.push(`/products/${product.id}`);
    onClose();
  };

  // Mock images for the product (in real app, these would come from product data)
  const productImages = [
    product.image,
    product.image,
    product.image,
    product.image,
  ];

  return (
    <Dialog
      open={open}
      onClose={onClose}
      maxWidth="xl"
      fullWidth
      fullScreen={isMobile}
      PaperProps={{
        sx: {
          borderRadius: isMobile ? '16px' : '24px',
          maxWidth: '1250px',
          maxHeight: '90vh',
          bgcolor: 'white',
          boxShadow: '0 8px 32px rgba(0,0,0,0.12)',
          m: { xs: 2, sm: 2.5, md: 3 },
          width: { xs: 'calc(100% - 32px)', sm: '100%' },
        },
      }}
      sx={{
        '& .MuiBackdrop-root': {
          backgroundColor: 'rgba(0, 0, 0, 0.5)',
        },
      }}
    >
      <DialogContent sx={{ p: 0, position: 'relative', overflow: 'auto' }}>
        <IconButton
          onClick={onClose}
          sx={{
            position: 'absolute',
            right: { xs: 12, sm: 16 },
            top: { xs: 12, sm: 16 },
            zIndex: 10,
            bgcolor: 'white',
            width: { xs: 36, sm: 40 },
            height: { xs: 36, sm: 40 },
            boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
            '&:hover': { 
              bgcolor: 'grey.100',
              boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
            },
          }}
        >
          <CloseIcon sx={{ fontSize: { xs: 20, sm: 20 } }} />
        </IconButton>

        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', lg: 'row' },
            minHeight: { xs: 'auto', lg: 'auto' },
          }}
        >
          {/* Left Side - Product Images */}
          <Box
            sx={{
              flex: { xs: '1', lg: '0 0 32%' },
              p: { xs: 2, sm: 2.5, md: 3 },
              pr: { xs: 2, sm: 1, md: 1 },
              bgcolor: 'white',
              display: 'flex',
              flexDirection: { xs: 'column', sm: 'column', md: 'row', lg: 'row' },
              gap: { xs: 1.5, sm: 2 },
              alignItems: 'flex-start',
            }}
          >
            {/* Thumbnail Images */}
            <Box
              sx={{
                display: { xs: 'flex', sm: 'flex', md: 'flex' },
                flexDirection: { xs: 'row', sm: 'row', md: 'column', lg: 'column' },
                gap: { xs: 1, sm: 1.5 },
                flexShrink: 0,
                justifyContent: { xs: 'flex-start', md: 'space-between', lg: 'space-between' },
                overflowX: { xs: 'auto', sm: 'auto', md: 'visible', lg: 'visible' },
                width: { xs: '100%', sm: '100%', md: 'auto', lg: 'auto' },
                order: { xs: 2, sm: 2, md: 1, lg: 1 },
              }}
            >
              {productImages.map((img, index) => (
                <Box
                  key={index}
                  onClick={() => setMainImage(index)}
                  sx={{
                    width: { xs: 70, sm: 80, md: 90 },
                    height: { xs: 70, sm: 80, md: 90 },
                    borderRadius: '12px',
                    bgcolor: '#F5F5F5',
                    cursor: 'pointer',
                    border: mainImage === index ? '2px solid #000' : '2px solid transparent',
                    overflow: 'hidden',
                    transition: 'all 0.2s ease',
                    flexShrink: 0,
                    '&:hover': {
                      border: '2px solid #999',
                    },
                  }}
                >
                  <img
                    src={img}
                    alt={`${product.name} thumbnail ${index + 1}`}
                    style={{
                      width: '100%',
                      height: '100%',
                      objectFit: 'cover',
                    }}
                  />
                </Box>
              ))}
            </Box>

            {/* Main Image */}
            <Box
              sx={{
                width: { xs: '100%', sm: '100%', md: 'calc(100% - 106px)', lg: '360px' },
                height: { xs: '280px', sm: '350px', md: '426px' },
                borderRadius: '16px',
                bgcolor: '#F5F5F5',
                overflow: 'hidden',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
                order: { xs: 1, sm: 1, md: 2, lg: 2 },
              }}
            >
              <img
                src={productImages[mainImage]}
                alt={product.name}
                style={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Box>

          {/* Middle Section - Product Details */}
          <Box
            sx={{
              flex: { xs: '1', lg: '0 0 32%' },
              p: { xs: 2, sm: 2.5, md: 3 },
              pl: { xs: 2, sm: 2, md: 2 },
              pr: { xs: 2, sm: 2, md: 1 },
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 1.5, sm: 2 },
              bgcolor: 'white',
            }}
          >
            {/* Product Title & Rating */}
            <Box>
              <Typography
                variant="h5"
                sx={{
                  fontWeight: 700,
                  mb: 1.5,
                  fontSize: { xs: '1.2rem', sm: '1.2rem', md: '1.2rem' },
                  color: '#000',
                  letterSpacing: '-0.02em',
                }}
              >
                {product.name}
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
                <Rating 
                  value={product.rating || 4.8} 
                  precision={0.1} 
                  readOnly 
                  size="small"
                  sx={{ color: '#000' }}
                />
                <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
                  {product.rating || 4.8} | {product.reviews || 128} reviews | {product.sold || 100} Sold
                </Typography>
              </Box>
            </Box>

            {/* Product Description */}
            <Typography 
              variant="body2" 
              sx={{ 
                color: '#343333ff', 
                lineHeight: 1.7,
                fontSize: '0.875rem',
              }}
            >
              {product.description || 'New Women\'s Sneakers Breathable Mesh Casual Shoes for Women Comfortable Soft Sole Walking Shoes Fashion Shallow Mouth Flat Shoes'}
            </Typography>

            {/* Price */}
            <Box sx={{ my: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.2rem', sm: '1.4rem' },
                    color: '#000',
                    letterSpacing: '-0.02em',
                  }}
                >
                  LKR {product.price?.toFixed(2)}
                </Typography>
                {product.originalPrice && product.originalPrice > product.price && (
                  <Typography
                    variant="h6"
                    sx={{
                      color: '#999',
                      textDecoration: 'line-through',
                      fontSize: { xs: '0.75rem', sm: '0.8rem' },
                      fontWeight: 400,
                    }}
                  >
                    LKR {product.originalPrice?.toFixed(2)}
                  </Typography>
                )}
              </Box>
            </Box>

            <Divider sx={{ my: 0 }} />

            {/* Color Selection */}
            <Box>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  fontSize: '1rem',
                  color: '#000',
                }}
              >
                Color : {selectedColor}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {(product.colors || ['Red', 'Blue', 'Green', 'Yellow', 'Black']).map((color) => (
                  <Box
                    key={color}
                    onClick={() => setSelectedColor(color)}
                    sx={{
                      width: { xs: 40, sm: 64 },
                      height: { xs: 40, sm: 64 },
                      borderRadius: '12px',
                      bgcolor: color.toLowerCase() === 'black' ? '#000' : 
                               color.toLowerCase() === 'white' ? '#fff' :
                               color.toLowerCase() === 'red' ? '#E53E3E' :
                               color.toLowerCase() === 'blue' ? '#3182CE' :
                               color.toLowerCase() === 'green' ? '#38A169' :
                               color.toLowerCase() === 'yellow' ? '#ECC94B' :
                               color.toLowerCase() === 'brown' ? '#8B4513' :
                               '#D4D4D4',
                      cursor: 'pointer',
                      border: selectedColor === color ? '3px solid #000' : '1px solid #E5E5E5',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        transform: 'scale(1.05)',
                        boxShadow: '0 4px 12px rgba(0,0,0,0.15)',
                      },
                    }}
                  />
                ))}
              </Box>
            </Box>

            {/* Size Selection */}
            <Box>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 700, 
                  mb: 2,
                  fontSize: '1rem',
                  color: '#000',
                }}
              >
                Size : {selectedSize}
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, flexWrap: 'wrap' }}>
                {(product.sizes || ['S', 'M', 'L', 'XL', 'XXL']).map((size) => (
                  <Button
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    variant={selectedSize === size ? 'contained' : 'outlined'}
                    sx={{
                      minWidth: { xs: 40, sm: 45 },
                      height: { xs: 40, sm: 45 },
                      borderRadius: '10px',
                      padding: '10px 10px',
                      fontWeight: 500,
                      fontSize: '0.875rem',
                      color: selectedSize === size ? 'white' : '#000',
                      bgcolor: selectedSize === size ? '#000' : 'transparent',
                      borderColor: selectedSize === size ? '#000' : '#E5E5E5',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        bgcolor: selectedSize === size ? '#333' : '#F5F5F5',
                        borderColor: '#000',
                        transform: 'scale(1.05)',
                      },
                    }}
                  >
                    {size}
                  </Button>
                ))}
              </Box>
              <Divider sx={{ mt: 4 }} />
            </Box>

          </Box>

          {/* Right Sidebar - Service Commitment, Quantity & Actions */}
          <Box
            sx={{
              flex: { xs: '1', lg: '0 0 25%' },
              p: { xs: 2, sm: 2.5, md: 3 },
              pr: { xs: 2, sm: 2.5, md: 3 },
              bgcolor: 'white',
              display: 'flex',
              flexDirection: 'column',
              my: { xs: 0, sm: 0, lg: 3 },
              mr: { xs: 0, lg: 3 },
              ml: { xs: 0, lg: 0 },
              mt: { xs: 0, lg: 3 },
              mb: { xs: 2, lg: 3 },
              mx: { xs: 2, lg: 0 },
              gap: 0,
              border: { xs: '1px solid #E8E8E8', lg: '1px solid #E8E8E8' },
              borderRadius: '20px',
              height: 'fit-content',
            }}
          >
            {/* Service Commitment */}
            <Box sx={{ mb: { xs: 2, md: 3 } }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 700, 
                  fontSize: { xs: '0.95rem', md: '1rem' },
                  color: '#000',
                  mb: { xs: 1.5, md: 2.5 },
                }}
              >
                Service Commitment
              </Typography>
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: { xs: 1.5, md: 2.5 } }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: { xs: 1, md: 1.5 } }}>
                  <DeliveryIcon sx={{ fontSize: { xs: 20, md: 24 }, color: '#FF8C42' }} />
                  <Typography 
                    variant="body2" 
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: '#000',
                    }}
                  >
                    Delivery Charges: LKR 300.00
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <ReturnIcon sx={{ fontSize: 24, color: '#FF8C42' }} />
                  <Typography 
                    variant="body2"
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: '#000',
                    }}
                  >
                    Return&refund policy
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <SecurityIcon sx={{ fontSize: 24, color: '#FF8C42' }} />
                  <Typography 
                    variant="body2"
                    sx={{ 
                      fontWeight: 600,
                      fontSize: '0.875rem',
                      color: '#000',
                    }}
                  >
                    Security & Privacy
                  </Typography>
                </Box>
              </Box>
            </Box>

            <Divider sx={{ my: { xs: 1.5, md: 2.5 } }} />

            {/* Quantity */}
            <Box sx={{ mb: { xs: 2, md: 3 } }}>
              <Typography 
                variant="subtitle1" 
                sx={{ 
                  fontWeight: 700, 
                  mb: { xs: 1.5, md: 2 },
                  fontSize: { xs: '1rem', md: '1.125rem' },
                  color: '#000',
                }}
              >
                Quantity
              </Typography>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1.5 }}>
                <Button
                  onClick={() => handleQuantityChange(-1)}
                  disabled={quantity <= 1}
                  sx={{
                    minWidth: 30,
                    width: 30,
                    height: 30,
                    p: 0,
                    bgcolor: 'background.bgcolor',
                    border: '1px solid #E5E5E5',
                    borderRadius: '50%',
                    color: '#000',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    '&:hover': { bgcolor: '#F5F5F5', border: '1px solid #E5E5E5' },
                    '&:disabled': { color: '#D4D4D4' },
                  }}
                >
                  -
                </Button>
                <Typography
                  sx={{
                    px: 2,
                    fontWeight: 600,
                    minWidth: 40,
                    textAlign: 'center',
                    fontSize: '1rem',
                    color: '#000',
                  }}
                >
                  {quantity}
                </Typography>
                <Button
                  onClick={() => handleQuantityChange(1)}
                  disabled={quantity >= 180}
                  sx={{
                    minWidth: 30,
                    width: 30,
                    height: 30,
                    p: 0,
                    bgcolor: 'background.bgcolor',
                    border: '1px solid #E5E5E5',
                    borderRadius: '50%',
                    color: '#000',
                    fontWeight: 700,
                    fontSize: '1.25rem',
                    '&:hover': { bgcolor: '#F5F5F5', border: '1px solid #E5E5E5' },
                    '&:disabled': { color: '#D4D4D4' },
                  }}
                >
                  +
                </Button>
              </Box>
              <Typography variant="body2" sx={{ color: '#666', fontSize: '0.875rem' }}>
                180 available
              </Typography>
            </Box>

            {/* Action Buttons */}
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
              <Button
                variant="contained"
                onClick={handleAddToCart}
                fullWidth
                sx={{
                  bgcolor: '#000',
                  color: 'white',
                  py: 1.2,
                  fontWeight: 600,
                  fontSize: '0.875rem',
                  borderRadius: '8px',
                  textTransform: 'none',
                  boxShadow: 'none',
                  '&:hover': {
                    bgcolor: '#1a1a1a',
                    boxShadow: 'none',
                  },
                }}
              >
                Add to Cart
              </Button>
              <Box sx={{ display: 'flex', gap: 1.5, alignItems: 'center' }}>
                <Button
                  variant="outlined"
                  onClick={handleViewDetails}
                  sx={{
                    flex: 1,
                    borderColor: '#E8E8E8',
                    bgcolor: '#F9F9F9',
                    color: '#000',
                    py: 1.2,
                    fontWeight: 600,
                    fontSize: '0.875rem',
                    borderRadius: '8px',
                    textTransform: 'none',
                    '&:hover': {
                      borderColor: '#E8E8E8',
                      bgcolor: '#F0F0F0',
                    },
                  }}
                >
                  View Details
                </Button>
                <Box sx={{ position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
                  <IconButton
                    onClick={handleWishlistToggle}
                    sx={{
                      border: '1px solid #E8E8E8',
                      bgcolor: '#F9F9F9',
                      borderRadius: '8px',
                      fontSize: '0.875rem',
                      fontweight: 600,
                      py: 1.2,
                      gap: 1,
                    //   width: 58,
                    //   height: 58,
                    color: '#000',
                      '&:hover': {
                        bgcolor: '#F0F0F0',
                        border: '1px solid #E8E8E8',
                      },
                    }}
                  > 120
                    {isInWishlist ? (
                      <FavoriteIcon sx={{ color: '#ff8c42', fontSize: 22 }} />
                    ) : (
                      <FavoriteBorderIcon sx={{ fontSize: 22 }} />
                    )}
                  </IconButton>
                </Box>
              </Box>
            </Box>
          </Box>
        </Box>
      </DialogContent>
    </Dialog>
  );
}
