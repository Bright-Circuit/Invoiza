'use client';

import { useState, useEffect } from 'react';
import {
  Box,
  Container,
  Typography,
  Rating,
  Button,
  IconButton,
  Divider,
  Tabs,
  Tab,
  useMediaQuery,
  useTheme,
} from '@mui/material';
import {
  Add as AddIcon,
  Remove as RemoveIcon,
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  LocalShipping as DeliveryIcon,
  Security as SecurityIcon,
  AssignmentReturn as ReturnIcon,
} from '@mui/icons-material';
import { useStore } from '../../../../store/useStore';
import { products } from '../../../../data/products';
import Loader from '../../../../components/common/Loader';

export default function ProductDetailPage({ params }) {
  const { id } = params;
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  
  const { cart, addToCart, wishlist, addToWishlist, removeFromWishlist, showSnackbar } = useStore();

  // Get product from data
  const [product, setProduct] = useState(null);

  useEffect(() => {
    const foundProduct = products.find(p => p.id === parseInt(id));
    if (foundProduct) {
      setProduct(foundProduct);
    }
  }, [id]);

  const [selectedColor, setSelectedColor] = useState('');
  const [selectedSize, setSelectedSize] = useState('');
  const [quantity, setQuantity] = useState(1);
  const [mainImage, setMainImage] = useState(0);
  const [activeTab, setActiveTab] = useState(0);

  useEffect(() => {
    if (product) {
      setSelectedColor(product?.colors?.[0] || 'Red');
      setSelectedSize(product?.sizes?.[0] || 'M');
    }
  }, [product]);

  const isInWishlist = wishlist?.some((item) => item.id === product?.id);

  // Mock images - use product image for all thumbnails
  const productImages = [
    product?.image || '/images/placeholder.webp',
    product?.image || '/images/placeholder.webp',
    product?.image || '/images/placeholder.webp',
    product?.image || '/images/placeholder.webp',
  ];

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
  };

  const handleBuyNow = () => {
    handleAddToCart();
    // Navigate to cart or checkout
    window.location.href = '/cart';
  };

  if (!product) {
    return <Loader fullScreen text="Loading product..." />;
  }

  return (
    <Box sx={{ bgcolor: 'white', minHeight: '100vh', py: { xs: 2, md: 4 } }}>
      <Container maxWidth="xl" sx={{ px: { xs: 1, sm: 2, md: 4, lg: 6 } }}>
        {/* Main Product Section */}
        <Box
          sx={{
            display: 'flex',
            flexDirection: { xs: 'column', md: 'row' },
            gap: { xs: 2, md: 3 },
            bgcolor: 'white',
            p: { xs: 1.5, sm: 2, md: 0 },
            mb: 3,
          }}
        >
          {/* Left Side - Images */}
          <Box
            sx={{
              width: { xs: '100%', md: '36%' },
              display: 'flex',
              flexDirection: { xs: 'column', md: 'row' },
              gap: { xs: 1.5, md: 2 },
            }}
          >
            {/* Thumbnails - Mobile Horizontal, Desktop Vertical */}
            <Box
              sx={{
                display: 'flex',
                flexDirection: { xs: 'row', md: 'column' },
                gap: { xs: 1, md: 1.5 },
                order: { xs: 2, md: 1 },
                overflowX: { xs: 'auto', md: 'visible' },
                '&::-webkit-scrollbar': { display: 'none' },
              }}
            >
              {productImages.map((img, index) => (
                <Box
                  key={index}
                  onClick={() => setMainImage(index)}
                  sx={{
                    width: { xs: 60, sm: 70, md: 75 },
                    height: { xs: 60, sm: 70, md: 75 },
                    flexShrink: 0,
                    borderRadius: '8px',
                    overflow: 'hidden',
                    cursor: 'pointer',
                    border: mainImage === index ? '2px solid #000' : '1px solid #E0E0E0',
                    transition: 'all 0.3s ease',
                    '&:hover': {
                      border: '2px solid #000',
                    },
                  }}
                >
                  <Box
                    component="img"
                    src={img}
                    alt={`Product ${index + 1}`}
                    sx={{
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
                flex: 1,
                height: { xs: 280, sm: 350, md: 480 },
                borderRadius: '12px',
                overflow: 'hidden',
                bgcolor: '#F9F9F9',
                order: { xs: 1, md: 2 },
                position: 'relative',
              }}
            >
              <Box
                component="img"
                src={productImages[mainImage]}
                alt={product.name}
                sx={{
                  width: '100%',
                  height: '100%',
                  objectFit: 'cover',
                }}
              />
            </Box>
          </Box>

          {/* Middle - Product Details */}
          <Box
            sx={{
              width: { xs: '100%', md: '34%' },
              display: 'flex',
              flexDirection: 'column',
              gap: { xs: 1.5, md: 2 },
              px: { xs: 0, md: 3 },
            }}
          >
            {/* Product Title */}
            <Typography
              variant="h5"
              sx={{
                fontWeight: 700,
                fontSize: { xs: '1.1rem', md: '1.25rem' },
                color: '#000',
                lineHeight: 1.3,
              }}
            >
              {product.name}
            </Typography>

            {/* Rating and Reviews */}
            <Box sx={{ display: 'flex', alignItems: 'center', gap: 1, flexWrap: 'wrap' }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                <Typography sx={{ fontSize: '1rem', color: '#000' }}>★</Typography>
                <Rating value={product.rating} readOnly size="small" sx={{ fontSize: '1rem', color: '#000' }} />
              </Box>
              <Typography sx={{ fontSize: '0.875rem', color: '#666' }}>
                {product.reviews?.toLocaleString()} reviews
              </Typography>
              <Divider orientation="vertical" flexItem sx={{ mx: 0.5 }} />
              <Typography sx={{ fontSize: '0.875rem', color: '#666' }}>
                {product.sold} Sold
              </Typography>
            </Box>

            {/* Description */}
            <Typography
              variant="body2"
              sx={{
                color: '#666',
                fontSize: { xs: '0.8125rem', md: '0.875rem' },
                lineHeight: 1.6,
              }}
            >
              {product.description}
            </Typography>

            {/* Price */}
            <Box sx={{ my: 0.5 }}>
              <Box sx={{ display: 'flex', alignItems: 'baseline', gap: 1.5 }}>
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    fontSize: { xs: '1.2rem', md: '1.5rem' },
                    color: '#000',
                  }}
                >
                  LKR {product.price?.toFixed(2)}
                </Typography>
                {product.originalPrice && product.originalPrice > product.price && (
                  <Typography
                    sx={{
                      color: '#999',
                      textDecoration: 'line-through',
                      fontSize: { xs: '0.8rem', md: '0.875rem' },
                    }}
                  >
                    LKR {product.originalPrice?.toFixed(2)}
                  </Typography>
                )}
              </Box>
            </Box>

            {/* Color Selection */}
            <Box>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  mb: 1.5,
                  color: '#000',
                }}
              >
                Color : {selectedColor}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {product?.colors?.map((color) => {
                  const colorMap = {
                    black: '#000000',
                    white: '#FFFFFF',
                    red: '#FF0000',
                    blue: '#0000FF',
                    green: '#00FF00',
                    yellow: '#FFFF00',
                    brown: '#8B4513',
                    gray: '#808080',
                    grey: '#808080',
                  };
                  const bgColor = colorMap[color.toLowerCase()] || '#D4D4D4';
                  
                  return (
                    <Box
                      key={color}
                      onClick={() => setSelectedColor(color)}
                      sx={{
                        width: { xs: 45, md: 50 },
                        height: { xs: 45, md: 50 },
                        borderRadius: '8px',
                        border: selectedColor === color ? '2px solid #000' : '1px solid #E0E0E0',
                        bgcolor: bgColor,
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        '&:hover': {
                          transform: 'scale(1.05)',
                        },
                      }}
                    />
                  );
                })}
              </Box>
            </Box>

            {/* Size Selection */}
            <Box>
              <Typography
                sx={{
                  fontSize: '0.875rem',
                  fontWeight: 600,
                  mb: 1.5,
                  color: '#000',
                }}
              >
                Size : {selectedSize}
              </Typography>
              <Box sx={{ display: 'flex', gap: 1.5, flexWrap: 'wrap' }}>
                {product.sizes?.map((size) => (
                  <Box
                    key={size}
                    onClick={() => setSelectedSize(size)}
                    sx={{
                      minWidth: { xs: 42, md: 48 },
                      height: { xs: 38, md: 42 },
                      px: 1.5,
                      borderRadius: '6px',
                      border: selectedSize === size ? '1.5px solid #000' : '1px solid #E0E0E0',
                      bgcolor: 'white',
                      color: '#000',
                      display: 'flex',
                      alignItems: 'center',
                      justifyContent: 'center',
                      cursor: 'pointer',
                      transition: 'all 0.2s ease',
                      '&:hover': {
                        border: '1.5px solid #000',
                      },
                    }}
                  >
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 500 }}>
                      {size}
                    </Typography>
                  </Box>
                ))}
              </Box>
            </Box>

            {/* Quantity - Mobile */}
            {isMobile && (
              <Box>
                <Typography
                  sx={{
                    fontSize: '0.875rem',
                    fontWeight: 600,
                    mb: 1.5,
                    color: '#000',
                  }}
                >
                  Quantity
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                  <IconButton
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    sx={{
                      width: 32,
                      height: 32,
                      border: '1px solid #E0E0E0',
                      borderRadius: '50%',
                      '&:hover': { bgcolor: '#F5F5F5' },
                      '&:disabled': { bgcolor: '#F9F9F9', color: '#CCC' },
                    }}
                  >
                    <RemoveIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                  <Typography
                    sx={{
                      minWidth: 40,
                      textAlign: 'center',
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: '#000',
                    }}
                  >
                    {quantity}
                  </Typography>
                  <IconButton
                    onClick={() => handleQuantityChange(1)}
                    sx={{
                      width: 32,
                      height: 32,
                      border: '1px solid #E0E0E0',
                      borderRadius: '50%',
                      '&:hover': { bgcolor: '#F5F5F5' },
                    }}
                  >
                    <AddIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                  <Typography sx={{ fontSize: '0.8125rem', color: '#666', ml: 1 }}>
                    180 available
                  </Typography>
                </Box>
              </Box>
            )}

            {/* Actions - Mobile */}
            {isMobile && (
              <Box
                sx={{
                  display: 'flex',
                  flexDirection: 'column',
                  gap: 1.5,
                  mt: 2,
                }}
              >
                <Box sx={{ display: 'flex', gap: 1.5 }}>
                  <Button
                    fullWidth
                    onClick={handleBuyNow}
                    sx={{
                      bgcolor: '#FF8C42',
                      color: 'white',
                      py: 1.3,
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                      textTransform: 'none',
                      boxShadow: 'none',
                      '&:hover': { bgcolor: '#FF7A29', boxShadow: 'none' },
                    }}
                  >
                    Buy Now
                  </Button>
                  <Button
                    fullWidth
                    onClick={handleAddToCart}
                    sx={{
                      bgcolor: 'white',
                      color: '#000',
                      border: '1px solid #E0E0E0',
                      py: 1.3,
                      borderRadius: '8px',
                      fontWeight: 600,
                      fontSize: '0.9375rem',
                      textTransform: 'none',
                      '&:hover': { bgcolor: '#F9F9F9', border: '1px solid #CCC' },
                    }}
                  >
                    Add to Cart
                  </Button>
                </Box>
              </Box>
            )}
          </Box>

          {/* Right Side - Service Commitment & Actions (Desktop) */}
          {!isMobile && (
            <Box
              sx={{
                width: '26%',
                display: 'flex',
                flexDirection: 'column',
                gap: 0,
                bgcolor: 'white',
                border: '1px solid #E8E8E8',
                borderRadius: '12px',
                p: 2.5,
                height: 'fit-content',
              }}
            >
              {/* Service Commitment */}
              <Box sx={{ mb: 2.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    mb: 2,
                    color: '#000',
                  }}
                >
                  Service Commitment
                </Typography>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <DeliveryIcon sx={{ fontSize: 22, color: '#FF8C42', flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#000' }}>
                      Delivery Charges: LKR 300.00
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <ReturnIcon sx={{ fontSize: 22, color: '#FF8C42', flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#000' }}>
                      Return&refund policy
                    </Typography>
                  </Box>
                  <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                    <SecurityIcon sx={{ fontSize: 22, color: '#FF8C42', flexShrink: 0 }} />
                    <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#000' }}>
                      Security & Privacy
                    </Typography>
                  </Box>
                </Box>
              </Box>

              <Divider sx={{ my: 2 }} />

              {/* Quantity */}
              <Box sx={{ mb: 2.5 }}>
                <Typography
                  sx={{
                    fontSize: '0.9375rem',
                    fontWeight: 700,
                    mb: 1.5,
                    color: '#000',
                  }}
                >
                  Quantity
                </Typography>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5, mb: 1 }}>
                  <IconButton
                    onClick={() => handleQuantityChange(-1)}
                    disabled={quantity <= 1}
                    sx={{
                      width: 32,
                      height: 32,
                      border: '1px solid #E0E0E0',
                      borderRadius: '50%',
                      '&:hover': { bgcolor: '#F5F5F5' },
                      '&:disabled': { bgcolor: '#F9F9F9', color: '#CCC' },
                    }}
                  >
                    <RemoveIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                  <Typography
                    sx={{
                      minWidth: 40,
                      textAlign: 'center',
                      fontWeight: 600,
                      fontSize: '1rem',
                      color: '#000',
                    }}
                  >
                    {quantity}
                  </Typography>
                  <IconButton
                    onClick={() => handleQuantityChange(1)}
                    sx={{
                      width: 32,
                      height: 32,
                      border: '1px solid #E0E0E0',
                      borderRadius: '50%',
                      '&:hover': { bgcolor: '#F5F5F5' },
                    }}
                  >
                    <AddIcon sx={{ fontSize: 18 }} />
                  </IconButton>
                </Box>
                <Typography sx={{ fontSize: '0.8125rem', color: '#666' }}>
                  180 available
                </Typography>
              </Box>

              {/* Action Buttons */}
              <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1.5 }}>
                <Button
                  fullWidth
                  onClick={handleBuyNow}
                  sx={{
                    bgcolor: '#FF8C42',
                    color: 'white',
                    py: 1.3,
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    textTransform: 'none',
                    boxShadow: 'none',
                    '&:hover': { bgcolor: '#FF7A29', boxShadow: 'none' },
                  }}
                >
                  Buy Now
                </Button>
                <Button
                  fullWidth
                  onClick={handleAddToCart}
                  sx={{
                    bgcolor: 'white',
                    color: '#000',
                    border: '1px solid #E0E0E0',
                    py: 1.3,
                    borderRadius: '8px',
                    fontWeight: 600,
                    fontSize: '0.9375rem',
                    textTransform: 'none',
                    '&:hover': { bgcolor: '#F9F9F9', border: '1px solid #CCC' },
                  }}
                >
                  Add to Cart
                </Button>
              </Box>
            </Box>
          )}
        </Box>

        {/* Service Commitment - Mobile */}
        {isMobile && (
          <Box
            sx={{
              bgcolor: 'white',
              border: '1px solid #E8E8E8',
              borderRadius: '12px',
              p: 2.5,
              mb: 3,
            }}
          >
            <Typography
              sx={{
                fontSize: '0.9375rem',
                fontWeight: 700,
                mb: 2,
                color: '#000',
              }}
            >
              Service Commitment
            </Typography>
            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <DeliveryIcon sx={{ fontSize: 22, color: '#FF8C42', flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#000' }}>
                  Delivery Charges: LKR 300.00
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <ReturnIcon sx={{ fontSize: 22, color: '#FF8C42', flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#000' }}>
                  Return&refund policy
                </Typography>
              </Box>
              <Box sx={{ display: 'flex', alignItems: 'center', gap: 1.5 }}>
                <SecurityIcon sx={{ fontSize: 22, color: '#FF8C42', flexShrink: 0 }} />
                <Typography sx={{ fontSize: '0.875rem', fontWeight: 600, color: '#000' }}>
                  Security & Privacy
                </Typography>
              </Box>
            </Box>
          </Box>
        )}

        {/* Tabs Section */}
        <Box
          sx={{
            bgcolor: 'white',
            border: '1px solid #E8E8E8',
            borderRadius: '12px',
            overflow: 'hidden',
          }}
        >
          <Tabs
            value={activeTab}
            onChange={(e, newValue) => setActiveTab(newValue)}
            sx={{
              borderBottom: '1px solid #E8E8E8',
              px: { xs: 2, md: 0 },
              minHeight: 48,
              '& .MuiTab-root': {
                textTransform: 'none',
                fontSize: { xs: '0.875rem', md: '0.9375rem' },
                fontWeight: 600,
                color: '#666',
                minHeight: 48,
                px: { xs: 2, md: 3 },
                '&.Mui-selected': {
                  color: '#000',
                },
              },
              '& .MuiTabs-indicator': {
                bgcolor: '#000',
                height: 2,
              },
            }}
          >
            <Tab label="Customer Reviews" />
            <Tab label="Specifications" />
            <Tab label="Description" />
          </Tabs>

          <Box sx={{ p: { xs: 2, md: 3 }, minHeight: 120 }}>
            {activeTab === 0 && (
              <Box>
                <Typography sx={{ color: '#666', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  Customer reviews will be displayed here...
                </Typography>
              </Box>
            )}
            {activeTab === 1 && (
              <Box>
                <Typography sx={{ color: '#666', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  Product specifications will be displayed here...
                </Typography>
              </Box>
            )}
            {activeTab === 2 && (
              <Box>
                <Typography sx={{ color: '#666', fontSize: '0.875rem', lineHeight: 1.6 }}>
                  {product.description}
                </Typography>
              </Box>
            )}
          </Box>
        </Box>
      </Container>
    </Box>
  );
}
