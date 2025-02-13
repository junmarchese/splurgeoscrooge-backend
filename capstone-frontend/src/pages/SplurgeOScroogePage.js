import { useState, useEffect } from 'react';
import { Box, Button, Container, TextField, Typography, Alert, CircularProgress } from '@mui/material';
import { useBudget } from '../contexts/BudgetContext';
import { useUser } from '../contexts/UserContext';
import NavBar from '../components/NavBar';

// Load API key from .env file
const GIPHY_API_KEY = process.env.REACT_APP_GIPHY_API_KEY;
const GIPHY_BASE_URL = "https://api.giphy.com/v1/gifs/search";

export default function SplurgeOScroogePage() {
  const { user, logout } = useUser(); // Access logged-in user and logout function
  const [state, dispatch] = useBudget();
  const remainingIncomeBalance = state.remainingIncomeBalance ?? 0;

  const [wishlistItem, setWishlistItem] = useState('');
  const [result, setResult] = useState(null);
  const [gifUrl, setGifUrl] = useState("");
  const [loadingGif, setLoadingGif] = useState(false);
  const [error, setError] = useState("");


  /** Load wishlist item and remaining income balance from localStorage when user logs in */
  useEffect(() => {
    if (user) {
      const savedWishlistItem = localStorage.getItem(`wishlistItem_${user.username}`);
      const savedBudgetState = localStorage.getItem(`budgetState_${user.username}`);

      if (savedWishlistItem) {
        setWishlistItem(savedWishlistItem);
      } else {
        setWishlistItem("");
      }
      
      if (savedBudgetState) {
        const parsedBudgetState = JSON.parse(savedBudgetState);
      
        // Update global state with saved budget
        dispatch({ type: "LOAD_SAVED_BUDGET", payload: parsedBudgetState });
      } else {
        dispatch({ type: "RESET_BUDGET" });
      }      
    }
  }, [user, dispatch]);

  /** Fetches a random GIF based on search term */
  const fetchGif = async (searchTerm) => {
    setLoadingGif(true);
    // console.log("Giphy API Key:", GIPHY_API_KEY);
    try {
      const response = await fetch(
        `${GIPHY_BASE_URL}?api_key=${GIPHY_API_KEY}&q=${encodeURIComponent(searchTerm)}&limit=10`
      );
      const data = await response.json();
      console.log(data);

      if (data.data.length > 0) {
        const randomIndex = Math.floor(Math.random() * data.data.length);
        setGifUrl(data.data[randomIndex].images.original.url);
      } else {
        console.error("No GIFs found.");
      }
    } catch (error) {
      console.error("Error fetching GIF:", error);
    }
    setLoadingGif(false);
  };

  /** Handles wishlist item approval or denial */
  const handleCheck = () => {
    const price = parseFloat(wishlistItem);

    if (isNaN(price) || price <= 0) {
      setError("Please enter a valid item cost.");
      return;
    }
    setError(""); // Clear any previous error

    console.log("Comparing price:", price, "with remaining balance:", remainingIncomeBalance);

    if (price > remainingIncomeBalance) {
      setResult('denied');
      fetchGif('disappointed');
    } else {
      setResult('approved');
      fetchGif('happy');
    }
  };

  /** Save wishlist and budget state to localStorage */
  const handleSaveAndLogout = () => {
    if (user) {
      localStorage.setItem(`wishlistItem_${user.username}`, wishlistItem);
      localStorage.setItem(`budgetState_${user.username}`, JSON.stringify(state));
    }
    logout(); // Log user out
  };

  /** Reset all state and log out */
  const handleResetAndLogout = () => {
    if (window.confirm("Are you sure? All data will be lost!")) {
      if (user) {
        localStorage.removeItem(`wishlistItem_${user.username}`);
        localStorage.removeItem(`budgetState_${user.username}`);
      }
      dispatch({ type: "RESET_BUDGET", username: user?.username });
      logout();
    }
  };

  return (
    <Container maxWidth="md" sx={{ pb: 8, pt: 10, backgroundColor: '#FDE2E4' }}>
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
          sx={{ mb: 3 }}
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
                  ${remainingIncomeBalance.toLocaleString()}
                </span>
              </>
            ) : (
              <>
                Your item exceeds your remaining income balance of{" "}
                <span style={{ fontWeight: "bold", fontSize: "2rem", color: "red" }}>
                  ${remainingIncomeBalance.toLocaleString()}
                </span>
              </>
            )}
          </Typography>
        </Box>
      )}

      {/* Buttons for Retrying or Saving */}
      <Box sx={{ display: 'flex', gap: 2 }}>
        <Button variant="outlined" onClick={() => setWishlistItem('')} fullWidth>
          Try Another Item
        </Button>
        <Button variant="contained" onClick={handleSaveAndLogout} fullWidth>
          Save & Logout
        </Button>
        <Button variant="contained" color="error" onClick={handleResetAndLogout} fullWidth>
          Reset & Logout
        </Button>
      </Box>

      <NavBar />
    </Container>
  );
}
