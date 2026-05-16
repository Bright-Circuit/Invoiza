'use client';

import { useState, useEffect } from 'react';
import { useSearchParams, useRouter } from 'next/navigation';
import {
  Box,
  Container,
  Grid,
  Typography,
  Card,
  CardMedia,
  CardContent,
  CardActions,
  IconButton,
  Chip,
  Rating,
  Button,
  Drawer,
  Slider,
  FormGroup,
  FormControlLabel,
  Checkbox,
  RadioGroup,
  Radio,
  Pagination,
  useMediaQuery,
  useTheme,
  MenuItem,
  Select,
  FormControl,
  TextField,
  InputAdornment,
} from '@mui/material';
import {
  FavoriteBorder as FavoriteIcon,
  Favorite as FavoriteFilledIcon,
  FilterList as FilterIcon,
  GridView as GridIcon,
  ViewList as ListIcon,
  Search as SearchIcon,
  RemoveRedEye as EyeIcon,
  ShoppingCart as ShoppingCartIcon,
} from '@mui/icons-material';
import { products, filterProducts } from '../../../data/products';
import { useStore } from '../../../store/useStore';
import ProductDetailModal from '../../../components/ProductDetailModal';

export default function ShopPage() {
  const router = useRouter();
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down('md'));
  const searchParams = useSearchParams();
  const { wishlist, addToWishlist, removeFromWishlist, addToCart, showSnackbar } = useStore();

  const [filteredProducts, setFilteredProducts] = useState(products);
  const [filterDrawerOpen, setFilterDrawerOpen] = useState(false);
  const [viewMode, setViewMode] = useState('grid');
  const [page, setPage] = useState(1);
  const itemsPerPage = 12;
  const [productModalOpen, setProductModalOpen] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [hoveredProduct, setHoveredProduct] = useState(null);

  // Filter states
  const [priceRange, setPriceRange] = useState([0, 10000]);
  const [selectedColors, setSelectedColors] = useState([]);
  const [selectedSizes, setSelectedSizes] = useState([]);
  const [selectedCategories, setSelectedCategories] = useState([]);
  const [inStockOnly, setInStockOnly] = useState(false);
  const [sortBy, setSortBy] = useState('popularity');
  const [searchQuery, setSearchQuery] = useState('');

  const colors = [
    { name: 'Black', value: 'black', count: 14 },
    { name: 'Brown', value: 'brown', count: 13 },
    { name: 'Red', value: 'red', count: 13 },
    { name: 'White', value: 'white', count: 13 },
    { name: 'Yellow', value: 'yellow', count: 13 },
  ];

  const sizes = [
    { name: 'S', count: 14 },
    { name: 'M', count: 14 },
    { name: 'L', count: 14 },
    { name: 'XL', count: 14 },
    { name: '2XL', count: 14 },
    { name: '3XL', count: 14 },
  ];

  const categories = [
    { name: 'Hoodie', value: 'hoodie', count: 11 },
    { name: 'Kids', value: 'kids', count: 4 },
    { name: 'Long-Sleeves', value: 'long-sleeves', count: 0 },
    { name: 'Product Designer', value: 'product-designer', count: 2 },
    { name: 'Sweater', value: 'sweater', count: 2 },
    { name: 'T-Shirt', value: 't-shirt', count: 5 },
  ];

  useEffect(() => {
    const category = searchParams.get('category');
    if (category) {
      setSelectedCategories([category]);
    }
  }, [searchParams]);

  useEffect(() => {
    const filters = {
      minPrice: priceRange[0],
      maxPrice: priceRange[1],
      colors: selectedColors,
      sizes: selectedSizes,
      category: selectedCategories[0],
      inStock: inStockOnly,
      sortBy,
    };

    const filtered = filterProducts(filters);
    setFilteredProducts(filtered);
    setPage(1);
  }, [priceRange, selectedColors, selectedSizes, selectedCategories, inStockOnly, sortBy]);

  const handleColorChange = (color) => {
    setSelectedColors((prev) =>
      prev.includes(color) ? prev.filter((c) => c !== color) : [...prev, color]
    );
  };

  const handleSizeChange = (size) => {
    setSelectedSizes((prev) =>
      prev.includes(size) ? prev.filter((s) => s !== size) : [...prev, size]
    );
  };

  const handleCategoryChange = (category) => {
    setSelectedCategories([category]);
  };

  const isInWishlist = (productId) => {
    return wishlist?.some((item) => item.id === productId);
  };

  const handleWishlistToggle = (product) => {
    if (isInWishlist(product.id)) {
      removeFromWishlist(product.id);
      showSnackbar('Removed from wishlist', 'info');
    } else {
      addToWishlist(product);
      showSnackbar('Added to wishlist', 'success');
    }
  };

  const handleAddToCart = (product) => {
    setSelectedProduct(product);
    setProductModalOpen(true);
  };

  const handleCloseModal = () => {
    setProductModalOpen(false);
    setSelectedProduct(null);
  };

  const paginatedProducts = filteredProducts.slice(
    (page - 1) * itemsPerPage,
    page * itemsPerPage
  );

  const FilterSidebar = () => (
    <Box sx={{ p: 3 }}>
      {/* Search */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
        Search
      </Typography>
      <Box sx={{ mb: 3 }}>
        <TextField
          fullWidth
          size="small"
          placeholder="Search products..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <IconButton size="small" edge="end">
                  <SearchIcon />
                </IconButton>
              </InputAdornment>
            ),
          }}
          sx={{
            '& .MuiOutlinedInput-root': {
              bgcolor: '#F9FAFB',
              '& fieldset': {
                borderColor: '#E5E7EB',
              },
              '&:hover fieldset': {
                borderColor: '#D1D5DB',
              },
              '&.Mui-focused fieldset': {
                borderColor: 'primary.main',
              },
            },
          }}
        />
      </Box>

      {/* Categories */}
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
        Product categories
      </Typography>
      <RadioGroup value={selectedCategories[0] || ''} onChange={(e) => handleCategoryChange(e.target.value)}>
        {categories.map((cat) => (
          <FormControlLabel
            key={cat.value}
            value={cat.value}
            control={<Radio size="small" />}
            label={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="body2">{cat.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {cat.count}
                </Typography>
              </Box>
            }
            sx={{ width: '100%', mb: 0.5 }}
          />
        ))}
      </RadioGroup>

      {/* Price Filter */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
        Filter by price
      </Typography>
      <Slider
        value={priceRange}
        onChange={(e, newValue) => setPriceRange(newValue)}
        valueLabelDisplay="auto"
        min={0}
        max={10000}
        sx={{ mb: 2, '& .MuiSlider-thumb': { color: 'primary.dark' }, '& .MuiSlider-track': { color: 'primary.dark', height: 4, borderRadius: 2, border: 'none' } }}
      />
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="body2">Price: LKR {priceRange[0]}</Typography>
        <Typography variant="body2">LKR {priceRange[1]}</Typography>
      </Box>
      <Button variant="contained" size="small" align="center" sx={{ mb: 3, padding: '5px 10px', backgroundColor: 'background.bgcolor', color: '#000', fontSize: '12px', fontWeight: 'bold', '&:hover': { color: '#fff' } }}>
        Filter
      </Button>

      {/* Color Filter */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
        Filter by Color
      </Typography>
      <FormGroup>
        {colors.map((color) => (
          <FormControlLabel
            key={color.value}
            control={
              <Checkbox
                checked={selectedColors.includes(color.value)}
                onChange={() => handleColorChange(color.value)}
                size="small"
              />
            }
            label={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
                  <Box
                    sx={{
                      width: 16,
                      height: 16,
                      borderRadius: '50%',
                      bgcolor: color.value,
                      border: '1px solid',
                      borderColor: 'divider',
                    }}
                  />
                  <Typography variant="body2">{color.name}</Typography>
                </Box>
                <Typography variant="body2" color="text.secondary">
                  {color.count}
                </Typography>
              </Box>
            }
            sx={{ width: '100%', mb: 0.5 }}
          />
        ))}
      </FormGroup>

      {/* Size Filter */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
        Filter by Size
      </Typography>
      <FormGroup>
        {sizes.map((size) => (
          <FormControlLabel
            key={size.name}
            control={
              <Checkbox
                checked={selectedSizes.includes(size.name)}
                onChange={() => handleSizeChange(size.name)}
                size="small"
              />
            }
            label={
              <Box sx={{ display: 'flex', justifyContent: 'space-between', width: '100%' }}>
                <Typography variant="body2">{size.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {size.count}
                </Typography>
              </Box>
            }
            sx={{ width: '100%', mb: 0.5 }}
          />
        ))}
      </FormGroup>

      {/* Stock Status */}
      <Typography variant="h6" sx={{ mt: 4, mb: 2, fontWeight: 600, fontSize: '1.1rem' }}>
        Stock status
      </Typography>
      <FormGroup>
        <FormControlLabel
          control={<Checkbox checked={inStockOnly} onChange={(e) => setInStockOnly(e.target.checked)} size="small" />}
          label="On sale"
        />
        <FormControlLabel control={<Checkbox size="small" />} label="In stock" />
      </FormGroup>
    </Box>
  );

  return (
    <Box sx={{ backgroundColor: "#fff" }}>
      {/* Hero Section */}
      <Box sx={{ 
        backgroundColor: "#F9FAFB", 
        py: { xs: 4, md: 6 },
        mb: 4
      }}>
        <Container maxWidth="xl">
          <Typography 
            variant="h3" 
            sx={{ 
              fontWeight: 700, 
              mb: 1.5, 
              textAlign: 'center',
              fontSize: { xs: '1.75rem', md: '2.2rem' }
            }}
          >
            Shop
          </Typography>
          <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', gap: 1 }}>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.secondary',
                fontSize: { xs: '0.875rem', md: '0.8rem' }
              }}
            >
              Home
            </Typography>
            <Typography variant="body1" sx={{ color: 'text.secondary' }}>→</Typography>
            <Typography 
              variant="body1" 
              sx={{ 
                color: 'text.primary',
                fontWeight: 600,
                fontSize: { xs: '0.875rem', md: '0.8rem' }
              }}
            >
              Shop
            </Typography>
          </Box>
        </Container>
      </Box>

      <Container maxWidth="xl" sx={{ pb: 4 }}>
        <Grid container spacing={3}>
        {/* Sidebar - Desktop */}
        {!isMobile && (
          <Grid item xs={12} md={3}>
            <Box sx={{ position: 'sticky', top: 80 }}>
              <FilterSidebar />
            </Box>
          </Grid>
        )}

        {/* Products */}
        <Grid item xs={12} md={9}>
          {/* Toolbar */}
          <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 3 }}>
            <Typography variant="body2" color="text.secondary">
              Showing {(page - 1) * itemsPerPage + 1}–{Math.min(page * itemsPerPage, filteredProducts.length)} of {filteredProducts.length} results
            </Typography>
            <Box sx={{ display: 'flex', gap: 2, alignItems: 'center' }}>
              <FormControl size="small" sx={{ minWidth: 150 }}>
                <Select value={sortBy} onChange={(e) => setSortBy(e.target.value)}>
                  <MenuItem value="popularity">Popularity</MenuItem>
                  <MenuItem value="rating">Average rating</MenuItem>
                  <MenuItem value="latest">Latest</MenuItem>
                  <MenuItem value="price-low">Price: low to high</MenuItem>
                  <MenuItem value="price-high">Price: high to low</MenuItem>
                </Select>
              </FormControl>
              {isMobile && (
                <IconButton onClick={() => setFilterDrawerOpen(true)}>
                  <FilterIcon />
                </IconButton>
              )}
              <Box sx={{ display: { xs: 'none', sm: 'flex' }, gap: 1 }}>
                <IconButton onClick={() => setViewMode('grid')} color={viewMode === 'grid' ? 'primary' : 'default'}>
                  <GridIcon />
                </IconButton>
                <IconButton onClick={() => setViewMode('list')} color={viewMode === 'list' ? 'primary' : 'default'}>
                  <ListIcon />
                </IconButton>
              </Box>
            </Box>
          </Box>

          {/* Product Grid */}
          <Grid container spacing={3}>
            {paginatedProducts.map((product) => {
              const isHovered = hoveredProduct === product.id;
              
              return (
                <Grid item xs={6} sm={4} md={3} key={product.id}>
                  <Card 
                    onMouseEnter={() => setHoveredProduct(product.id)}
                    onMouseLeave={() => setHoveredProduct(null)}
                    sx={{ 
                      position: 'relative', 
                      height: '100%', 
                      display: 'flex', 
                      flexDirection: 'column',
                      borderRadius: { xs: "10px", md: "15px" },
                      overflow: 'visible',
                      boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.25)',
                      transition: 'all 0.3s ease',
                      bgcolor: 'white',
                      '&:hover': {
                        boxShadow: '4px 4px 4px rgba(0, 0, 0, 0.25)',
                      },
                    }}
                  >
                    {/* Discount Badge */}
                    {product.discount > 0 && (
                      <Box
                        sx={{
                          position: 'absolute',
                          top: { xs: 8, md: 12 },
                          left: { xs: 8, md: 12 },
                          bgcolor: 'primary.main',
                          color: 'white',
                          fontWeight: 700,
                          fontSize: { xs: '0.5rem', md: '0.6rem' },
                          zIndex: 2,
                          px: { xs: 1, md: 1.5 },
                          py: { xs: 0.3, md: 0.5 },
                          borderRadius: 0.8,
                        }}
                      >
                        -{product.discount}%
                      </Box>
                    )}

                    {/* Eye Icon - Top Right */}
                    <IconButton
                      onClick={() => router.push(`/products/${product.id}`)}
                      sx={{
                        position: 'absolute',
                        top: { xs: 8, md: 12 },
                        right: { xs: 8, md: 12 },
                        bgcolor: 'white',
                        zIndex: 2,
                        width: { xs: 28, md: 35 },
                        height: { xs: 28, md: 35 },
                        boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
                        '&:hover': { 
                          bgcolor: 'white',
                        },
                      }}
                    >
                      <EyeIcon sx={{ fontSize: { xs: 14, md: 18 } }} />
                    </IconButton>

                    {/* Product Image */}
                    <Box sx={{ position: 'relative', paddingTop: '110%', overflow: 'hidden', borderRadius: { xs: '10px 10px 0 0', md: '16px 16px 0 0' } }}>
                      <CardMedia
                        component="img"
                        image={product.image}
                        alt={product.name}
                        sx={{ 
                          position: 'absolute',
                          top: 0,
                          left: 0,
                          borderRadius: { xs: '10px', md: '15px' },
                          width: '100%',
                          height: '100%',
                          objectFit: 'cover',
                          cursor: 'pointer',
                        }}
                        onClick={() => router.push(`/products/${product.id}`)}
                      />
                    </Box>

                    {/* Product Info */}
                    <CardContent sx={{ flexGrow: 1, py: { xs: 1.5, md: 2 }, px: { xs: 1, md: 1.2 }, pb: { xs: 1.5, md: 2.5 } }}>
                      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 0 }}>
                        <Typography 
                          variant="h6" 
                          sx={{ 
                            fontSize: { xs: '0.8rem', md: '1.05rem' },
                            fontWeight: 700,
                            color: 'text.primary',
                            flex: 1,
                            overflow: 'hidden',
                            textOverflow: 'ellipsis',
                            whiteSpace: 'nowrap',
                          }}
                        >
                          {product.name}
                        </Typography>

                        <IconButton
                          onClick={() => handleWishlistToggle(product)}
                          sx={{
                            p: { xs: 0.3, md: 0.5 },
                            ml: { xs: 0.5, md: 1 },
                            flexShrink: 0,
                            '&:hover': { 
                              bgcolor: 'transparent',
                            },
                          }}
                        >
                          {isInWishlist(product.id) ? (
                            <FavoriteFilledIcon sx={{ color: 'text.primary', fontSize: { xs: 18, md: 24 } }} />
                          ) : (
                            <FavoriteIcon sx={{ color: 'text.primary', fontSize: { xs: 18, md: 24 } }} />
                          )}
                        </IconButton>
                      </Box>

                      {/* Rating - Hide on Hover (Desktop only) */}
                      <Box sx={{ 
                        display: { xs: 'flex', md: isHovered ? 'none' : 'flex' },
                        alignItems: 'center', 
                        gap: { xs: 0.3, md: 0.5 }, 
                        mb: { xs: 0.3, md: 0.5 },
                      }}>
                        <Box component="span" sx={{ fontSize: { xs: '0.8rem', md: '1.125rem' }, fontWeight: 700, mr: { xs: 0.3, md: 0.5 } }}>★</Box>
                        <Typography variant="body2" sx={{ fontWeight: 600, fontSize: { xs: '0.65rem', md: '0.875rem' } }}>
                          {product.rating}
                        </Typography>
                        <Typography variant="body2" color="text.secondary" sx={{ fontSize: { xs: '0.65rem', md: '0.875rem' } }}>
                          |{product.reviews} reviews
                        </Typography>
                      </Box>

                      {/* Price - Hide on Hover (Desktop only) */}
                      <Box sx={{ 
                        display: { xs: 'flex', md: isHovered ? 'none' : 'flex' },
                        alignItems: 'center', 
                        gap: { xs: 0.5, md: 1 },
                        mb: { xs: 1, md: 0 },
                      }}>
                        <Typography variant="h5" sx={{ fontWeight: 700, fontSize: { xs: '0.7rem', md: '0.9rem' }, color: 'text.primary' }}>
                          LKR {product.price.toFixed(2)}
                        </Typography>
                        {product.originalPrice > product.price && (
                          <Typography
                            variant="body1"
                            sx={{ 
                              textDecoration: 'line-through', 
                              color: 'text.secondary',
                              fontSize: { xs: '0.65rem', md: '0.8rem' },
                            }}
                          >
                            LKR {product.originalPrice.toFixed(2)}
                          </Typography>
                        )}
                      </Box>

                      {/* Action Buttons - Always show on mobile, show on hover for desktop */}
                      <Box
                        sx={{
                          display: { xs: 'flex', md: isHovered ? 'flex' : 'none' },
                          gap: { xs: 0.5, md: 0.5 },
                          mt: { xs: 0.5, md: 1 },
                        }}
                      >
                        <Button
                          variant="contained"
                          fullWidth
                          onClick={() => handleAddToCart(product)}
                          disabled={!product.inStock}
                          startIcon={<ShoppingCartIcon sx={{ fontSize: { xs: 15, md: 20 } }} />}
                          sx={{
                            bgcolor: 'primary.main',
                            color: 'white',
                            py: { xs: 0.7, md: 1.2 },
                            fontSize: { xs: '0.6rem', md: '0.8rem' },
                            fontWeight: 700,
                            borderRadius: 1,
                            textTransform: 'none',
                            boxShadow: 'none',
                            '&:hover': {
                              bgcolor: '#FFF',
                              boxShadow: 'none',
                              border: '2px solid #ff7a2e',
                              color: '#ff7a2e',
                            },
                            '&:disabled': {
                              bgcolor: '#ccc',
                              color: 'white',
                            },
                          }}
                        >
                          {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                        </Button>
                      </Box>
                    </CardContent>
                  </Card>
                </Grid>
              );
            })}
          </Grid>

          {/* Pagination */}
          {filteredProducts.length > itemsPerPage && (
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
              <Pagination
                count={Math.ceil(filteredProducts.length / itemsPerPage)}
                page={page}
                onChange={(e, value) => setPage(value)}
                sx={{
                  '& .MuiPaginationItem-root': {
                    color: '#000',
                    '&.Mui-selected': {
                      bgcolor: '#000',
                      color: '#fff',
                      '&:hover': {
                        bgcolor: '#333',
                      },
                    },
                    '&:hover': {
                      bgcolor: 'rgba(0, 0, 0, 0.08)',
                    },
                  },
                }}
              />
            </Box>
          )}
        </Grid>
      </Grid>
      </Container>

      {/* Mobile Filter Drawer */}
      <Drawer anchor="left" open={filterDrawerOpen} onClose={() => setFilterDrawerOpen(false)}>
        <Box sx={{ width: 300 }}>
          <FilterSidebar />
        </Box>
      </Drawer>

      {/* Product Detail Modal */}
      <ProductDetailModal
        open={productModalOpen}
        onClose={handleCloseModal}
        product={selectedProduct}
      />
    </Box>
  );
}
