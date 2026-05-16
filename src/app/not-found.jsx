import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '../components/common/Button';

export default function NotFound() {
  return (
    <Container maxWidth="lg">
      <Box
        sx={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          minHeight: '50vh',
          textAlign: 'center',
        }}
      >
        <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', color: 'primary.main' }}>
          Oops
        </Typography>
        <Typography variant="h4" gutterBottom>
          This Feature is Under Construction
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          We're working hard to bring this feature to you soon. Stay tuned!
        </Typography>
        <Button variant="contained" href="/" sx={{ mt: 2 }}>
          Go Home
        </Button>
      </Box>
    </Container>
  );
}
