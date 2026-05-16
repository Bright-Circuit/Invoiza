'use client';

import React, { useState } from 'react';
import {
  Box,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
  Card,
  CardContent,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  Legend,
} from 'recharts';

const ItemReportPage = () => {
  const [timeframe, setTimeframe] = useState('daily');

  // Sample data for Item Chart
  const itemChartData = [
    { day: 'Mon', revenue: 9000 },
    { day: 'Tue', revenue: 15000 },
    { day: 'Wed', revenue: 12000 },
    { day: 'Thu', revenue: 16000 },
    { day: 'Fri', revenue: 14000 },
    { day: 'Sat', revenue: 16500 },
    { day: 'Sun', revenue: 13000 },
  ];

  //  (Stacked Bar Chart)
  const itemProductData = [
    { name: 'Item 1', 'Result A': 30, 'Result B': 40, 'Result C': 30 },
    { name: 'Item 2', 'Result A': 20, 'Result B': 50, 'Result C': 30 },
    { name: 'Item 3', 'Result A': 40, 'Result B': 35, 'Result C': 25 },
    { name: 'Item 4', 'Result A': 35, 'Result B': 45, 'Result C': 20 },
    { name: 'Item 5', 'Result A': 30, 'Result B': 40, 'Result C': 30 },
  ];

  // Sample data for Item Category
  const itemCategoryData = [
    {
      name: 'SALES',
      value: 45,
      fill: '#1a365d',
      subCategories: [
        { name: 'North', value: 30, fill: '#ef4444' },
        { name: 'Center', value: 15, fill: '#06b6d4' },
        { name: 'South', value: 10, fill: '#ef4444' },
      ],
    },
  ];

  // Sample data for Sales Details Table
  const salesDetails = [
    { productName: 'Sarees', category: 'sarees', unitPrice: 'Rs. 5500', unitsSold: 32, totalRevenue: 'Rs. 17,500' },
    { productName: 'Jaket', category: 'jaket', unitPrice: 'Rs. 2000', unitsSold: 30, totalRevenue: 'Rs. 90,000' },
    { productName: 'Blouse', category: 'blouse', unitPrice: 'Rs. 1950', unitsSold: 10, totalRevenue: 'Rs. 1950.00' },
  ];

  // Metric Card Component
  const MetricCard = ({ title, value, subtitle, icon, trend }) => (
    <Card sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
      <CardContent sx={{ p: 2.5 }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 1.5 }}>
          <Typography variant="caption" sx={{ fontWeight: 500, color: '#6b7280', textTransform: 'uppercase', fontFamily: "'Play', sans-serif" }}>
            {title}
          </Typography>
          <Box sx={{ fontSize: 20 }}>{icon}</Box>
        </Box>
        <Typography sx={{ fontSize: 24, fontWeight: 700, color: '#1f2937', fontFamily: "'Play', sans-serif", mb: 0.5 }}>
          {value}
        </Typography>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <Typography variant="caption" sx={{ color: '#9ca3af', fontFamily: "'Play', sans-serif" }}>
            {subtitle}
          </Typography>
          {trend && <Typography sx={{ color: '#22c55e', fontSize: 14, fontWeight: 'bold' }}>{trend}</Typography>}
        </Box>
      </CardContent>
    </Card>
  );

  return (
    <Box sx={{ p: 0 }}>
      {/* Header Section */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, color: '#1f2937', fontFamily: "'Play', sans-serif" }}>
          Item Report
        </Typography>
        <Box sx={{ display: 'flex', gap: 1 }}>
          {['Daily', 'Week', 'Month'].map((label, idx) => {
            const key = label.toLowerCase();
            return (
              <Button
                key={key}
                onClick={() => setTimeframe(key)}
                sx={{
                  px: 2,
                  py: 1,
                  backgroundColor: timeframe === key ? '#f97316' : '#fff',
                  color: timeframe === key ? '#fff' : '#6b7280',
                  border: '1px solid #e5e7eb',
                  borderRadius: '6px',
                  fontSize: '14px',
                  fontWeight: 500,
                  textTransform: 'none',
                  cursor: 'pointer',
                  transition: 'all 0.3s ease',
                  fontFamily: "'Play', sans-serif",
                  '&:hover': {
                    backgroundColor: '#f97316',
                    color: '#fff',
                    borderColor: '#f97316',
                  },
                }}
              >
                {label}
              </Button>
            );
          })}
        </Box>
      </Box>

      {/* Metrics Grid */}
      <Grid container spacing={2} sx={{ mb: 4 }}>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Total Revenue" value="Rs. 1,285,000" subtitle="This Week" icon="💵" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Item Sold" value="562" subtitle="This Week" icon="📊" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Total Orders" value="156" subtitle="This Week" icon="🛒" />
        </Grid>
        <Grid item xs={12} sm={6} md={3}>
          <MetricCard title="Item Value" value="2560" subtitle="This Week" icon="📈" trend="↑" />
        </Grid>
      </Grid>

      {/* Item Chart */}
      <Paper sx={{ p: 3, borderRadius: 2, mb: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937', mb: 2, fontFamily: "'Play', sans-serif" }}>
          Item Chart
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={itemChartData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="day" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
            <Line type="monotone" dataKey="revenue" stroke="#06b6d4" strokeWidth={2} dot={{ fill: '#06b6d4', r: 4 }} />
          </LineChart>
        </ResponsiveContainer>
      </Paper>

      {/* Item Category - Hierarchical Flow */}
      <Paper sx={{ p: 3, borderRadius: 2, mb: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937', mb: 3, fontFamily: "'Play', sans-serif" }}>
          Item Category
        </Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', gap: 3, py: 4 }}>
          {itemCategoryData.map((item, idx) => (
            <Box key={idx} sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '100%', maxWidth: 500 }}>
              {/* Main Category Button */}
              <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', mb: 1.5 }}>
                <Button
                  sx={{
                    px: 5,
                    py: 2,
                    backgroundColor: item.fill,
                    color: '#fff',
                    fontSize: 16,
                    fontWeight: 700,
                    borderRadius: 1,
                    minWidth: 200,
                    textTransform: 'none',
                    fontFamily: "'Play', sans-serif",
                    '&:hover': { backgroundColor: item.fill, opacity: 0.9 },
                  }}
                >
                  {item.name}
                </Button>
                <Typography sx={{ fontSize: 20, color: '#1a365d', mt: 1, fontWeight: 'bold' }}>
                  ▼
                </Typography>
              </Box>

              {/* Divider Line */}
              <Box sx={{ width: '100%', height: 2, backgroundColor: '#1a365d', my: 3 }} />

              {/* Sub Categories */}
              <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 1, flexWrap: 'wrap' }}>
                {item.subCategories.map((subCat, subIdx) => (
                  <React.Fragment key={subIdx}>
                    <Button
                      sx={{
                        px: 3.5,
                        py: 1.75,
                        backgroundColor: subCat.fill,
                        color: '#fff',
                        fontSize: 14,
                        fontWeight: 600,
                        borderRadius: 1,
                        minWidth: 140,
                        textTransform: 'none',
                        fontFamily: "'Play', sans-serif",
                        '&:hover': { backgroundColor: subCat.fill, opacity: 0.9 },
                      }}
                    >
                      {subCat.name}
                    </Button>
                    {subIdx < item.subCategories.length - 1 && (
                      <Typography sx={{ fontSize: 24, color: '#1a365d', fontWeight: 'bold' }}>
                        ›
                      </Typography>
                    )}
                  </React.Fragment>
                ))}
              </Box>
            </Box>
          ))}
        </Box>
      </Paper>

      {/* Item Product Chart */}
      <Paper sx={{ p: 3, borderRadius: 2, mb: 4, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
        <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937', mb: 2, fontFamily: "'Play', sans-serif" }}>
          Item Product
        </Typography>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={itemProductData}>
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" stroke="#666" />
            <YAxis stroke="#666" />
            <Tooltip />
            <Legend />
            <Bar dataKey="Result A" stackId="a" fill="#f97316" />
            <Bar dataKey="Result B" stackId="a" fill="#f3f4f6" />
            <Bar dataKey="Result C" stackId="a" fill="#22c55e" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* Sales Details Table */}
      <Paper sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)', overflow: 'hidden' }}>
        <Box sx={{ p: 3 }}>
          <Typography variant="h6" sx={{ fontWeight: 600, color: '#1f2937', fontFamily: "'Play', sans-serif" }}>
            Sales Details
          </Typography>
        </Box>
        <TableContainer>
          <Table>
            <TableHead>
              <TableRow sx={{ backgroundColor: '#f9fafb', borderBottom: '2px solid #e5e7eb' }}>
                <TableCell sx={{ fontWeight: 600, color: '#1f2937', fontSize: 13, fontFamily: "'Play', sans-serif" }}>
                  Product Name
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1f2937', fontSize: 13, fontFamily: "'Play', sans-serif" }}>
                  Category
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1f2937', fontSize: 13, fontFamily: "'Play', sans-serif" }}>
                  Unit Price
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1f2937', fontSize: 13, fontFamily: "'Play', sans-serif" }}>
                  Units Sold
                </TableCell>
                <TableCell sx={{ fontWeight: 600, color: '#1f2937', fontSize: 13, fontFamily: "'Play', sans-serif" }}>
                  Total Revenue
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {salesDetails.map((item, idx) => (
                <TableRow key={idx} sx={{ borderBottom: '1px solid #e5e7eb', '&:hover': { backgroundColor: '#f9fafb' } }}>
                  <TableCell sx={{ color: '#4b5563', fontSize: 14, fontFamily: "'Play', sans-serif" }}>
                    {item.productName}
                  </TableCell>
                  <TableCell sx={{ color: '#4b5563', fontSize: 14, fontFamily: "'Play', sans-serif" }}>
                    {item.category}
                  </TableCell>
                  <TableCell sx={{ color: '#4b5563', fontSize: 14, fontFamily: "'Play', sans-serif" }}>
                    {item.unitPrice}
                  </TableCell>
                  <TableCell sx={{ color: '#4b5563', fontSize: 14, fontFamily: "'Play', sans-serif" }}>
                    {item.unitsSold}
                  </TableCell>
                  <TableCell sx={{ color: '#4b5563', fontSize: 14, fontFamily: "'Play', sans-serif" }}>
                    {item.totalRevenue}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
};

export default ItemReportPage;