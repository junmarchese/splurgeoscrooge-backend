import React, { createContext, useContext, useState, useEffect } from 'react';

const BudgetContext = createContext();

const initialBudgetState = {
  income: 0,
  percentages: {
    needs: 50,
    wants: 30,
    savings: 20
  },
  spending: {
    needs: {},
    wants: {},
    savings: {}
  }
};

export function BudgetProvider({ children }) {
  const [budget, setBudget] = useState(() => {
    // Load from localStorage on initial render
    const savedBudget = localStorage.getItem('budgetState');
    return savedBudget ? JSON.parse(savedBudget) : initialBudgetState;
  });

  // Save to localStorage whenever budget changes
  useEffect(() => {
    localStorage.setItem('budgetState', JSON.stringify(budget));
  }, [budget]);

  const updateIncome = (income) => {
    setBudget(prev => ({
      ...prev,
      income: Number(income)
    }));
  };

  const updatePercentages = (newPercentages) => {
    setBudget(prev => ({
      ...prev,
      percentages: {
        ...prev.percentages,
        ...newPercentages
      }
    }));
  };

  const updateSpending = (category, field, value) => {
    setBudget(prev => ({
      ...prev,
      spending: {
        ...prev.spending,
        [category]: {
          ...prev.spending[category],
          [field]: Number(value)
        }
      }
    }));
  };

  const resetBudget = () => {
    setBudget(initialBudgetState);
    localStorage.removeItem('budgetState');
  };

  const value = {
    budget,
    updateIncome,
    updatePercentages,
    updateSpending,
    resetBudget
  };

  return (
    <BudgetContext.Provider value={value}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return context;
}