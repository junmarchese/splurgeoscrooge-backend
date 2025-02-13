import { useState } from 'react';
import { TextField, Button, Dialog, DialogTitle, DialogContent, DialogActions, List, ListItem, ListItemText, Box } from '@mui/material';
import axios from 'axios';
import AveragePriceFinder from './AveragePriceFinder';

const BACKEND_URL = "http://localhost:5000";

export default function PriceFinderModal({ open, onClose, onSelect }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [results, setResults] = useState([]);

  const handleSearch = async () => {
    try {
      const response = await axios.get(`${BACKEND_URL}/api/prices/search?q=${searchTerm}`);
      console.log("What did we get back?", response.data)
      setResults(response.data);
    } catch (error) {
      console.error('Search failed:', error);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} fullWidth maxWidth="sm">
      <DialogTitle>Average Price Finder</DialogTitle>
      <DialogContent>
        
      
        <AveragePriceFinder/>
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
}