import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, TextField, Grid, Button, Alert } from "@mui/material";
import { useBudget } from "../contexts/BudgetContext";
import NavBar from "../components/NavBar";

export default function BudgetStrategyPage() {
  const navigate = useNavigate();
  const { budget, updateIncome, updatePercentages } = useBudget();
  
  const [income, setIncome] = useState(budget.income || "");
  const [percentages, setPercentages] = useState(budget.percentages || {
    needs: 50,
    wants: 30,
    savings: 20
  });
  const [error, setError] = useState("");

  const handleCalculate = () => {
    const total = Object.values(percentages).reduce((a, b) => a + Number(b), 0);
    if (total !== 100) {
      setError("Total percent must add up to 100%!");
      return;
    }
    if (percentages.savings < 5) {
      setError("Savings must be at least 5%");
      return;
    }

    updateIncome(income);
    updatePercentages(percentages);
    navigate("/needs");
  };

  const handlePercentageChange = (category, value) => {
    const sanitizedValue = value.replace(/^0+/, "");
    setPercentages(prev => ({
      ...prev,
      [category]: sanitizedValue === "" ? "" : Math.min(100, Math.max(0, Number(sanitizedValue)))
    }));
  };

  return (
    <Container maxWidth="sm" sx={{ pt: 10 }}>
      <Typography variant="h4" align="center" gutterBottom>
        Set Your Budget Strategy
      </Typography>

      <TextField
        fullWidth
        label="Monthly Income"
        type="number"
        value={income}
        onChange={(e) => setIncome(e.target.value)}
        margin="normal"
      />

      <Grid container spacing={2}>
        {Object.entries(percentages).map(([category, value]) => (
          <Grid item xs={12} key={category}>
            <TextField
              fullWidth
              label={`${category.charAt(0).toUpperCase() + category.slice(1)} %`}
              type="number"
              value={value}
              onChange={(e) => handlePercentageChange(category, e.target.value)}
            />
          </Grid>
        ))}
      </Grid>

      {error && (
        <Alert severity="error" sx={{ mt: 2 }}>
          {error}
        </Alert>
      )}

      <Button
        variant="contained"
        fullWidth
        onClick={handleCalculate}
        sx={{ mt: 3 }}
      >
        Calculate Budget
      </Button>
    <NavBar />
    </Container>
  );
}