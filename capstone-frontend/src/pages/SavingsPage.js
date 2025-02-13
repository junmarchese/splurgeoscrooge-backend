import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, Container, Typography, Alert } from '@mui/material';
import { useBudget } from '../contexts/BudgetContext';
import { useUser } from '../contexts/UserContext';
import NavBar from '../components/NavBar';
import CategoryInput from '../components/CategoryInput';
import PriceFinderModal from '../components/PriceFinderModal';

const savingsCategories = [
  {
    field: 'emergency',
    label: 'Emergency Fund',
    tooltip: '3-6 months of living expenses'
  },
  {
    field: 'retirement',
    label: 'Retirement Funds',
    tooltip: 'IRAs, 401(k)s, pension contributions'
  },
  {
    field: 'investments',
    label: 'Investment Funds',
    tooltip: 'Stocks, bonds, mutual funds, other investments'
  }
];

export default function SavingsPage() {
  const navigate = useNavigate();
  const { user } = useUser();
  const { budget, updateSpending } = useBudget();
  const [useTotal, setUseTotal] = useState(false);
  const [openFinder, setOpenFinder] = useState(false);
  const [error, setError] = useState('');

  const savingsSpending = budget.spending.savings || {};
  const allocatedSavingsAmount = (budget.percentages.savings / 100) * budget.income;

  const calculatedTotal = Object.entries(savingsSpending)
    .filter(([key, value]) => key !== 'total' && typeof value === 'number')
    .reduce((sum, [_, value]) => sum + value, 0);

  const handleCategoryChange = (field, value) => {
    const numericValue = parseFloat(value) || 0;
    updateSpending('savings', field, numericValue);
  };

  const handleContinue = () => {
    const totalSavings = useTotal ? (savingsSpending.total || 0) : calculatedTotal;

    if (totalSavings > allocatedSavingsAmount) {
      setError('Savings spending exceeds allocated budget!');
      return;
    }

    updateSpending('savings', 'total', totalSavings);
    
    if (user?.username) {
      localStorage.setItem(`savingsState_${user.username}`, JSON.stringify(savingsSpending));
    }

    navigate('/splurge-o-scrooge');
  };

  return (
    <Container maxWidth="md" sx={{ pb: 8, pt: 10, backgroundColor: '#DFE7FD' }}>
      <Typography variant="h4" gutterBottom align="center">
        Savings
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
        savingsCategories.map(({ field, label, tooltip }) => (
          <CategoryInput
            key={field}
            label={label}
            value={savingsSpending[field] || ""}
            field={field}
            tooltip={tooltip}
            onChange={handleCategoryChange}
          />
        ))
      ) : (
        <CategoryInput
          label="Total Savings"
          value={savingsSpending.total || ""}
          field="total"
          tooltip="Enter total savings if known"
          onChange={handleCategoryChange}
        />
      )}

      <Typography variant="h6" sx={{ mt: 2, mb: 4 }}>
        Total Savings: ${useTotal ? (savingsSpending.total || 0).toFixed(2) : calculatedTotal.toFixed(2)}
      </Typography>

      {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}

      <Button
        variant="contained"
        size="large"
        onClick={handleContinue}
        fullWidth
        sx={{ mb: 2 }}
      >
        Continue to Splurge-O-Scrooge
      </Button>

      <NavBar />

      <PriceFinderModal
        open={openFinder}
        onClose={() => setOpenFinder(false)}
      />
    </Container>
  );
}
