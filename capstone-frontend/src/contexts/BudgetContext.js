import React, { createContext, useContext, useReducer, useEffect } from 'react';



// Load initial state from localStorage if available
const savedState = JSON.parse(localStorage.getItem("budgetState"));

const initialState = savedState || {
  income: 0,
  spending: {
    needs: {},
    wants: {},
    savings: {}
  },
  percentages: {
    needs: 50,
    wants: 30,
    savings: 20
  },
  remainingIncomeBalance: 0
};

// Reducer function to manage updates
function budgetReducer(state, action) {
  switch (action.type) {
    case 'SET_BUDGET':
      return {
        ...state,
        ...action.payload
      };
    case 'SET_INCOME':
      return {
        ...state,
        income: action.payload
      };
    case 'SET_REMAINING_BALANCE':
      return {
        ...state,
        remainingIncomeBalance: action.payload
      };
    case 'UPDATE_PERCENTAGES':
      return {
        ...state,
        percentages: {
          ...state.percentages,
          ...action.payload
        }
      };
    case 'UPDATE_SPENDING':
      return {
        ...state,
        spending: {
          ...state.spending,
          [action.category]: {
            ...state.spending[action.category],
            [action.field]: action.value
          }
        }
      };
    case 'INITIALIZE_NEEDS':
      return {
        ...state,
        spending: {
          ...state.spending,
          needs: state.spending.needs || {}
        }
      };
    case 'INITIALIZE_WANTS':
      return {
        ...state,
        spending: {
          ...state.spending,
          wants: state.spending.wants || {}
        }
      };
    case 'INITIALIZE_SAVINGS':
      return {
        ...state,
        spending: {
          ...state.spending,
          savings: state.spending.savings || {}
        }
      };
    case 'RESET_BUDGET':
      return initialState; // Reset everything
    default:
      return state;
  }
}

// Context setup
export const BudgetContext = createContext( {
  income: 0,
  spending: {
    needs: {},
    wants: {},
    savings: {}
  },
  percentages: {
    needs: 50,
    wants: 30,
    savings: 20
  },
  remainingIncomeBalance: 0
});

export function BudgetProvider({ children }) {
  const [state, dispatch] = useReducer(budgetReducer, initialState);

  // Helper function to make it easier for components to update budget
  const setBudget = (budgetData) => {
    dispatch({ type: 'SET_BUDGET', payload: budgetData });
  };

  // Load data from localStorage on first render
  useEffect(() => {
    const savedData = JSON.parse(localStorage.getItem("budgetState"));
    if (savedData) {
      dispatch({ type: 'SET_BUDGET', payload: savedData });
    }
  }, []);

  return (
    <BudgetContext.Provider value={{ state, dispatch, setBudget }}>
      {children}
    </BudgetContext.Provider>
  );
}

export function useBudget() {
  const context = useContext(BudgetContext);
 
  if (!context) {
    throw new Error('useBudget must be used within a BudgetProvider');
  }
  return [context];
}