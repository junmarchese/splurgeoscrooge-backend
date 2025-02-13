import React, { useState } from 'react';
import { Box, Button, Container, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import { useBudget } from '../contexts/BudgetContext';
import NavBar from '../components/NavBar';

// Load API key from .env file
const GIPHY_API_KEY = process.env.REACT_APP_GIPHY_API_KEY;
const GIPHY_BASE_URL = "https://api.giphy.com/v1/gifs/search";

export default function SplurgeOScroogePage() {
  const { budget } = useBudget();
  const [wishlistItem, setWishlistItem] = useState('');
  const [result, setResult] = useState(null);
  const [gifUrl, setGifUrl] = useState("");
  const [loadingGif, setLoadingGif] = useState(false);
  const [error, setError] = useState("");

  // Calculate remaining balance
  const totalSpent = Object.values(budget.spending).reduce((total, category) => {
    return total + (category.total || 0);
  }, 0);
  
  const remainingBalance = budget.income - totalSpent;

  const fetchGif = async (searchTerm) => {
    setLoadingGif(true);
    try {
      const response = await fetch(
        `${GIPHY_BASE_URL}?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(searchTerm)}&limit=10`
      );
      const data = await response.json();

      if (data.data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.data.length);
        setGifUrl(data.data[randomIndex].images.original.url);
      } else {
        setGifUrl("");
        console.error("No GIFs found.");
      }
    } catch (error) {
      console.error("Error fetching GIF:", error);
      setGifUrl("");
    }
    setLoadingGif(false);
  };

  const handleCheck = () => {
    const price = parseFloat(wishlistItem);

    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid item cost.");
      return;
    }
    setError("");

    if (price > remainingBalance) {
      setResult('denied');
      fetchGif('disappointed');
    } else {
      setResult('approved');
      fetchGif('happy');
    }
  };

  return (
    <Container maxWidth="md" sx={{ pb: 8, pt: 10, backgroundColor: '#F8F7FF' }}>
      <Typography variant="h4" gutterBottom align="center">
        Splurge-O-Scrooge
      </Typography>

      <Typography variant="h6" gutterBottom align="center">
        Remaining Balance: ${remainingBalance.toFixed(2)}
      </Typography>

      <Box sx={{ my: 4 }}>
        <TextField
          fullWidth
          label="Enter Item Cost"
          type="number"
          value={wishlistItem}
          onChange={(e) => setWishlistItem(e.target.value)}
          sx={{ mb: 2 }}
        />

        <Button
          variant="contained"
          fullWidth
          onClick={handleCheck}
          disabled={loadingGif}
          sx={{ mb: 2 }}
        >
          {loadingGif ? <CircularProgress size={24} /> : "Check If You Can Splurge"}
        </Button>

        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

        {result && (
          <Box sx={{ textAlign: 'center', mt: 2 }}>
            <Typography variant="h5" gutterBottom>
              {result === 'approved' ? "Go ahead and treat yourself! 🎉" : "Better save that money! 💰"}
            </Typography>
            {gifUrl && <img src={gifUrl} alt="Reaction GIF" style={{ maxWidth: '100%' }} />}
          </Box>
        )}
      </Box>

      <NavBar />
    </Container>
  );
}
