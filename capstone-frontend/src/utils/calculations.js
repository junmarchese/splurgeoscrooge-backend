export const calculateAmounts = (income, needs, wants, savings) => {
    if (needs + wants + savings !== 100) {
      alert('Total must add up to 100%');
      return null;
    }
    if (savings < 5) {
      alert('Savings must not be less than 5%');
      return null;
    }
    return {
      needsAmount: (needs / 100) * income,
      wantsAmount: (wants / 100) * income,
      savingsAmount: (savings / 100) * income,
    };
  };
  