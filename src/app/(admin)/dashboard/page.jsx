'use client';

import {
  Box,
  Grid,
  Card,
  CardContent,
  Typography,
  Paper,
} from '@mui/material';
import {
  Description,
  Receipt,
  Storefront,
  TrendingUp,
} from '@mui/icons-material';
import {
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from 'recharts';

// Colors from muiTheme
const PRIMARY = '#7161EF';
const SUCCESS = '#47B073';
const ERROR = '#D54D6C';
const BACKGROUND = '#fafafa';

const invoiceStatisticsData = [
  { day: 'MON', value: 2400 },
  { day: 'TUE', value: 1398 },
  { day: 'WED', value: 9800 },
  { day: 'THU', value: 3908 },
  { day: 'FRI', value: 4800 },
  { day: 'SAT', value: 3800 },
  { day: 'SUN', value: 4300 },
];

const paymentData = [
  { name: 'Completed Payments', value: 70 },
  { name: 'Pending Payments', value: 30 },
];

const PAYMENT_COLORS = [SUCCESS, ERROR];

const StatCard = ({ title, value, percentage, icon, bgColor }) => (
  <Card
    sx={{
      borderRadius: 2,
      boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
      height: '100%',
      transition: 'transform 0.2s, box-shadow 0.2s',
      '&:hover': {
        transform: 'translateY(-4px)',
        boxShadow: '0px 4px 12px rgba(0,0,0,0.15)',
      },
    }}
  >
    <CardContent>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
        <Box>
          <Typography
            sx={{
              fontSize: '15px',
              color: 'text.primary',
              fontWeight: 500,
              mb: 1,
            }}
          >
            {title}
          </Typography>
          <Typography
            sx={{
              fontSize: '28px',
              fontWeight: 700,
              color: '#1f2937',
              mb: 1,
            }}
          >
            {value}
          </Typography>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
            <TrendingUp sx={{ fontSize: '16px', color: bgColor }} />
            <Typography
              sx={{
                fontSize: '12px',
                color: bgColor,
                fontWeight: 600,
              }}
            >
              {percentage}%
            </Typography>
            <Typography
              sx={{
                fontSize: '12px',
                color: '##666666',
              }}
            >
              Increase from last month
            </Typography>
          </Box>
        </Box>
        <Box
          sx={{
            width: 48,
            height: 48,
            borderRadius: '50%',
            bgcolor: `${bgColor}20`,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            color: bgColor,
          }}
        >
          {icon}
        </Box>
      </Box>
    </CardContent>
  </Card>
);

export default function DashboardPage() {
  return (
    <Box sx={{ width: '100%' }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography
          variant="h4"
          sx={{
            fontWeight: 700,
            color: '#1f2937',
            mb: 1,
          }}
        >
          Dashboard
        </Typography>
        <Typography
          sx={{
            fontSize: '15px',
            color: '#6b7280',
          }}
        >
          Welcome back ! here what's happen today
        </Typography>
      </Box>

      {/* Stat Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Projects"
            value="1025"
            percentage="16.5"
            icon={<Description />}
            bgColor={PRIMARY}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Invoices"
            value="1252"
            percentage="8.5"
            icon={<Receipt />}
            bgColor={PRIMARY}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Clients"
            value="2150"
            percentage="20.5"
            icon={<Storefront />}
            bgColor={ERROR}
          />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <StatCard
            title="Total Payments"
            value="12500.00"
            percentage="20.5"
            icon={<TrendingUp />}
            bgColor={SUCCESS}
          />
        </Grid>
      </Grid>

      {/* Charts Section */}
      <Grid container spacing={3}>
        {/* Invoice Statistics */}
        <Grid item xs={12} md={8}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
            }}
          >
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#1f2937',
                mb: 0.5,
              }}
            >
              Invoice Statistics
            </Typography>
            <Typography
              sx={{
                fontSize: '13px',
                color: '#9ca3af',
                mb: 2,
              }}
            >
              Daily invoice overview
            </Typography>
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={invoiceStatisticsData}>
                <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" vertical={false} />
                <XAxis dataKey="day" stroke="#9ca3af" />
                <YAxis stroke="#9ca3af" />
                <Tooltip
                  contentStyle={{
                    backgroundColor: '#fff',
                    border: '1px solid #e5e7eb',
                    borderRadius: '6px',
                  }}
                />
                <Bar dataKey="value" fill={PRIMARY} radius={[6, 6, 0, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>

        {/* Payments Pie Chart */}
        <Grid item xs={12} md={4}>
          <Paper
            sx={{
              p: 3,
              borderRadius: 2,
              boxShadow: '0px 1px 3px rgba(0,0,0,0.1)',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
            }}
          >
            <Typography
              sx={{
                fontSize: '18px',
                fontWeight: 700,
                color: '#1f2937',
                mb: 0.5,
                alignSelf: 'flex-start',
              }}
            >
              Payments
            </Typography>
            <Typography
              sx={{
                fontSize: '13px',
                color: '#9ca3af',
                mb: 2,
                alignSelf: 'flex-start',
              }}
            >
              Payment status breakdown
            </Typography>
            <ResponsiveContainer width="100%" height={250}>
              <PieChart>
                <Pie
                  data={paymentData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={90}
                  paddingAngle={0}
                  dataKey="value"
                >
                  {paymentData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={PAYMENT_COLORS[index]} />
                  ))}
                </Pie>
              </PieChart>
            </ResponsiveContainer>
            <Box sx={{ mt: 2, textAlign: 'center' }}>
              <Typography
                sx={{
                  fontSize: '32px',
                  fontWeight: 700,
                  color: PRIMARY,
                  mb: 1,
                }}
              >
                70%
              </Typography>
              <Box sx={{ display: 'flex', gap: 2, justifyContent: 'center', justifyItems: 'center' }}>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: SUCCESS,
                    }}
                  />
                  <Typography sx={{ fontSize: '12px', color: '#6b7280' }}>
                    Completed Payments
                  </Typography>
                </Box>
                <Box sx={{ display: 'flex', alignItems: 'center', gap: 0.5 }}>
                  <Box
                    sx={{
                      width: 8,
                      height: 8,
                      borderRadius: '50%',
                      bgcolor: ERROR,
                    }}
                  />
                  <Typography sx={{ fontSize: '12px', color: '#6b7280' }}>
                    Pending Payments
                  </Typography>
                </Box>
              </Box>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Box>
  );
}