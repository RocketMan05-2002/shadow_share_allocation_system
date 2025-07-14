import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';
import { useData } from '../contexts/DataContext';
import { Settings, Upload, Calculator, LogOut, DollarSign, Users } from 'lucide-react';

const Configuration = () => {
  const navigate = useNavigate();
  const { logout, userEmail } = useAuth();
  const { allocationData, updateAllocationData } = useData();
  const [localGrades, setLocalGrades] = useState(allocationData.salaryGrades);
  const [valuePerUnit, setValuePerUnit] = useState(0);
  const [file, setFile] = useState(null);

  useEffect(() => {
    // Calculate totals when grades change
    const updatedGrades = localGrades.map(grade => ({
      ...grade,
      unitValue: valuePerUnit
    }));
    const totalPayout = updatedGrades.reduce((sum, grade) => 
      sum + (grade.units * grade.unitValue * grade.employees), 0
    );
    updateAllocationData({ salaryGrades: updatedGrades, totalPayout });
  }, [localGrades, valuePerUnit, updateAllocationData]);

  const handleGradeChange = (index, field, value) => {
    const newGrades = [...localGrades];
    if (field === 'units') {
      newGrades[index][field] = parseFloat(value) || 0;
    }
    setLocalGrades(newGrades);
  };

  const handleFileUpload = (e) => {
    const uploadedFile = e.target.files[0];
    if (uploadedFile) {
      setFile(uploadedFile);
      updateAllocationData({ employeeData: uploadedFile });
      
      // Simulate file parsing to update employee counts
      const newGrades = [...localGrades];
      newGrades.forEach((grade, index) => {
        newGrades[index].employees = Math.floor(Math.random() * 10) + 1; // Mock data
      });
      setLocalGrades(newGrades);
    }
  };

  const handleGetRecommendation = () => {
    window.location.href = '/recommendation';
  };

  const handleGetOutput = () => {
    // Calculate phantom allocation with current data
    const results = calculatePhantomAllocation();
    updateAllocationData({ finalResults: results });
    window.location.href = '/output';
  };

  const handleLogout = () => {
    logout();
    navigate('/');
  };

  const totalExpectedPayout = localGrades.reduce((sum, grade) => 
    sum + (grade.units * grade.unitValue * grade.employees), 0
  );

  const totalEmployees = localGrades.reduce((sum, grade) => sum + grade.employees, 0);

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <Settings className="w-8 h-8 text-indigo-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Configuration Dashboard</h1>
                <p className="text-gray-600">Welcome back, {userEmail}</p>
              </div>
            </div>
            <button
              onClick={handleLogout}
              className="flex items-center space-x-2 px-4 py-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
            >
              <LogOut className="w-4 h-4" />
              <span>Logout</span>
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Input Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Input Configuration</h2>
            
            {/* Salary Grades */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Salary Grade Configuration</h3>
              <div className="space-y-4">
                {localGrades.map((grade, index) => (
                  <div key={grade.grade} className="bg-gray-50 rounded-lg p-4">
                    <div className="flex items-center justify-between mb-3">
                      <h4 className="font-medium text-gray-800">Grade {grade.grade}</h4>
                      <div className="text-sm text-gray-600">
                        {grade.employees} employees
                      </div>
                    </div>
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="block text-sm font-medium text-gray-700 mb-1">
                          Units per Employee
                        </label>
                        <input
                          type="number"
                          value={grade.units}
                          onChange={(e) => handleGradeChange(index, 'units', e.target.value)}
                          className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                          placeholder="0"
                        />
                      </div>
                    </div>
                  </div>
                ))}
              </div>
              
              {/* Single Value per Unit Input */}
              <div className="mt-4">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Value per Unit ($ - applies to all grades)
                </label>
                <input
                  type="number"
                  value={valuePerUnit}
                  onChange={(e) => setValuePerUnit(parseFloat(e.target.value) || 0)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  placeholder="0.00"
                  step="0.01"
                />
              </div>
            </div>

            {/* File Upload */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Employee Data</h3>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-indigo-400 transition-colors">
                <Upload className="w-12 h-12 text-gray-400 mx-auto mb-3" />
                <div className="mb-3">
                  <label htmlFor="file-upload" className="cursor-pointer">
                    <span className="text-indigo-600 font-medium hover:text-indigo-500">
                      Click to upload
                    </span>
                    <span className="text-gray-600"> or drag and drop</span>
                  </label>
                  <input
                    id="file-upload"
                    type="file"
                    accept=".xlsx,.xls,.csv"
                    onChange={handleFileUpload}
                    className="hidden"
                  />
                </div>
                <p className="text-sm text-gray-500">Excel files (.xlsx, .xls) or CSV up to 10MB</p>
                {file && (
                  <p className="text-sm text-green-600 mt-2">✓ {file.name} uploaded</p>
                )}
              </div>
            </div>
          </div>

          {/* Output Section */}
          <div className="bg-white rounded-lg shadow-sm p-6">
            <h2 className="text-xl font-semibold text-gray-900 mb-6">Current Configuration Summary</h2>
            
            {/* Summary Cards */}
            <div className="grid grid-cols-2 gap-4 mb-6">
              <div className="bg-indigo-50 rounded-lg p-4">
                <div className="flex items-center">
                  <DollarSign className="w-8 h-8 text-indigo-600 mr-3" />
                  <div>
                    <p className="text-sm text-indigo-600 font-medium">Total Expected Payout</p>
                    <p className="text-2xl font-bold text-indigo-900">
                      ${totalExpectedPayout.toLocaleString()}
                    </p>
                  </div>
                </div>
              </div>
              
              <div className="bg-green-50 rounded-lg p-4">
                <div className="flex items-center">
                  <Users className="w-8 h-8 text-green-600 mr-3" />
                  <div>
                    <p className="text-sm text-green-600 font-medium">Total Employees</p>
                    <p className="text-2xl font-bold text-green-900">{totalEmployees}</p>
                  </div>
                </div>
              </div>
            </div>

            {/* Grade Distribution */}
            <div className="mb-6">
              <h3 className="text-lg font-medium text-gray-800 mb-4">Payout Distribution by Grade</h3>
              <div className="space-y-3">
                {localGrades.map((grade) => {
                  const gradePayout = grade.units * grade.unitValue * grade.employees;
                  return (
                    <div key={grade.grade} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center space-x-3">
                        <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center">
                          <span className="font-bold text-indigo-600">{grade.grade}</span>
                        </div>
                        <div>
                          <p className="font-medium text-gray-800">Grade {grade.grade}</p>
                          <p className="text-sm text-gray-600">
                            {grade.employees} employees × {grade.units} units × ${grade.unitValue}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <p className="font-bold text-gray-900">${gradePayout.toLocaleString()}</p>
                        <p className="text-sm text-gray-600">
                          ${grade.employees > 0 ? (gradePayout / grade.employees).toLocaleString() : '0'} per employee
                        </p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Action Buttons */}
            <div className="space-y-3">
              <button
                onClick={handleGetOutput}
                className="w-full bg-green-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-green-700 focus:ring-2 focus:ring-green-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
              >
                <Calculator className="w-5 h-5" />
                <span>Get Output</span>
              </button>
              
              <button
                onClick={handleGetRecommendation}
                className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 transition-colors flex items-center justify-center space-x-2"
              >
                <Calculator className="w-5 h-5" />
                <span>Get Recommendation</span>
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Configuration;