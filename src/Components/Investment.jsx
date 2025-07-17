import React, { useState } from 'react';

const Investment = () => {
  const [inputs, setInputs] = useState({
    monthlyInvestment: 3000,
    yearlyReturnRate: 5,
    investmentYears: 15,
    initialAmount: 0
  });

  const [results, setResults] = useState(null);

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setInputs(prev => ({
      ...prev,
      [name]: parseFloat(value) || 0
    }));
  };

  const calculateInvestment = () => {
    const monthlyRate = inputs.yearlyReturnRate / 100 / 12;
    const totalMonths = inputs.investmentYears * 12;
    let balance = inputs.initialAmount;
    let totalInvested = inputs.initialAmount;
    let monthlyDetails = [];

    for (let month = 1; month <= totalMonths; month++) {
      // Add monthly investment
      balance += inputs.monthlyInvestment;
      totalInvested += inputs.monthlyInvestment;
      
      // Apply monthly interest
      balance = balance * (1 + monthlyRate);
      
      // Save details for each year (every 12 months)
      if (month % 12 === 0) {
        const year = month / 12;
        monthlyDetails.push({
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
      yearlyDetails: monthlyDetails
    });
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('bg-BG', {
      style: 'currency',
      currency: 'BGN'
    }).format(num);
  };

  return (
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Калкулатор за инвестиции</h1>
      
      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Параметри на инвестицията</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Начална сума (лв):
            </label>
            <input
              type="number"
              name="initialAmount"
              value={inputs.initialAmount}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Месечна инвестиция (лв):
            </label>
            <input
              type="number"
              name="monthlyInvestment"
              value={inputs.monthlyInvestment}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Годишна доходност (%):
            </label>
            <input
              type="number"
              step="0.1"
              name="yearlyReturnRate"
              value={inputs.yearlyReturnRate}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Период на инвестиране (години):
            </label>
            <input
              type="number"
              name="investmentYears"
              value={inputs.investmentYears}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
        </div>

        <button
          onClick={calculateInvestment}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Изчисли инвестицията
        </button>
      </div>

      {results && (
        <div>
          <div style={{ backgroundColor: '#e8f5e8', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h2>Резултати от инвестицията</h2>
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr 1fr', gap: '20px' }}>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', margin: '0', color: '#666' }}>Общо инвестирано</p>
                <p style={{ fontSize: '24px', margin: '5px 0', fontWeight: 'bold', color: '#007bff' }}>
                  {formatCurrency(results.totalInvested)}
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', margin: '0', color: '#666' }}>Финална стойност</p>
                <p style={{ fontSize: '24px', margin: '5px 0', fontWeight: 'bold', color: '#28a745' }}>
                  {formatCurrency(results.finalBalance)}
                </p>
              </div>
              <div style={{ textAlign: 'center' }}>
                <p style={{ fontSize: '14px', margin: '0', color: '#666' }}>Общи печалби</p>
                <p style={{ fontSize: '24px', margin: '5px 0', fontWeight: 'bold', color: '#dc3545' }}>
                  {formatCurrency(results.totalGains)}
                </p>
              </div>
            </div>
            <div style={{ textAlign: 'center', marginTop: '15px' }}>
              <p style={{ fontSize: '16px', margin: '0' }}>
                <strong>Общо възвръщаемост: {results.totalReturn.toFixed(1)}%</strong>
              </p>
            </div>
          </div>

          <div style={{ backgroundColor: '#f8f9fa', padding: '20px', borderRadius: '8px' }}>
            <h3>Годишен ръст</h3>
            <div style={{ maxHeight: '400px', overflowY: 'auto' }}>
              <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                <thead>
                  <tr style={{ backgroundColor: '#007bff', color: 'white' }}>
                    <th style={{ padding: '10px', textAlign: 'center', border: '1px solid #ddd' }}>Година</th>
                    <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>Инвестирано</th>
                    <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>Стойност</th>
                    <th style={{ padding: '10px', textAlign: 'right', border: '1px solid #ddd' }}>Печалба</th>
                  </tr>
                </thead>
                <tbody>
                  {results.yearlyDetails.map((detail, index) => (
                    <tr key={detail.year} style={{ backgroundColor: index % 2 === 0 ? '#ffffff' : '#f8f9fa' }}>
                      <td style={{ padding: '8px', textAlign: 'center', border: '1px solid #ddd' }}>
                        {detail.year}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ddd' }}>
                        {formatCurrency(detail.totalInvested)}
                      </td>
                      <td style={{ padding: '8px', textAlign: 'right', border: '1px solid #ddd', fontWeight: 'bold' }}>
                        {formatCurrency(detail.balance)}
                      </td>
                      <td style={{ 
                        padding: '8px', 
                        textAlign: 'right', 
                        border: '1px solid #ddd',
                        color: detail.totalGains >= 0 ? '#28a745' : '#dc3545',
                        fontWeight: 'bold'
                      }}>
                        {formatCurrency(detail.totalGains)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Investment;