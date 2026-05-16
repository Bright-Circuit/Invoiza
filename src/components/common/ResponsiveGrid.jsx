'use client';

import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';

export default function ResponsiveGrid({
  children,
  spacing = 3,
  columns = { xs: 1, sm: 2, md: 3, lg: 4 },
  ...props
}) {
  return (
    <Box sx={{ width: '100%' }}>
      <Grid container spacing={spacing} {...props}>
        {Array.isArray(children) ? (
          children.map((child, index) => (
            <Grid
              item
              key={index}
              xs={12 / columns.xs}
              sm={12 / columns.sm}
              md={12 / columns.md}
              lg={12 / columns.lg}
            >
              {child}
            </Grid>
          ))
        ) : (
          <Grid item xs={12}>
            {children}
          </Grid>
        )}
      </Grid>
    </Box>
  );
}
