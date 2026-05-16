'use client';

import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Card from '../../../components/common/Card';
import { useCustomer } from '../../../hooks/useCustomer';

export default function CustomerDashboardPage() {
  const { dashboard, isLoadingDashboard } = useCustomer();

  const stats = dashboard || {
    totalOrders: 0,
    pendingOrders: 0,
    completedOrders: 0,
    wishlistCount: 0,
  };

  return (
    <>
      <Typography variant="h4" gutterBottom>
        My Dashboard
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Typography variant="h6" color="text.secondary">
              Total Orders
            </Typography>
            <Typography variant="h3" sx={{ mt: 2 }}>
              {stats.totalOrders}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Typography variant="h6" color="text.secondary">
              Pending Orders
            </Typography>
            <Typography variant="h3" sx={{ mt: 2 }}>
              {stats.pendingOrders}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Typography variant="h6" color="text.secondary">
              Completed Orders
            </Typography>
            <Typography variant="h3" sx={{ mt: 2 }}>
              {stats.completedOrders}
            </Typography>
          </Card>
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <Card>
            <Typography variant="h6" color="text.secondary">
              Wishlist Items
            </Typography>
            <Typography variant="h3" sx={{ mt: 2 }}>
              {stats.wishlistCount}
            </Typography>
          </Card>
        </Grid>
      </Grid>
    </>
  );
}
