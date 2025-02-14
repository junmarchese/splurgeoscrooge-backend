import { Container, Typography, Button, Stack, Box } from '@mui/material';
import { Link } from 'react-router-dom';

export default function HomePage() {
  return (
    <Container maxWidth="sm" sx={{ py: 4, pb: 8, pt: 10, backgroundColor: '#E3F2FD' }}>
      <Typography variant="h1" gutterBottom align="center">
        Welcome 
        <span style={{ color: "green", fontWeight: "bold" }}> SPLURGE </span> 
        O' 
        <span style={{ color: "red", fontWeight: "bold" }}> SCROOGE! </span>
      </Typography>

      <Typography variant="h3" align="center">
        <span style={{ color: "green", fontWeight: "bold" }}>Spend as you wish</span> 
        {" "} or {" "} 
        <span style={{ color: "red", fontWeight: "bold" }}>Penny-pinch for your own good.</span>
      </Typography>

      <Stack spacing={3} sx={{ mt: 6 }}>
        <Box textAlign="center">
          <Button variant="contained" size="large" component={Link} to="/signup">
            SIGN UP
          </Button>
          <Typography variant="caption" display="block" sx={{ mt: 1 }}>
            By proceeding you agree with our Terms and Conditions
          </Typography>
        </Box>

        <Box textAlign="center">
          <Typography variant="body2" paragraph>
            Already have an account?
          </Typography>
          <Button variant="contained" size="large" component={Link} to="/login" sx={{ backgroundColor: 'secondary.main', '&:hover': { backgroundColor: 'secondary.dark' } }}>
            LOG IN
          </Button>
        </Box>
      </Stack>
    </Container>
  );
}
