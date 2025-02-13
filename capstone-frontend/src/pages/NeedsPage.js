import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Alert } from '@mui/material';
import { useBudget } from '../contexts/BudgetContext';
import NavBar from '../components/NavBar';
import CategoryInput from '../components/CategoryInput';
import PriceFinderModal from '../components/PriceFinderModal';

const needsCategories = [
  { field: 'groceries', label: 'Groceries', tooltip: 'grocery expenses' },
  { field: 'housing', label: 'Housing', tooltip: 'rent, mortgage, essential household repairs' },
  { field: 'utilities', label: 'Utilities', tooltip: 'electricity, water, gas, sewage, trash & recycling, basic internet & phone' },
  { field: 'insurance', label: 'Insurance', tooltip: 'healthcare, homeowner/renter, auto, life, disability insurance premiums' },
  { field: 'healthcare_bills', label: 'Healthcare bills', tooltip: 'medications, medical devices, primary, dental, specialty & urgent care copays, deductibles, out-of-pocket costs' },
  { field: 'childcare', label: 'Childcare', tooltip: 'daycare, after-school care, tuition, onsite meals/snack, material costs/fees' },
  { field: 'transportation', label: 'Transportation', tooltip: 'lease/own vehicle, gasoline, public transportation' },
  { field: 'debt_payments', label: 'Debt payments', tooltip: 'personal loans, student loans, credit cards' },
  { field: 'essential_clothing', label: 'Essential Clothing/Accessories', tooltip: 'essential clothing, and accessories like shoes, wallet, eyeglasses' },
  { field: 'essential_household', label: 'Essential Household Items', tooltip: 'essential kitchen, laundry, bathroom supplies' }
];

export default function NeedsPage() {
  const navigate = useNavigate();
  const { state, dispatch } = useBudget();
  const [useTotal, setUseTotal] = useState(false);
  const [openFinder, setOpenFinder] = useState(false);
  const [error, setError] = useState('');

  // Initialize needs spending if not present
  useEffect(() => {
    if (!state?.spending?.needs) {
      dispatch({ 
        type: 'SET_BUDGET', 
        payload: {
          ...state,
          spending: {
            ...state?.spending,
            needs: {}
          }
        }
      });
    }
  }, [state, dispatch]);

  // Safely access needs spending with default empty object
  const needsSpending = state?.spending?.needs || {};

  // Calculate total with safe checks
  const calculatedTotal = Object.entries(needsSpending || {})
    .filter(([key, value]) => 
      key !== 'total' && 
      typeof value === 'number' && 
      !isNaN(value)
    )
    .reduce((sum, [_, value]) => sum + value, 0);

  const handleContinue = () => {
    const total = useTotal ? (needsSpending.total || 0) : calculatedTotal;
    
    // Safely calculate allocated budget
    const allocatedBudget = state?.percentages?.needs 
      ? (state.percentages.needs / 100) * (state.income || 0) 
      : 0;

    if (total > allocatedBudget) {
      setError('Needs spending exceeds allocated budget!');
      return;
    }
    
    dispatch({ 
      type: 'UPDATE_SPENDING',
      category: 'needs',
      field: 'total',
      value: total
    });
    
    navigate('/wants');
  };

  const handleCategoryChange = (field, value) => {
    const numericValue = parseFloat(value) || 0;
    dispatch({
      type: 'UPDATE_SPENDING',
      category: 'needs',
      field,
      value: numericValue
    });
  };

  return (
    <Container maxWidth="md" sx={{ pb: 8, pt: 10, backgroundColor: '#e0f7f1' }}>
      <Typography variant="h1" gutterBottom align="center">
        Needs
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
        needsCategories.map(({ field, label, tooltip }) => (
          <CategoryInput
            key={field}
            label={label}
            value={needsSpending[field] || ""}
            field={field}
            tooltip={tooltip}
            onChange={handleCategoryChange}
          />
        ))
      ) : (
        <CategoryInput
          label="Total Needs Spending"
          value={needsSpending.total || ""}
          field="total"
          tooltip="Enter total needs spending if known"
          onChange={handleCategoryChange}
        />
      )}

      <Typography variant="h6" sx={{ mt: 2, mb: 4 }}>
        Total Needs Spending: ${useTotal ? (needsSpending.total || 0).toFixed(2) : calculatedTotal.toFixed(2)}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Button
        variant="contained"
        size="large"
        onClick={handleContinue}
        fullWidth
        sx={{ mb: 2 }}
      >
        Continue to Wants
      </Button>

      <NavBar />

      <PriceFinderModal
        open={openFinder}
        onClose={() => setOpenFinder(false)}
        onSelect={(seriesId)=>{

///call for the price
        }}
      />
    </Container>
  );
}