'use client';

import { useState, useMemo } from 'react';
import {
  Box,
  Typography,
  Paper,
  Grid,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Chip,
} from '@mui/material';
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  BarChart,
  Bar,
  PieChart,
  Pie,
  Cell,
} from 'recharts';
import {
  MonetizationOn,
  Inventory2,
  ShoppingCart,
  TrendingUp,
} from '@mui/icons-material';


const DATA = {
  daily: [
    { day: 'Mon', product: "Batik Shirt - Men's", category: 'Shirts', price: 4250, qty: 10 },
    { day: 'Tue', product: 'Cotton Saree', category: 'Sarees', price: 5600, qty: 8 },
    { day: 'Wed', product: 'Casual T-Shirt', category: 'T-Shirts', price: 2500, qty: 6 },
    { day: 'Thu', product: 'Denim Jeans', category: 'Trouser', price: 6500, qty: 5 },
    { day: 'Fri', product: 'Kids Frock', category: 'Kids Wear', price: 3200, qty: 7 },
  ],
  weekly: [
    { day: 'Mon', product: "Batik Shirt - Men's", category: 'Shirts', price: 4250, qty: 45 },
    { day: 'Tue', product: 'Cotton Saree', category: 'Sarees', price: 5600, qty: 50 },
    { day: 'Wed', product: 'Casual T-Shirt', category: 'T-Shirts', price: 2500, qty: 40 },
    { day: 'Thu', product: 'Denim Jeans', category: 'Trouser', price: 6500, qty: 30 },
    { day: 'Fri', product: 'Kids Frock', category: 'Kids Wear', price: 3200, qty: 28 },
    { day: 'Sat', product: 'Ladies Blouse', category: 'Blouses', price: 2800, qty: 35 },
    { day: 'Sun', product: 'Office Trouser', category: 'Trouser', price: 5200, qty: 27 },
  ],
  monthly: [
    { day: 'Week 1', product: "Batik Shirt - Men's", category: 'Shirts', price: 4250, qty: 120 },
    { day: 'Week 2', product: 'Cotton Saree', category: 'Sarees', price: 5600, qty: 110 },
    { day: 'Week 3', product: 'Denim Jeans', category: 'Trouser', price: 6500, qty: 95 },
    { day: 'Week 4', product: 'Kids Frock', category: 'Kids Wear', price: 3200, qty: 100 },
  ],
};

const COLORS = ['#FF69B4', '#845ec2', '#4d96ff', '#00c9a7', '#D70040'];

