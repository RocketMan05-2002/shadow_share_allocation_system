import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useData } from '../contexts/DataContext';
import { 
  FileText, 
  Download, 
  Edit, 
  CheckCircle, 
  DollarSign, 
  Users, 
  TrendingUp,
  Shield,
  PieChart,
  BarChart3
} from 'lucide-react';

const Output = () => {
  const navigate = useNavigate();
  const { allocationData, resetData } = useData();
  const [activeTab, setActiveTab] = useState('summary');

  const results = allocationData.finalResults;
  
  if (!results) {
    navigate('/configuration');
    return null;
  }

  const handleEditConfiguration = () => {
    navigate('/configuration');
  };

  const handleInitiatePayout = () => {
    alert('Payout initiated! This would typically integrate with your payment system.');
  };

  const handleReconfigure = () => {
    resetData();
    navigate('/configuration');
  };

  const handleDownloadSummary = () => {
    const summary = generateSummaryReport();
    const blob = new Blob([summary], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'shadow-share-allocation-summary.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const generateSummaryReport = () => {
    return `
SHADOW SHARE ALLOCATION SUMMARY
Generated on: ${new Date().toLocaleString()}

FINANCIAL OVERVIEW
Total Profit: $${allocationData.profit.toLocaleString()}
Reserve Amount: $${results.reserveAmount.toLocaleString()}
Available for Distribution: $${results.availableForDistribution.toLocaleString()}
Total Shadow Share Payout: $${results.totalShadowSharePayout.toLocaleString()}

ALLOCATION DETAILS
Total Units: ${results.totalUnits.toLocaleString()}
Value per Unit: $${results.perUnitValue.toFixed(2)}
Total Employees: ${results.totalEmployees}

GRADE DISTRIBUTION
${results.gradeDistribution.map(grade => 
  `Grade ${grade.grade}: ${grade.employees} employees, ${grade.totalUnits} units, $${grade.totalPayout.toLocaleString()} total, $${grade.payoutPerEmployee.toLocaleString()} per employee`
).join('\n')}

TREASURY STATUS
Updated Treasury Reserve: $${results.treasuryReserve.toLocaleString()}
    `;
  };

  return (
    <div className="min-h-screen p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm mb-6 p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-3">
              <FileText className="w-8 h-8 text-green-600" />
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Allocation Summary</h1>
                <p className="text-gray-600">Final shadow share allocation results</p>
              </div>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleDownloadSummary}
                className="flex items-center space-x-2 px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                <Download className="w-4 h-4" />
                <span>Download Summary</span>
              </button>
              <button
                onClick={handleEditConfiguration}
                className="flex items-center space-x-2 px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                <Edit className="w-4 h-4" />
                <span>Edit Configuration</span>
              </button>
            </div>
          </div>
        </div>

        {/* Key Metrics */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <DollarSign className="w-8 h-8 text-green-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Payout</p>
                <p className="text-2xl font-bold text-green-900">
                  ${results.totalShadowSharePayout.toLocaleString()}
                </p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <Users className="w-8 h-8 text-blue-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Total Employees</p>
                <p className="text-2xl font-bold text-blue-900">{results.totalEmployees}</p>
              </div>
            </div>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm p-6">
            <div className="flex items-center">
              <TrendingUp className="w-8 h-8 text-purple-600 mr-3" />
              <div>
                <p className="text-sm text-gray-600">Value per Unit</p>
                <p className="text-2xl font-bold text-purple-900">${results.perUnitValue.toFixed(2)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Tab Navigation */}
        <div className="bg-white rounded-lg shadow-sm mb-6">
          <div className="border-b border-gray-200">
            <nav className="flex space-x-8 px-6">
              <button
                onClick={() => setActiveTab('summary')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'summary'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <PieChart className="w-4 h-4 inline mr-2" />
                Summary
              </button>
              <button
                onClick={() => setActiveTab('distribution')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'distribution'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <BarChart3 className="w-4 h-4 inline mr-2" />
                Distribution
              </button>
              <button
                onClick={() => setActiveTab('employees')}
                className={`py-4 px-2 border-b-2 font-medium text-sm ${
                  activeTab === 'employees'
                    ? 'border-indigo-500 text-indigo-600'
                    : 'border-transparent text-gray-500 hover:text-gray-700'
                }`}
              >
                <Users className="w-4 h-4 inline mr-2" />
                Employee Details
              </button>
            </nav>
          </div>

          <div className="p-6">
            {activeTab === 'summary' && (
              <div className="space-y-6">
                {/* Financial Summary */}
                <div className="bg-gray-50 rounded-lg p-6">
                  <h3 className="text-lg font-semibold text-gray-900 mb-4">Financial Breakdown</h3>
                  <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Profit:</span>
                        <span className="font-medium">${allocationData.profit.toLocaleString()}</span>
                      </div>
                    </div>
                    <div className="space-y-3">
                      <div className="flex justify-between">
                        <span className="text-gray-600">Shadow Shares Allocation:</span>
                        <span className="font-bold text-indigo-600">${results.totalShadowSharePayout.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Total Units:</span>
                        <span className="font-medium">{results.totalUnits.toLocaleString()}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600">Value per Unit:</span>
                        <span className="font-medium">${results.perUnitValue.toFixed(2)}</span>
                      </div>
                    </div>
                  </div>
                </div>

              </div>
            )}

            {activeTab === 'distribution' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Grade Distribution Details</h3>
                <div className="grid gap-4">
                  {results.gradeDistribution.map((grade) => (
                    <div key={grade.grade} className="border border-gray-200 rounded-lg p-4">
                      <div className="flex items-center justify-between mb-4">
                        <div className="flex items-center space-x-3">
                          <div className="w-12 h-12 bg-indigo-100 rounded-full flex items-center justify-center">
                            <span className="font-bold text-indigo-600 text-lg">{grade.grade}</span>
                          </div>
                          <div>
                            <h4 className="font-semibold text-gray-900">Grade {grade.grade}</h4>
                            <p className="text-sm text-gray-600">{grade.employees} employees</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-2xl font-bold text-gray-900">${grade.totalPayout.toLocaleString()}</p>
                          <p className="text-sm text-gray-600">Total payout</p>
                        </div>
                      </div>
                      
                      <div className="grid grid-cols-3 gap-4 text-sm">
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className="text-gray-600">Units per Employee</p>
                          <p className="font-semibold">{grade.units}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className="text-gray-600">Total Units</p>
                          <p className="font-semibold">{grade.totalUnits}</p>
                        </div>
                        <div className="text-center p-3 bg-gray-50 rounded">
                          <p className="text-gray-600">Payout per Employee</p>
                          <p className="font-semibold">${grade.payoutPerEmployee.toLocaleString()}</p>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {activeTab === 'employees' && (
              <div className="space-y-6">
                <h3 className="text-lg font-semibold text-gray-900">Employee Summary</h3>
                <div className="bg-gray-50 rounded-lg p-4">
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-center">
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{results.totalEmployees}</p>
                      <p className="text-sm text-gray-600">Total Employees</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">{results.totalUnits}</p>
                      <p className="text-sm text-gray-600">Total Units</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">
                        ${(results.totalShadowSharePayout / results.totalEmployees).toLocaleString()}
                      </p>
                      <p className="text-sm text-gray-600">Average per Employee</p>
                    </div>
                    <div>
                      <p className="text-2xl font-bold text-gray-900">${results.perUnitValue.toFixed(2)}</p>
                      <p className="text-sm text-gray-600">Value per Unit</p>
                    </div>
                  </div>
                </div>
                
                <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-4">
                  <p className="text-yellow-800">
                    <strong>Note:</strong> Detailed employee records would be generated from the uploaded employee data file. 
                    This would include individual employee names, IDs, allocations, and payout amounts.
                  </p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="bg-white rounded-lg shadow-sm p-6">
          <div className="flex justify-between items-center">
            <div className="flex items-center space-x-3">
              <CheckCircle className="w-6 h-6 text-green-600" />
              <span className="text-gray-900 font-medium">
                Allocation configuration complete. Ready for payout processing.
              </span>
            </div>
            <div className="flex space-x-3">
              <button
                onClick={handleReconfigure}
                className="px-6 py-3 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
              >
                Reconfigure
              </button>
              <button
                onClick={handleInitiatePayout}
                className="px-6 py-3 bg-green-600 text-white rounded-lg hover:bg-green-700 transition-colors"
              >
                Initiate Payout
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Output;