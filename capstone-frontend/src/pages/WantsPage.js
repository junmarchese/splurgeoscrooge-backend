import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Alert } from '@mui/material';
import { useBudget } from '../contexts/BudgetContext';
import { useUser } from '../contexts/UserContext';
import NavBar from '../components/NavBar';
import CategoryInput from '../components/CategoryInput';
import PriceFinderModal from '../components/PriceFinderModal';

const wantsCategories = [
  {
    field: 'entertainment',
    label: 'Entertainment',
    tooltip: 'magazine, cable, streaming subscriptions'
  },
  {
    field: 'diningOut',
    label: 'Dining Out',
    tooltip: 'take-out meals, restaurants, food deliveries'
  },
  {
    field: 'gym',
    label: 'Gym Memberships',
    tooltip: 'fitness club memberships and class fees'
  },
  {
    field: 'hobbies',
    label: 'Hobbies & Activities',
    tooltip: 'arts/crafts lessons, sports tickets, event fees'
  },
  {
    field: 'luxury',
    label: 'Luxury Items',
    tooltip: 'high-end electronics, clothing, accessories, jewelry'
  },
  {
    field: 'vacations',
    label: 'Vacations',
    tooltip: 'travel, accommodations, and vacation activities'
  },
  {
    field: 'householdNonEssential',
    label: 'Non-Essential Household',
    tooltip: 'decorative items, non-essential furnishings'
  }
];

export default function WantsPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { state, dispatch } = useBudget();
  const [useTotal, setUseTotal] = useState(false);
  const [openFinder, setOpenFinder] = useState(false);
  const [error, setError] = useState('');

  // Initialize wants spending if not present
  useEffect(() => {
    if (!state?.spending?.wants) {
      dispatch({ 
        type: 'SET_BUDGET', 
        payload: {
          ...state,
          spending: {
            ...state?.spending,
            wants: {}
          }
        }
      });
    }
  }, [state, dispatch]);

  // Safely access wants spending with default empty object
  const wantsSpending = state?.spending?.wants || {};

  // Calculate total with safe checks
  const calculatedTotal = Object.entries(wantsSpending)
    .filter(([key, value]) => 
      key !== 'total' && 
      typeof value === 'number' && 
      !isNaN(value)
    )
    .reduce((sum, [_, value]) => sum + value, 0);

  const handleCategoryChange = (field, value) => {
    const numericValue = parseFloat(value) || 0;
    dispatch({
      type: 'UPDATE_SPENDING',
      category: 'wants',
      field,
      value: numericValue
    });
  };

  const handleContinue = () => {
    const totalWants = useTotal ? (wantsSpending.total || 0) : calculatedTotal;

    const allocatedBudgetWants = state?.percentages?.wants 
      ? (state.percentages.wants / 100) * (state.income || 0) 
      : 0;

    if (totalWants > allocatedBudgetWants) {
      setError('Wants spending exceeds allocated budget!');
      return;
    }

    dispatch({ 
      type: 'UPDATE_SPENDING',
      category: 'wants',
      field: 'total',
      value: totalWants
    });
    
    if (user?.username) {
      localStorage.setItem(`wantsState_${user.username}`, JSON.stringify(wantsSpending));
    }

    navigate('/savings');
  };

  return (
    <Container maxWidth="md" sx={{ pb: 8, pt: 10, backgroundColor: '#FDE2E4' }}>
      <Typography variant="h1" gutterBottom align="center">
        Wants
      </Typography>

      <Box sx={{ mb: 2 }}>
        <Button 
          variant="outlined"
          onClick={() => setUseTotal(!useTotal)}
          sx={{ mb: 2, mr: 2 }}
        >
          {useTotal ? 'Enter Individual Categories' : 'Enter Total Directly'}
        </Button>
        <Button 
          variant="outlined"
          onClick={() => setOpenFinder(true)}
          sx={{ mb: 2 }}
        >
          Open Price Finder
        </Button>
      </Box>

      {!useTotal ? (
        wantsCategories.map(({ field, label, tooltip }) => (
          <CategoryInput
            key={field}
            label={label}
            value={wantsSpending[field] || ""}
            field={field}
            tooltip={tooltip}
            onChange={handleCategoryChange}
          />
        ))
      ) : (
        <CategoryInput
          label="Total Wants Spending"
          value={wantsSpending.total || ""}
          field="total"
          tooltip="Enter total wants spending if known"
          onChange={handleCategoryChange}
        />
      )}

      <Typography variant="h6" sx={{ mt: 2, mb: 4 }}>
        Total Wants Spending: ${useTotal ? (wantsSpending.total || 0).toFixed(2) : calculatedTotal.toFixed(2)}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Button
        variant="contained"
        size="large"
        onClick={handleContinue}
        fullWidth
        sx={{ mb: 2 }}
      >
        Continue to Savings
      </Button>

      <NavBar />

      <PriceFinderModal
        open={openFinder}
        onClose={() => setOpenFinder(false)}
      />
    </Container>
  );
}
