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
    <Container maxWidth="md" sx={{ pb: 8, pt: 12, backgroundColor: '#F8F7FF' }}>
      <Typography variant="h1" gutterBottom align="center">
        <span style={{ color: "green", fontWeight: "bold" }}>Splurge</span> O' 
        <span style={{ color: "red", fontWeight: "bold" }}> Scrooge</span>
      </Typography>

      {/* Wishlist Label */}
      <Typography
        variant="h5"
        sx={{
          fontFamily: '"Comic Sans MS", "cursive", "fantasy"',
          fontWeight: "bold",
          textAlign: "center",
          textShadow: "2px 2px 4px rgba(85, 85, 85, 0.6)",
          mb: 2,
          background: "linear-gradient(90deg, #c71585, #ff4500, #ffcc00, #32cd32, #1e90ff, #8a2be2)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
        }}
      >
        ✨ Your Wishlist Item ✨
      </Typography>

      {/* Wishlist Input Field */}
      <TextField
        fullWidth
        value={wishlistItem}
        onChange={(e) => setWishlistItem(e.target.value.replace(/[^0-9.]/g, ''))}
        placeholder='Enter price of item'
        InputProps={{ 
          startAdornment: '$',
          sx: {
            fontSize: "1.5rem",
            fontWeight: "bold",
            color: "purple",
          },
        }}
        sx={{
          mb: 3,
          backgroundColor: "#fff3e0",
          borderRadius: "8px",
          "& input::placeholder": {
            color: "purple",
          },
        }}
      />

      {/* Splurge Button */}
      <Box sx={{ display: "flex", justifyContent: "center" }}>
        <Button
          variant="contained"
          size="large"
          onClick={handleCheck}
          sx={{ mb: 3, backgroundColor: '#dc64de', color: 'white', fontSize: '1.1rem' }}
        >
          Splurge O' Scrooge?
        </Button>
      </Box>


      {/* Error Message */}
      {error && <Alert severity="error">{error}</Alert>}

      {/* Result Section */}
      {result && (
        <Box 
          sx={{ 
            textAlign: 'center',
            border: `50px solid ${result === 'approved' ? 'green' : 'red'}`,
            borderRadius: '35px',
            p: 4,
            mb: 3
          }}
        >
          <Typography 
            variant="h4" 
            sx={{ 
              mb: 2,
              fontWeight: "bold",
              color: result === "approved" ? "green" : "red", 
            }}
          >
            {result === 'approved' ? 'SPLURGE!' : 'SCROOGE!'}
          </Typography>

          {/* Show Loading Indicator while GIF is loading */}
          {loadingGif ? (
            <CircularProgress size={50} />
          ) : (
            gifUrl && (
              <Box
                component="img"
                src={gifUrl}
                alt="Giphy Image"
                sx={{ width: "100%", maxWidth: 300, height: "auto", mb: 2 }}
              />
            )
          )}

          <Typography>
            {result === "approved" ? (
              <>
                Your item fits within your remaining income balance of {" "}
                <span style={{ fontWeight: "bold", fontSize: "2rem", color: "green" }}>
                  ${remainingBalance.toLocaleString()}
                </span>
              </>
            ) : (
              <>
                Your item exceeds your remaining income balance of{" "}
                <span style={{ fontWeight: "bold", fontSize: "2rem", color: "red" }}>
                  ${remainingBalance.toLocaleString()}
                </span>
              </>
            )}
          </Typography>

           {/* Giphy Attribution */}
           <Typography variant="body2" sx={{ mt: 1, fontSize: "12px", color: "gray" }}>
            Powered by <a href="https://giphy.com/" target="_blank" rel="noopener noreferrer">GIPHY</a>
          </Typography>
        </Box>
      )}

      <NavBar />
    </Container>
  );
}
