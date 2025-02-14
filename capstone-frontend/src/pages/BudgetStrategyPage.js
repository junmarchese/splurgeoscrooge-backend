import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Container, Typography, Paper, Box, TextField, Grid, Button, Alert } from "@mui/material";
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
    <>
      <NavBar />
      <Container maxWidth="md" sx={{ pb: 8, pt: 10 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 2 }}>
          <Typography variant="h4" align="center" gutterBottom>
            Budget Strategy
          </Typography>

          <Typography variant="body1" paragraph>
            The 50-30-20 rule splits your after-tax/net income into 3 categories:
          </Typography>
          <Box component="ul" sx={{ pl: 3 }}>
            <Typography component="li" variant="body2">
              <strong>Needs (50%)</strong> - Essential expenses necessary for survival.
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Wants (30%)</strong> - Non-essential expenses enhancing quality of life.
            </Typography>
            <Typography component="li" variant="body2">
              <strong>Savings (20%)</strong> - Funds for future financial stability.
            </Typography>
          </Box>

          {/* Income Input */}
          <TextField
            fullWidth
            label="Monthly Income"
            type="number"
            value={income}
            onChange={(e) => setIncome(e.target.value)}
            margin="normal"
            variant="outlined"
          />

          {/* Percentage Inputs */}
          <Grid container spacing={2} sx={{ mt: 2 }}>
            {Object.entries(percentages).map(([category, value]) => (
              <Grid item xs={12} sm={4} key={category}>
                <TextField
                  fullWidth
                  label={`${category.charAt(0).toUpperCase() + category.slice(1)} %`}
                  type="number"
                  value={value}
                  onChange={(e) => handlePercentageChange(category, e.target.value)}
                  variant="outlined"
                />
              </Grid>
            ))}
          </Grid>

          {/* Calculated Budget */}
          <Typography variant="h6" align="center" sx={{ mt: 3 }}>
            <strong>Calculated Budget:</strong>
          </Typography>
          <Box textAlign="center" sx={{ mt: 1, mb: 2 }}>
            <Typography variant="body1">
              <strong>Needs:</strong> ${((percentages.needs / 100) * income || 0).toFixed(2)}
            </Typography>
            <Typography variant="body1">
              <strong>Wants:</strong> ${((percentages.wants / 100) * income || 0).toFixed(2)}
            </Typography>
            <Typography variant="body1">
              <strong>Savings:</strong> ${((percentages.savings / 100) * income || 0).toFixed(2)}
            </Typography>
          </Box>

          {/* Error Message */}
          {error && (
            <Alert severity="error" sx={{ mt: 2 }}>
              {error}
            </Alert>
          )}

          {/* Continue Button */}
          <Button
            variant="contained"
            fullWidth
            onClick={handleCalculate}
            sx={{ mt: 3, py: 1.5 }}
          >
            Continue to Needs
          </Button>
        </Paper>
      </Container>
    </>
  );
}