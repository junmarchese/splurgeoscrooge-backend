import React,{ useState, useEffect } from 'react';
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
  const [state] = useBudget();

  console.log("state1:", state)

  const [useTotal, setUseTotal] = useState(false);
  const [openFinder, setOpenFinder] = useState(false);
  const [error, setError] = useState('');

  const allocatedBudgetSavings = (state.percentages.savings / 100) * state.income;
  const calculatedTotal = Object.entries(state.spending.savings)
    .filter(([key]) => key !== 'total')
    .reduce((sum, [_, value]) => sum + value, 0);
  const totalSavings = useTotal ? state.spending.savings.total : calculatedTotal;
  const remainingBalance = allocatedBudgetSavings - totalSavings;

  useEffect(() => {
    if (user) {
      const savedSavings = localStorage.getItem(`savingsState_${user.username}`);
      /*if (savedSavings) {
        dispatch({ type: "LOAD_SAVED_STATE", payload: JSON.parse(savedSavings) });
      }*/
    }
  }, [user, dispatch]);

  const handleContinue = () => {
    if (totalSavings > allocatedBudgetSavings) {
      setError('Savings allocation exceeds available amount!');
      return;
    }
    
    if (totalSavings < allocatedBudgetSavings) {
      setError('You must allocate the entire savings amount!');
      return;
    }
    /*
    dispatch({
      type: 'UPDATE_SPENDING',
      category: 'savings',
      field: 'total',
      value: totalSavings
    });*/
    
    // Calculate remaining income balance
    const totalIncome = state.income;
    const totalNeeds = state.spending.needs.total || 0;
    const totalWants = state.spending.wants.total || 0;

    const remainingIncomeBalance = totalIncome - (totalNeeds + totalWants + totalSavings);

    console.log("Dispatching remainingIncomeBalance:", remainingIncomeBalance);
    
    /*
    dispatch({
      type: 'SET_REMAINING_BALANCE',
      payload: remainingIncomeBalance
    });
    */
    
    navigate('/splurge-o-scrooge');
  };

  console.log("state:", state)
  return (
    <Container maxWidth="md" sx={{ pb: 8, pt: 10, backgroundColor: '#F7E7CE' }}>
      <Typography variant="h1" gutterBottom align="center">
        Savings
      </Typography>

      <Typography variant="h6" sx={{ mb: 3 }}>
        <strong>Total Savings Target: ${allocatedBudgetSavings.toLocaleString()}</strong>
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
        <>
          {savingsCategories.map(({ field, label, tooltip }) => (
            <CategoryInput
              key={field}
              label={label}
              value={state.spending.savings[field] || ""}
              field={field}
              tooltip={tooltip}
              onChange={(field, value) => dispatch({
                type: 'UPDATE_SPENDING',
                category: 'savings',
                field,
                value
              })}
            />
          ))}
          <Typography variant="h6" sx={{ mt: 2 }}>
            Remaining Savings Balance to Allocate: ${remainingBalance.toLocaleString()}
          </Typography>
        </>
      ) : (
        <CategoryInput
          label="Total Savings Allocation"
          value={state.spending.savings.total || ''}
          field="total"
          tooltip="Enter total savings allocation if known"
          onChange={(field, value) => dispatch({
            type: 'UPDATE_SPENDING',
            category: 'savings',
            field,
            value
          })}
        />
      )}

      {error && <Alert severity="error" sx={{ mt: 2, mb: 2 }}>{error}</Alert>}

      <Button
        variant="contained"
        size="large"
        onClick={handleContinue}
        fullWidth
        sx={{ mt: 4 }}
      >
        Continue to Splurge O' Scrooge
      </Button>

      <NavBar />

      <PriceFinderModal
              open={openFinder}
              onClose={() => setOpenFinder(false)}
      />

    </Container>
  );
}
