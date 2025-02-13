import React, { useState } from "react";
import { Container, Typography, TextField, Grid, Button, Alert } from "@mui/material";
import { useNavigate } from "react-router-dom";
import { useBudget } from "../contexts/BudgetContext";

export default function BudgetStrategyPage() {
  const navigate = useNavigate();
  const { state, setBudget } = useBudget();
  
  // Initialize state with values from context
  const [income, setIncome] = useState(state?.income || "");
  const [percentages, setPercentages] = useState(state?.percentages || {
    needs: 50,
    wants: 30,
    savings: 20
  });
  const [error, setError] = useState("");

  // Handle budget calculation and navigate to Needs page
  const handleCalculate = () => {
    const total = Object.values(percentages).reduce((a, b) => a + Number(b), 0);
    if (total !== 100) return setError("Total percent of Needs, Wants, and Savings must add up to 100%!");
    if (percentages.savings < 5) return setError("Savings must be at least 5%");

    const totalIncome = Number(income);
    const newBudget = {
      income: totalIncome,
      percentages,
      needsAmount: (percentages.needs / 100) * totalIncome,
      wantsAmount: (percentages.wants / 100) * totalIncome,
      savingsAmount: (percentages.savings / 100) * totalIncome,
    };

    setBudget(newBudget);
    navigate("/needs", { state: newBudget });
  };

  // Handle user input, removing leading zeros
  const handlePercentageChange = (category, value) => {
    const sanitizedValue = value.replace(/^0+/, ""); // Remove leading zeros

    // Ensure the value is a valid number and within 0-100 range
    setPercentages((prev) => ({
      ...prev,
      [category]: sanitizedValue === "" ? "" : Math.min(100, Math.max(0, sanitizedValue))
    }));
  };

  return (
    <Container maxWidth="md">
      <Typography variant="h1" align="center">
        Budget Strategy
      </Typography>

      <TextField
        fullWidth
        label="After-tax Income"
        value={income}
        onChange={(e) => setIncome(e.target.value.replace(/[^0-9]/g, ""))}
        sx={{ mb: 3 }}
      />

      <Grid container spacing={3}>
        {["needs", "wants", "savings"].map((category) => (
          <Grid item xs={4} key={category}>
            <TextField
              fullWidth
              label={category.charAt(0).toUpperCase() + category.slice(1)}
              value={percentages[category]}
              onChange={(e) => handlePercentageChange(category, e.target.value)}
              type="number"
              InputProps={{ endAdornment: "%" }}
            />
          </Grid>
        ))}
      </Grid>

      <Typography variant="h6" align="center" sx={{ mt: 2 }}>
        Your Calculated Budget:
        <br />
        Needs: ${((percentages.needs / 100) * income).toFixed(2)}
        <br />
        Wants: ${((percentages.wants / 100) * income).toFixed(2)}
        <br />
        Savings: ${((percentages.savings / 100) * income).toFixed(2)}
      </Typography>

      {error && <Alert severity="error">{error}</Alert>}

      <Button variant="contained" size="large" fullWidth onClick={handleCalculate}>
        Continue to Needs
      </Button>
    </Container>
  );
}