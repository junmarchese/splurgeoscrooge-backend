import React, { useState } from 'react';
import { TextField, Autocomplete, CircularProgress, Typography, Box, Button } from '@mui/material';
import axios from 'axios';


const BACKEND_URL = "http://localhost:5000";

export default function AveragePriceFinder() {
  const [query, setQuery] = useState('');
  const [options, setOptions] = useState([]); // Autofilled search results
  const [selectedSeriesId, setSelectedSeriesId] = useState(null); // Only store seriesId
  const [loading, setLoading] = useState(false);
  const [priceData, setPriceData] = useState(null);
  const [error, setError] = useState(null);


  /** Fetch matching series_title and series_id from backend */
  const fetchSearchResults = async (input) => {
    if (input.trim().length < 2) {
      setOptions([]);
      return;
    }

    setLoading(true);
    try {
      const response = await axios.get(`${BACKEND_URL}/api/prices/search?q=${encodeURIComponent(input)}`);


      console.log("price data:", response)
      if (!response.data || response.data.length === 0) {
        setOptions([]);
        setError("No matching items found.");
      } else {
        setOptions(response.data);  // Expect response like [{seriesId: 'APU00007471A', title: 'Gasoline, all types'}]
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching search results:', error);
      setOptions([]);
      setError('Failed to fetch search results');
    }
    setLoading(false);
  };

  /** Fetch price from backend using the selected series_id */
  const fetchPriceData = async () => {
    if (!selectedSeriesId) {
      setError("Please select an item first.");
      return;
    }

    setLoading(true);
    try {
      console.log("Fetching price for seriesId:", selectedSeriesId); // Debug log

      const response = await axios.get(`${BACKEND_URL}/api/prices/fetch?seriesId=${encodeURIComponent(selectedSeriesId)}`);

      if (!response.data || !response.data.value) {
        setPriceData(null);
        setError("No price data available.");
      } else {
        setPriceData(response.data);
        setError(null);
      }
    } catch (error) {
      console.error('Error fetching price data:', error);
      setPriceData(null);
      setError('Failed to fetch price data');
    }
    setLoading(false);
  };

  console.log("price data:",priceData)
  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 4 }}>
      <Typography variant="h5" gutterBottom>
        Search for Average Price
      </Typography>

      {/* Search Input with AutoComplete */}
      <Autocomplete
        options={options}
        getOptionLabel={(option) => option.title} 
        filterOptions={(x) => x} 
        loading={loading}
        inputValue={query}
        onInputChange={(event, newInputValue) => {
          setQuery(newInputValue);
          fetchSearchResults(newInputValue);
        }}
        onChange={(event, newValue) => {
          if (newValue) {
            console.log("User selected:", newValue.title, "with seriesId:", newValue.seriesId);
            setSelectedSeriesId(newValue.seriesId.trim()); 
          }
        }}
        renderInput={(params) => (
          <TextField
            {...params}
            label="Search for an item"
            variant="outlined"
            fullWidth
            InputProps={{
              ...params.InputProps,
              endAdornment: (
                <>
                  {loading ? <CircularProgress color="inherit" size={20} /> : null}
                  {params.InputProps.endAdornment}
                </>
              ),
            }}
          />
        )}
      />

      {/* Submit Button */}
      <Button
        variant="contained"
        color="primary"
        onClick={fetchPriceData}
        sx={{ mt: 2 }}
        disabled={!selectedSeriesId}
      >
        Get Price
      </Button>

      {/* Error Message */}
      {error && <Typography color="error" sx={{ mt: 2 }}>{error}</Typography>}

      
      {/* Display Price Data */}
      {priceData && (
        <Box sx={{ mt: 3 }}>
          <Typography variant="h6">
            Average Price: ${parseFloat(priceData.value).toFixed(2)} (Latest Observation: {priceData.periodName} {priceData.year})
          </Typography>
          <Typography variant="body2" color="textSecondary" sx={{ mt: 1 }}>
            Data retrieved from BLS.gov on {new Date().toLocaleDateString()}.
            <br />
            <strong>BLS.gov cannot vouch for the data or analyses derived from these data after the data have been retrieved from BLS.gov.</strong>
          </Typography>
        </Box>
      )}
    </Box>
  );
}
