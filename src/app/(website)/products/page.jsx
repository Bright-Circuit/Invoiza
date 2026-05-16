'use client';

import { useState } from 'react';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import Pagination from '@mui/material/Pagination';
import Card from '../../../components/common/Card';
import Button from '../../../components/common/Button';
import Loader from '../../../components/common/Loader';
import { useProducts } from '../../../hooks/useProducts';

export default function ProductsPage() {
  const [page, setPage] = useState(1);
  const [category, setCategory] = useState('all');
  const [sortBy, setSortBy] = useState('newest');

  const { getAllProducts, isLoadingProducts } = useProducts();

  if (isLoadingProducts) {
    return <Loader fullScreen text="Loading products..." />;
  }

  const products = getAllProducts?.data || [];
  return (
    <Container maxWidth="xl">
      <Typography variant="h2" gutterBottom>
        Our Products
      </Typography>

      {/* Filters */}
      <Box sx={{ mb: 4 }}>
        <Grid container spacing={2}>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              fullWidth
              label="Category"
              value={category}
              onChange={(e) => setCategory(e.target.value)}
            >
              <MenuItem value="all">All Categories</MenuItem>
              <MenuItem value="men">Men</MenuItem>
              <MenuItem value="women">Women</MenuItem>
              <MenuItem value="accessories">Accessories</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12} sm={6} md={4}>
            <TextField
              select
              fullWidth
              label="Sort By"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value)}
            >
              <MenuItem value="newest">Newest</MenuItem>
              <MenuItem value="price-low">Price: Low to High</MenuItem>
              <MenuItem value="price-high">Price: High to Low</MenuItem>
              <MenuItem value="popular">Most Popular</MenuItem>
            </TextField>
          </Grid>
        </Grid>
      </Box>

      {/* Products Grid */}
      <Grid container spacing={3}>
        {products?.items?.map((product) => (
          <Grid item xs={12} sm={6} md={4} lg={3} key={product.id}>
            <Card
              title={product.name}
              subtitle={`$${product.price}`}
              image={product.image || '/images/placeholder.webp'}
              imageHeight={250}
              actions={
                <Button fullWidth href={`/products/${product.id}`}>
                  View Details
                </Button>
              }
            />
          </Grid>
        ))}
      </Grid>

      {/* Pagination */}
      {products?.totalPages > 1 && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 4 }}>
          <Pagination
            count={products.totalPages}
            page={page}
            onChange={(e, value) => setPage(value)}
            color="primary"
          />
        </Box>
      )}
    </Container>
  );
}
