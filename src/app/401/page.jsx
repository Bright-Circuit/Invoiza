import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Button from '../../components/common/Button';

export default function UnauthorizedPage() {
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
        <Typography variant="h1" sx={{ fontSize: '6rem', fontWeight: 'bold', color: 'error.main' }}>
          401
        </Typography>
        <Typography variant="h4" gutterBottom>
          Unauthorized
        </Typography>
        <Typography variant="body1" color="text.secondary" paragraph>
          You need to be logged in to access this page.
        </Typography>
        <Button variant="contained" href="/auth/login" sx={{ mt: 2 }}>
          Sign In
        </Button>
      </Box>
    </Container>
  );
}
