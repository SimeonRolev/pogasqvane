import React, { useState } from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Line } from 'react-chartjs-2';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  Title,
  Tooltip,
  Legend
);

const Investment = ({ initialValues = {} }) => {
  const [inputs, setInputs] = useState({
    monthlyInvestment: initialValues.monthlyInvestment || 3000,
    yearlyReturnRate: initialValues.yearlyReturnRate || 7,
    investmentMonths: initialValues.investmentMonths || 180,
    initialAmount: initialValues.initialAmount || 0
  });

  const [results, setResults] = useState(null);
  const [chartVisibility, setChartVisibility] = useState({
    balance: true,
    invested: true,
    gains: true
  });

  const toggleChartLine = (key) => {
    setChartVisibility(prev => ({
      ...prev,
      [key]: !prev[key]
    }));
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const calculateInvestment = () => {
    const monthlyRate = inputs.yearlyReturnRate / 100 / 12;
    const totalMonths = inputs.investmentMonths;
    let balance = inputs.initialAmount;
    let totalInvested = inputs.initialAmount;
    let monthlyDetails = [];
    let yearlyDetails = [];

    for (let month = 1; month <= totalMonths; month++) {
      // Add monthly investment
      balance += inputs.monthlyInvestment;
      totalInvested += inputs.monthlyInvestment;
      
      // Apply monthly interest
      balance = balance * (1 + monthlyRate);
      
      // Save details for each month for the chart
      monthlyDetails.push({
        month,
        balance: Math.round(balance),
        totalInvested: Math.round(totalInvested),
        totalGains: Math.round(balance - totalInvested)
      });
      
      // Save details for each year (every 12 months) for summary
      if (month % 12 === 0) {
        const year = month / 12;
        yearlyDetails.push({
          year,
          balance: Math.round(balance),
          totalInvested: Math.round(totalInvested),
          totalGains: Math.round(balance - totalInvested)
        });
      }
    }

    // Calculate final results
    const finalBalance = Math.round(balance);
    const totalGains = Math.round(finalBalance - totalInvested);
    const totalReturn = ((finalBalance / totalInvested - 1) * 100);

    setResults({
      finalBalance,
      totalInvested: Math.round(totalInvested),
      totalGains,
      totalReturn,
      yearlyDetails: yearlyDetails,
      monthlyDetails: monthlyDetails
    });
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('bg-BG', {
      style: 'currency',
      currency: 'BGN'
    }).format(num);
  };

  return (
    <div style={{ padding: '10px', maxWidth: '100%', fontFamily: 'Arial, sans-serif', fontSize: '14px' }}>
      <h2 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Калкулатор за инвестиции</h2>
      
      <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Параметри на инвестицията</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '3px', fontWeight: 'bold', fontSize: '13px' }}>
              Начална сума (лв):
            </label>
            <input
              type="number"
              name="initialAmount"
              value={inputs.initialAmount}
              onChange={handleInputChange}
              style={{ width: '80%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '3px', fontWeight: 'bold', fontSize: '13px' }}>
              Месечна инвестиция (лв):
            </label>
            <input
              type="number"
              name="monthlyInvestment"
              value={inputs.monthlyInvestment}
              onChange={handleInputChange}
              style={{ width: '80%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '3px', fontWeight: 'bold', fontSize: '13px' }}>
              Годишна доходност (%):
            </label>
            <input
              type="number"
              step="0.1"
              name="yearlyReturnRate"
              value={inputs.yearlyReturnRate}
              onChange={handleInputChange}
              style={{ width: '80%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '3px', fontWeight: 'bold', fontSize: '13px' }}>
              Период на инвестиране (месеци):
            </label>
            <input
              type="number"
              name="investmentMonths"
              value={inputs.investmentMonths}
              onChange={handleInputChange}
              style={{ width: '80%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
            />
          </div>
        </div>

        <button
          onClick={calculateInvestment}
          style={{
            marginTop: '15px',
            padding: '8px 16px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Изчисли инвестицията
        </button>
      </div>

      {results && (
        <div>
          <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px' }}>
            <h4 style={{ margin: '0 0 15px 0', fontSize: '15px' }}>Ръст на инвестицията по месеци</h4>
            
            {/* Бутони за контрол на видимостта */}
            <div style={{ marginBottom: '15px' }}>
              <button
                onClick={() => toggleChartLine('balance')}
                style={{
                  padding: '4px 8px',
                  margin: '2px',
                  fontSize: '11px',
                  border: '1px solid #ccc',
                  borderRadius: '3px',
                  backgroundColor: chartVisibility.balance ? 'rgb(54, 162, 235)' : '#f8f9fa',
                  color: chartVisibility.balance ? 'white' : '#333',
                  cursor: 'pointer'
                }}
              >
                Стойност на портфейла
              </button>
              <button
                onClick={() => toggleChartLine('invested')}
                style={{
                  padding: '4px 8px',
                  margin: '2px',
                  fontSize: '11px',
                  border: '1px solid #ccc',
                  borderRadius: '3px',
                  backgroundColor: chartVisibility.invested ? 'rgb(255, 99, 132)' : '#f8f9fa',
                  color: chartVisibility.invested ? 'white' : '#333',
                  cursor: 'pointer'
                }}
              >
                Инвестирано
              </button>
              <button
                onClick={() => toggleChartLine('gains')}
                style={{
                  padding: '4px 8px',
                  margin: '2px',
                  fontSize: '11px',
                  border: '1px solid #ccc',
                  borderRadius: '3px',
                  backgroundColor: chartVisibility.gains ? 'rgb(75, 192, 192)' : '#f8f9fa',
                  color: chartVisibility.gains ? 'white' : '#333',
                  cursor: 'pointer'
                }}
              >
                Печалби
              </button>
            </div>

            <div style={{ height: '400px' }}>
              <Line 
                data={{
                  labels: results.monthlyDetails.map(detail => detail.month),
                  datasets: [
                    ...(chartVisibility.balance ? [{
                      label: 'Стойност на портфейла',
                      data: results.monthlyDetails.map(d => d.balance),
                      borderColor: 'rgb(54, 162, 235)',
                      backgroundColor: 'rgba(54, 162, 235, 0.2)',
                      tension: 0.1
                    }] : []),
                    ...(chartVisibility.invested ? [{
                      label: 'Инвестирано',
                      data: results.monthlyDetails.map(d => d.totalInvested),
                      borderColor: 'rgb(255, 99, 132)',
                      backgroundColor: 'rgba(255, 99, 132, 0.2)',
                      tension: 0.1
                    }] : []),
                    ...(chartVisibility.gains ? [{
                      label: 'Печалби',
                      data: results.monthlyDetails.map(d => d.totalGains),
                      borderColor: 'rgb(75, 192, 192)',
                      backgroundColor: 'rgba(75, 192, 192, 0.2)',
                      tension: 0.1
                    }] : [])
                  ]
                }} 
                options={{
                  responsive: true,
                  maintainAspectRatio: false,
                  plugins: {
                    legend: {
                      display: false
                    },
                    title: {
                      display: true,
                      text: 'Ръст на инвестицията по време',
                      font: {
                        size: 14
                      }
                    },
                    tooltip: {
                      callbacks: {
                        label: function(context) {
                          return context.dataset.label + ': ' + formatCurrency(context.parsed.y);
                        }
                      }
                    }
                  },
                  scales: {
                    x: {
                      display: true,
                      title: {
                        display: true,
                        text: 'Месец'
                      }
                    },
                    y: {
                      display: true,
                      title: {
                        display: true,
                        text: 'Сума (лв)'
                      },
                      ticks: {
                        callback: function(value) {
                          return new Intl.NumberFormat('bg-BG', {
                            style: 'decimal',
                            minimumFractionDigits: 0,
                            maximumFractionDigits: 0
                          }).format(value) + ' лв';
                        }
                      }
                    }
                  }
                }}
              />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investment;