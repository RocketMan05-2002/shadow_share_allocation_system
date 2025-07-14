import React, { createContext, useContext, useState } from 'react';

const initialData = {
  salaryGrades: [
    { grade: 'A', units: 0, unitValue: 0, employees: 0 },
    { grade: 'B', units: 0, unitValue: 0, employees: 0 },
    { grade: 'C', units: 0, unitValue: 0, employees: 0 },
    { grade: 'D', units: 0, unitValue: 0, employees: 0 },
    { grade: 'E', units: 0, unitValue: 0, employees: 0 }
  ],
  employeeData: null,
  totalPayout: 0,
  treasuryReserve: 0,
  profit: 0,
  reserveRatio: 0,
  shadowSharesBasePercent: 0,
  allocationSummary: '',
  finalResults: null
};

const DataContext = createContext();

export const useData = () => {
  const context = useContext(DataContext);
  if (context === undefined) {
    throw new Error('useData must be used within a DataProvider');
  }
  return context;
};

export const DataProvider = ({ children }) => {
  const [allocationData, setAllocationData] = useState(initialData);

  const updateAllocationData = (data) => {
    setAllocationData(prev => ({ ...prev, ...data }));
  };

  const resetData = () => {
    setAllocationData(initialData);
  };

  const calculatePhantomAllocation = () => {
    const { salaryGrades, profit, reserveRatio, shadowSharesBasePercent } = allocationData;
    
    // Calculate total units and employees
    const totalUnits = salaryGrades.reduce((sum, grade) => sum + grade.units * grade.employees, 0);
    const totalEmployees = salaryGrades.reduce((sum, grade) => sum + grade.employees, 0);
    
    // Calculate shadow shares allocation
    const shadowSharesAllocation = profit * (shadowSharesBasePercent / 100);
    
    // Calculate per unit value
    const perUnitValue = totalUnits > 0 ? shadowSharesAllocation / totalUnits : 0;
    
    // Calculate distribution per grade
    const gradeDistribution = salaryGrades.map(grade => ({
      ...grade,
      totalUnits: grade.units * grade.employees,
      totalPayout: grade.units * grade.employees * perUnitValue,
      payoutPerEmployee: grade.units * perUnitValue
    }));
    
    const results = {
      totalUnits,
      totalEmployees,
      perUnitValue,
      totalShadowSharePayout: shadowSharesAllocation,
      gradeDistribution,
      treasuryReserve: allocationData.treasuryReserve || 0
    };
    
    return results;
  };

  return (
    <DataContext.Provider value={{ 
      allocationData, 
      updateAllocationData, 
      resetData, 
      calculatePhantomAllocation 
    }}>
      {children}
    </DataContext.Provider>
  );
};