export default function SellerSalesReport() {
  const [filter, setFilter] = useState('weekly');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');

  const rows = DATA[filter];

  //CHECK RANGE
  const isRowInRange = (row, start, end) => {
    if (!start) return true; 
    const startObj = new Date(start);
    const endObj = end ? new Date(end) : startObj;
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

    if (filter === 'daily') {
      const rowDayIndex = dayNames.indexOf(row.day);
      const rangeDays = [];
      let current = new Date(startObj);
      while (current <= endObj) {
        rangeDays.push(dayNames[current.getDay()]);
        current.setDate(current.getDate() + 1);
      }
      return rangeDays.includes(row.day);
    } else if (filter === 'weekly') {
      return true;
    }
    else if (filter === 'monthly') {
      if (!selectedMonth) return true;
      return true;
    }

  };

  const filteredRows = useMemo(() => rows.filter((r) => isRowInRange(r, startDate, endDate)), [rows, startDate, endDate, filter]);

  //SUMMARY
  const summary = useMemo(() => {

    const revenue = filteredRows.reduce((s, i) => s + i.price * i.qty, 0);
    const units = filteredRows.reduce((s, i) => s + i.qty, 0);
    const orders = filteredRows.length;
    return { revenue, units, orders, avg: orders ? Math.round(revenue / orders) : 0 };
  }, [filteredRows]);

  //TOP SALES WEEK (MONTHLY ONLY)
  const topSalesWeek = useMemo(() => {
    if (filter !== 'monthly' || filteredRows.length === 0) return null;
    return filteredRows
      .map((r) => ({ day: r.day, revenue: r.price * r.qty, product: r.product }))
      .sort((a, b) => b.revenue - a.revenue)[0];
  }, [filteredRows, filter]);

  //TOP SALES DAY
  const topSalesDay = useMemo(() => {
    if (filteredRows.length === 0) return null;
    const dayMap = {};
    filteredRows.forEach((r) => {
      const revenue = r.price * r.qty;
      if (!dayMap[r.day]) dayMap[r.day] = { day: r.day, revenue: 0, product: r.product };
      dayMap[r.day].revenue += revenue;
      if (revenue > (dayMap[r.day].topRevenue || 0)) {
        dayMap[r.day].topRevenue = revenue;
        dayMap[r.day].product = r.product;
      }
    });
    return Object.values(dayMap).sort((a, b) => b.revenue - a.revenue)[0];
  }, [filteredRows]);

  //CHART DATA
  const trend = filteredRows.map((i) => ({ name: i.day, revenue: i.price * i.qty }));
  const categoryRevenue = Object.values(
    filteredRows.reduce((a, i) => {
      a[i.category] = a[i.category] || { name: i.category, value: 0 };
      a[i.category].value += i.price * i.qty;
      return a;
    }, {})
  );
  const productRevenue = filteredRows.map((i) => ({ name: i.product, revenue: i.price * i.qty }));
  const categoryColorMap = {};
  categoryRevenue.forEach((c, i) => { categoryColorMap[c.name] = COLORS[i % COLORS.length]; });

  const [selectedMonth, setSelectedMonth] = useState('');

  return (
    <Box>
      <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 3, alignItems: 'center' }}>
        <Typography variant="h5" sx={{ fontFamily: "'Play', sans-serif", fontWeight: 700 }}>
          Sales Report
        </Typography>

        <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
          {['daily', 'weekly', 'monthly'].map((f) => (
            <Button key={f} onClick={() => { setFilter(f); setStartDate(''); setEndDate('');setSelectedMonth(''); }}
              sx={{
                mr: 1, borderRadius: '10px',
                bgcolor: filter === f ? '#ff7a2e' : '#f3f3f3',
                color: filter === f ? '#fff' : '#333',
                fontWeight: 600, px: 3, py: 0.5, textTransform: 'none',
                fontFamily: "'Play', sans-serif",
                '&:hover': { bgcolor: '#ff7a2e', color: '#fff' },
              }}>{f.charAt(0).toUpperCase() + f.slice(1)}</Button>
          ))}

          {filter !== 'monthly' ? (
            <>
              <span>Select date range: </span>
              <input
                type="date"
                value={startDate}
                onChange={(e) => setStartDate(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
              <span> To </span>
              <input
                type="date"
                value={endDate}
                onChange={(e) => setEndDate(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </>
          ) : (
            <>
              <span>Select month: </span>
              <input
                type="month"
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(e.target.value)}
                style={{ padding: '6px 12px', borderRadius: '6px', border: '1px solid #ccc' }}
              />
            </>
          )}
        </Box>
      </Box>

       {/*SELECTED DATE RANGE DISPLAY*/}
      {filter === 'monthly' && selectedMonth && (
        <Typography sx={{ mb: 2, fontWeight: 500, fontFamily: "'Play', sans-serif" }}>
          Showing data for (
          {new Date(selectedMonth + '-01').toLocaleString('default', {
            month: 'long',
            year: 'numeric',
          })}
          )
        </Typography>
      )}

      {filter !== 'monthly' && (startDate || endDate) && (
        <Typography sx={{ mb: 2, fontWeight: 500, fontFamily: "'Play', sans-serif" }}>
          Showing data for (
          {startDate ? new Date(startDate).toDateString() : '-'}
          {endDate && ` to ${new Date(endDate).toDateString()}`}
          )
        </Typography>
      )}


      {/* SUMMARY */}
      <Grid container spacing={2} sx={{ mb: 3, borderRadius: 2 }}>
        {[{
          label: 'Total Revenue',
          value: `Rs. ${summary.revenue.toLocaleString()}`,
          icon: <MonetizationOn sx={{ fontSize: 34, color: '#ff7a2e' }} />,
        }, {
          label: 'Products Sold',
          value: summary.units,
          icon: <Inventory2 sx={{ fontSize: 34, color: '#ff7a2e' }} />,
        }, {
          label: 'Total Orders',
          value: summary.orders,
          icon: <ShoppingCart sx={{ fontSize: 34, color: '#ff7a2e' }} />,
        }, {
          label: 'Order Value',
          value: `Rs. ${summary.avg}`,
          icon: <TrendingUp sx={{ fontSize: 34, color: '#ff7a2e' }} />,
        }, {
          label: filter === 'monthly' ? 'Top Sales Week' : 'Top Sales Day',
          value: filter === 'daily' ? 'This day' : filter === 'monthly' ? topSalesWeek?.day || '-' : topSalesDay?.day || '-',
          icon: <TrendingUp sx={{ fontSize: 34, color: '#ff7a2e' }} />,
          extra: filter === 'daily' ? '' : filter === 'monthly' ? topSalesWeek ? `Top Product: ${topSalesWeek.product}` : '' : topSalesDay ? `Top Product: ${topSalesDay.product}` : '',
        }].map((c) => (
          <Grid item xs={12} md={3} key={c.label}>
            <Paper sx={{ p: 2, borderRadius: 3 }}>
              <Box sx={{ display: 'flex', justifyContent: 'space-between' }}>
                <Box>
                  <Typography sx={{ fontWeight: 700, fontFamily: "'Play', sans-serif" }}>{c.label}</Typography>
                  <Box sx={{ mt: 1 }}>
                    <Typography sx={{ fontWeight: 700, fontSize: 20, color: '#ff7a2e', fontFamily: "'Play', sans-serif" }}>{c.value}</Typography>
                  </Box>
                  <Typography variant="caption" sx={{ fontFamily: "'Play', sans-serif" }}>This {filter}</Typography>
                  {c.extra && <Typography variant="caption" sx={{ display: 'block', mt: 0.5, fontFamily: "'Play', sans-serif", color: '#ff7a2e' }}>{c.extra}</Typography>}
                </Box>
                {c.icon}
              </Box>
            </Paper>
          </Grid>
        ))}
      </Grid>

      {/* CHARTS */}
      <Grid container spacing={2} sx={{ mb: 3, borderRadius: 2 }}>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 3 }}>
            <Typography sx={{ fontWeight: 700, fontFamily: "'Play', sans-serif" }}>Sales Trend</Typography><br />
            <ResponsiveContainer width="100%" height={260}>
              <LineChart data={trend}>
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line dataKey="revenue" stroke={'#ff7a2e'} strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
        <Grid item xs={12} md={6}>
          <Paper sx={{ p: 2, borderRadius: 2 }}>
            <Typography sx={{ fontWeight: 700, fontFamily: "'Play', sans-serif" }}>Sales by Category</Typography><br />
            <ResponsiveContainer width="100%" height={260}>
              <PieChart>
                <Pie data={categoryRevenue} dataKey="value" nameKey="name" label>
                  {categoryRevenue.map((_, i) => (<Cell key={i} fill={COLORS[i % COLORS.length]} />))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          </Paper>
        </Grid>
      </Grid>

      {/* PRODUCT REVENUE */}
      <Paper sx={{ p: 2, mb: 3, borderRadius: 2 }}>
        <Typography sx={{ fontWeight: 700, fontFamily: "'Play', sans-serif" }}>Top Products by Revenue</Typography><br />
        <ResponsiveContainer width="100%" height={260}>
          <BarChart data={productRevenue}>
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Bar dataKey="revenue" fill="#ff7a2e" />
          </BarChart>
        </ResponsiveContainer>
      </Paper>

      {/* TABLE */}
      <Paper sx={{ borderRadius: 2 }}>
        <Typography sx={{ p: 2, fontWeight: 600, fontFamily: "'Play', sans-serif" }}>Product Sales Details</Typography>
        <TableContainer component={Paper} sx={{ borderRadius: 2, boxShadow: '0 1px 3px rgba(0,0,0,0.1)' }}>
          <Table>
            <TableHead>
              <TableRow sx={{ bgcolor: '#f9fafb' }}>
                <TableCell sx={{ fontWeight: 600, fontFamily: "'Play', sans-serif", color: '#6b7280' }}>Product Name</TableCell>
                <TableCell sx={{ fontWeight: 600, fontFamily: "'Play', sans-serif", color: '#6b7280' }}>Category</TableCell>
                <TableCell sx={{ fontWeight: 600, fontFamily: "'Play', sans-serif", color: '#6b7280' }}>Unit Price</TableCell>
                <TableCell sx={{ fontWeight: 600, fontFamily: "'Play', sans-serif", color: '#6b7280' }}>Units Sold</TableCell>
                <TableCell sx={{ fontWeight: 600, fontFamily: "'Play', sans-serif", color: '#6b7280' }}>Total Revenue</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {filteredRows.map((r, i) => (
                <TableRow key={i}>
                  <TableCell sx={{ fontWeight: 500, fontFamily: "'Play', sans-serif", color: '#6b7280' }}>{r.product}</TableCell>
                  <TableCell sx={{ fontWeight: 500, fontFamily: "'Play', sans-serif", color: '#6b7280' }}>
                    <Chip label={r.category} size="small" sx={{ bgcolor: categoryColorMap[r.category], color: '#fff', fontWeight: 600, fontFamily: "'Play', sans-serif" }} />
                  </TableCell>
                  <TableCell sx={{ fontWeight: 500, fontFamily: "'Play', sans-serif", color: '#6b7280' }}>Rs. {r.price}</TableCell>
                  <TableCell sx={{ fontWeight: 500, fontFamily: "'Play', sans-serif", color: '#6b7280' }}>{r.qty}</TableCell>
                  <TableCell sx={{ color: '#ff7a2e', fontWeight: 600, fontFamily: "'Play', sans-serif" }}>Rs. {(r.price * r.qty).toLocaleString()}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </Paper>
    </Box>
  );
}
