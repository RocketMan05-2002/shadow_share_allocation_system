import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { Brain, ArrowRight, DollarSign, TrendingUp, Shield, Percent } from 'lucide-react';

const Recommendation = () => {
  const navigate = useNavigate();
  const { allocationData, updateAllocationData, calculatePhantomAllocation } = useData();
  
  const [formData, setFormData] = useState({
    treasuryReserve: allocationData.treasuryReserve || 0,
    profit: allocationData.profit || 0,
    reserveRatio: allocationData.reserveRatio || 10,
    shadowSharesBasePercent: allocationData.shadowSharesBasePercent || 15
  });

  const handleInputChange = (field, value) => {
    setFormData(prev => ({
      ...prev,
      [field]: parseFloat(value) || 0
    }));
  };

  const handleContinue = () => {
    // Update context with form data
    updateAllocationData(formData);
    
    // Calculate phantom allocation
    const results = calculatePhantomAllocation();
    updateAllocationData({ finalResults: results });
    
    // Navigate to output page
    navigate('/output');
  };

  const handleBack = () => {
    navigate('/configuration');
  };

  // Calculate preview values
  const reserveAmount = formData.profit * (formData.reserveRatio / 100);
  const availableForDistribution = formData.profit - reserveAmount;
  const shadowSharesAllocation = availableForDistribution * (formData.shadowSharesBasePercent / 100);
  
  const totalUnits = allocationData.salaryGrades.reduce((sum, grade) => 
    sum + grade.units * grade.employees, 0
  );
  const valuePerUnit = totalUnits > 0 ? shadowSharesAllocation / totalUnits : 0;

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <div className="flex items-center space-x-3">
            <Brain className="w-8 h-8 text-purple-600" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Phantom Allocation Assistant</h1>
              <p className="text-gray-600">Configure your shadow share allocation parameters</p>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Parameters */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Input Parameters</h2>
            
            <div className="space-y-6">
              {/* Treasury Reserve */}
              <div className="bg-blue-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Shield className="w-5 h-5 text-blue-600 mr-2" />
                  <label className="text-sm font-medium text-blue-900">Treasury Reserve ($)</label>
                </div>
                <input
                  type="number"
                  value={formData.treasuryReserve}
                  onChange={(e) => handleInputChange('treasuryReserve', e.target.value)}
                  className="w-full px-3 py-2 border border-blue-200 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                  placeholder="Enter treasury reserve amount"
                />
                <p className="text-xs text-blue-600 mt-1">Current available treasury funds</p>
              </div>

              {/* Profit */}
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <TrendingUp className="w-5 h-5 text-green-600 mr-2" />
                  <label className="text-sm font-medium text-green-900">Profit ($)</label>
                </div>
                <input
                  type="number"
                  value={formData.profit}
                  onChange={(e) => handleInputChange('profit', e.target.value)}
                  className="w-full px-3 py-2 border border-green-200 rounded-md focus:ring-2 focus:ring-green-500 focus:border-green-500"
                  placeholder="Enter current profit"
                />
                <p className="text-xs text-green-600 mt-1">Total profit available for distribution</p>
              </div>

              {/* Reserve Ratio */}
              <div className="bg-yellow-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <Percent className="w-5 h-5 text-yellow-600 mr-2" />
                  <label className="text-sm font-medium text-yellow-900">Reserve Ratio (%)</label>
                </div>
                <input
                  type="number"
                  value={formData.reserveRatio}
                  onChange={(e) => handleInputChange('reserveRatio', e.target.value)}
                  className="w-full px-3 py-2 border border-yellow-200 rounded-md focus:ring-2 focus:ring-yellow-500 focus:border-yellow-500"
                  placeholder="Enter reserve ratio"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-yellow-600 mt-1">
                  Percentage of profit to keep in reserve (${reserveAmount.toLocaleString()})
                </p>
              </div>

              {/* Shadow Shares Base Percent */}
              <div className="bg-purple-50 rounded-lg p-4">
                <div className="flex items-center mb-3">
                  <DollarSign className="w-5 h-5 text-purple-600 mr-2" />
                  <label className="text-sm font-medium text-purple-900">Shadow Shares Base Percent (%)</label>
                </div>
                <input
                  type="number"
                  value={formData.shadowSharesBasePercent}
                  onChange={(e) => handleInputChange('shadowSharesBasePercent', e.target.value)}
                  className="w-full px-3 py-2 border border-purple-200 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-purple-500"
                  placeholder="Enter shadow shares percentage"
                  min="0"
                  max="100"
                />
                <p className="text-xs text-purple-600 mt-1">
                  Percentage of available funds for shadow shares
                </p>
              </div>
            </div>
          </div>

          {/* Live Preview */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Live Preview</h2>
            
            <div className="space-y-4">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 gap-4">
                <div className="bg-indigo-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-indigo-600 font-medium">Total Units</p>
                  <p className="text-2xl font-bold text-indigo-900">{totalUnits.toLocaleString()}</p>
                </div>
                <div className="bg-green-50 rounded-lg p-4 text-center">
                  <p className="text-sm text-green-600 font-medium">Value per Unit</p>
                  <p className="text-2xl font-bold text-green-900">${valuePerUnit.toFixed(2)}</p>
                </div>
              </div>

              {/* Financial Breakdown */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-3">Financial Breakdown</h3>
                <div className="space-y-2 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600">Total Profit:</span>
                    <span className="font-medium">${formData.profit.toLocaleString()}</span>
                  </div>
                  <div className="flex justify-between border-t pt-2">
                    <span className="text-gray-600">Shadow Shares ({formData.shadowSharesBasePercent}%):</span>
                    <span className="font-bold text-indigo-600">${shadowSharesAllocation.toLocaleString()}</span>
                  </div>
                </div>
              </div>

              {/* Grade Distribution Preview */}
              <div className="bg-gray-50 rounded-lg p-4">
                <h3 className="font-medium text-gray-800 mb-3">Expected Distribution by Grade</h3>
                <div className="space-y-2">
                  {allocationData.salaryGrades.map((grade) => {
                    const gradeUnits = grade.units * grade.employees;
                    const gradePayout = gradeUnits * valuePerUnit;
                    return (
                      <div key={grade.grade} className="flex justify-between items-center text-sm">
                        <span className="text-gray-600">Grade {grade.grade}:</span>
                        <div className="text-right">
                          <div className="font-medium">${gradePayout.toLocaleString()}</div>
                          <div className="text-xs text-gray-500">
                            {gradeUnits} units × ${valuePerUnit.toFixed(2)}
                          </div>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* AI Generated Allocation Summary */}
        <div className="bg-white rounded-lg shadow-sm p-6 mt-6">
          <div className="bg-blue-50 rounded-lg p-6">
            <h3 className="text-lg font-semibold text-blue-900 mb-4">Allocation Summary (AI Generated)</h3>
            <p className="text-blue-800 leading-relaxed">
              Based on the configured parameters, the shadow share allocation has been optimized for fairness and financial sustainability. 
              The {formData.reserveRatio}% reserve ratio ensures adequate treasury reserves while the {formData.shadowSharesBasePercent}% 
              allocation to shadow shares provides meaningful employee participation in company success. 
              The distribution favors higher salary grades while maintaining proportional equity across all employee levels.
            </p>
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-between mt-6">
          <button
            onClick={handleBack}
            className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
          >
            Back to Configuration
          </button>
          <button
            onClick={handleContinue}
            className="px-6 py-3 bg-indigo-600 text-white rounded-lg hover:bg-indigo-700 transition-colors flex items-center space-x-2"
          >
            <span>Continue with Recommendation</span>
            <ArrowRight className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Recommendation;