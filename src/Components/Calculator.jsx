import React, { useState } from 'react';
import { generateAnnuitySchedule, monthlyPrepay } from '../utils/utils.js';
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

const Calculator = () => {
  const [inputs, setInputs] = useState({
    principal: 111000,
    periodYears: 15,
    apr: 5,
    prepaymentAmount: 3000
  });

  const [results, setResults] = useState(null);
  const [chartVisibility, setChartVisibility] = useState({
    paymentsWithout: true,
    paymentsWith: true,
    interestWithout: true,
    interestWith: true,
    prepayments: false
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

  const calculateResults = () => {
    const periodMonths = inputs.periodYears * 12;
    const originalSchedule = generateAnnuitySchedule(inputs.principal, periodMonths, inputs.apr);
    
    const withoutPrepaymentArray = monthlyPrepay(originalSchedule, 0, inputs.apr);
    const withPrepaymentArray = monthlyPrepay(originalSchedule, inputs.prepaymentAmount, inputs.apr);

    setResults({
      withoutPrepayment: withoutPrepaymentArray[withoutPrepaymentArray.length - 1],
      withPrepayment: withPrepaymentArray[withPrepaymentArray.length - 1],
      monthlyPayment: originalSchedule[0]?.payment || 0,
      originalSchedule,
      withoutPrepaymentChart: withoutPrepaymentArray,
      withPrepaymentChart: withPrepaymentArray
    });
  };

  const formatNumber = (num) => {
    return new Intl.NumberFormat('bg-BG', {
      style: 'decimal',
      minimumFractionDigits: 0,
      maximumFractionDigits: 0
    }).format(num);
  };

  const formatCurrency = (num) => {
    return new Intl.NumberFormat('bg-BG', {
      style: 'currency',
      currency: 'BGN'
    }).format(num);
  };

  return (
    <div style={{ padding: '10px', maxWidth: '100%', fontFamily: 'Arial, sans-serif', fontSize: '14px' }}>
      <h2 style={{ margin: '0 0 15px 0', fontSize: '18px' }}>Калкулатор за предсрочно погасяване на заем</h2>
      
      <div style={{ backgroundColor: '#f5f5f5', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
        <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Параметри на заема</h3>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '3px', fontWeight: 'bold', fontSize: '13px' }}>
              Размер на заема (лв):
            </label>
            <input
              type="number"
              name="principal"
              value={inputs.principal}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '3px', fontWeight: 'bold', fontSize: '13px' }}>
              Срок (години):
            </label>
            <input
              type="number"
              name="periodYears"
              value={inputs.periodYears}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '3px', fontWeight: 'bold', fontSize: '13px' }}>
              ГПР (%):
            </label>
            <input
              type="number"
              step="0.1"
              name="apr"
              value={inputs.apr}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '3px', fontWeight: 'bold', fontSize: '13px' }}>
              Месечно предсрочно погасяване (лв):
            </label>
            <input
              type="number"
              name="prepaymentAmount"
              value={inputs.prepaymentAmount}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '6px', border: '1px solid #ccc', borderRadius: '4px', fontSize: '13px' }}
            />
          </div>
        </div>

        <button
          onClick={calculateResults}
          style={{
            marginTop: '15px',
            padding: '8px 16px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '14px',
            fontWeight: 'bold'
          }}
        >
          Изчисли
        </button>
      </div>

      {results && (
        <div>
          <div style={{ backgroundColor: '#e8f5e8', padding: '15px', borderRadius: '6px', marginBottom: '15px' }}>
            <h3 style={{ margin: '0 0 10px 0', fontSize: '16px' }}>Основни данни</h3>
            <p style={{ margin: '5px 0', fontSize: '13px' }}><strong>Месечна вноска:</strong> {formatCurrency(results.monthlyPayment)}</p>
            <p style={{ margin: '5px 0', fontSize: '13px' }}><strong>Общо месеци без предсрочно погасяване:</strong> {formatNumber(results.withoutPrepayment.months)}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
            <div style={{ backgroundColor: '#fff3cd', padding: '15px', borderRadius: '6px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '15px' }}>Без предсрочно погасяване</h4>
              <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Общо плащания:</strong> {formatCurrency(results.withoutPrepayment.payments)}</p>
              <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Общо лихви:</strong> {formatCurrency(results.withoutPrepayment.interest)}</p>
              <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Брой месеци:</strong> {formatNumber(results.withoutPrepayment.months)}</p>
              <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Срок:</strong> {formatNumber(results.withoutPrepayment.months / 12)} години</p>
            </div>

            <div style={{ backgroundColor: '#d1ecf1', padding: '15px', borderRadius: '6px' }}>
              <h4 style={{ margin: '0 0 10px 0', fontSize: '15px' }}>С предсрочно погасяване</h4>
              <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Общо плащания:</strong> {formatCurrency(results.withPrepayment.payments)}</p>
              <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Общо лихви:</strong> {formatCurrency(results.withPrepayment.interest)}</p>
              <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Брой месеци:</strong> {formatNumber(results.withPrepayment.months)}</p>
              <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Срок:</strong> {formatNumber(Math.round(results.withPrepayment.months / 12 * 10) / 10)} години</p>
              <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Предсрочни плащания:</strong> {formatCurrency(results.withPrepayment.prepayments)}</p>
            </div>
          </div>

          <div style={{ backgroundColor: '#d4edda', padding: '15px', borderRadius: '6px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '15px' }}>Икономии от предсрочното погасяване</h4>
            <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Спестени лихви:</strong> {formatCurrency(results.withoutPrepayment.interest - results.withPrepayment.interest)}</p>
            <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Спестено време:</strong> {formatNumber(results.withoutPrepayment.months - results.withPrepayment.months)} месеца 
               ({formatNumber(Math.round((results.withoutPrepayment.months - results.withPrepayment.months) / 12 * 10) / 10)} години)</p>
            <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Общо спестени разходи:</strong> {formatCurrency(results.withoutPrepayment.payments - results.withPrepayment.payments)}</p>
          </div>

          {/* Графика */}
          {results.withoutPrepaymentChart && results.withPrepaymentChart && (
            <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '6px', marginTop: '15px' }}>
              <h4 style={{ margin: '0 0 15px 0', fontSize: '15px' }}>Графика на кумулативните плащания по месеци</h4>
              
              {/* Бутони за контрол на видимостта */}
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px', marginBottom: '15px' }}>
                <div>
                  <h5 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 'bold' }}>Без предсрочно погасяване:</h5>
                  <button
                    onClick={() => toggleChartLine('paymentsWithout')}
                    style={{
                      padding: '4px 8px',
                      margin: '2px',
                      fontSize: '11px',
                      border: '1px solid #ccc',
                      borderRadius: '3px',
                      backgroundColor: chartVisibility.paymentsWithout ? 'rgb(255, 99, 132)' : '#f8f9fa',
                      color: chartVisibility.paymentsWithout ? 'white' : '#333',
                      cursor: 'pointer'
                    }}
                  >
                    Общо плащания
                  </button>
                  <button
                    onClick={() => toggleChartLine('interestWithout')}
                    style={{
                      padding: '4px 8px',
                      margin: '2px',
                      fontSize: '11px',
                      border: '1px solid #ccc',
                      borderRadius: '3px',
                      backgroundColor: chartVisibility.interestWithout ? 'rgb(255, 206, 86)' : '#f8f9fa',
                      color: chartVisibility.interestWithout ? 'white' : '#333',
                      cursor: 'pointer'
                    }}
                  >
                    Лихви
                  </button>
                </div>
                
                <div>
                  <h5 style={{ margin: '0 0 10px 0', fontSize: '13px', fontWeight: 'bold' }}>С предсрочно погасяване:</h5>
                  <button
                    onClick={() => toggleChartLine('paymentsWith')}
                    style={{
                      padding: '4px 8px',
                      margin: '2px',
                      fontSize: '11px',
                      border: '1px solid #ccc',
                      borderRadius: '3px',
                      backgroundColor: chartVisibility.paymentsWith ? 'rgb(54, 162, 235)' : '#f8f9fa',
                      color: chartVisibility.paymentsWith ? 'white' : '#333',
                      cursor: 'pointer'
                    }}
                  >
                    Общо плащания
                  </button>
                  <button
                    onClick={() => toggleChartLine('interestWith')}
                    style={{
                      padding: '4px 8px',
                      margin: '2px',
                      fontSize: '11px',
                      border: '1px solid #ccc',
                      borderRadius: '3px',
                      backgroundColor: chartVisibility.interestWith ? 'rgb(75, 192, 192)' : '#f8f9fa',
                      color: chartVisibility.interestWith ? 'white' : '#333',
                      cursor: 'pointer'
                    }}
                  >
                    Лихви
                  </button>
                  <button
                    onClick={() => toggleChartLine('prepayments')}
                    style={{
                      padding: '4px 8px',
                      margin: '2px',
                      fontSize: '11px',
                      border: '1px solid #ccc',
                      borderRadius: '3px',
                      backgroundColor: chartVisibility.prepayments ? 'rgb(153, 102, 255)' : '#f8f9fa',
                      color: chartVisibility.prepayments ? 'white' : '#333',
                      cursor: 'pointer'
                    }}
                  >
                    Предсрочни плащания
                  </button>
                </div>
              </div>

              <div style={{ height: '400px' }}>
                <Line 
                  data={{
                    labels: Array.from({ length: Math.max(results.withoutPrepaymentChart.length, results.withPrepaymentChart.length) }, (_, i) => i + 1),
                    datasets: [
                      ...(chartVisibility.paymentsWithout ? [{
                        label: 'Общо плащания (без предсрочно)',
                        data: results.withoutPrepaymentChart.map(d => d.payments),
                        borderColor: 'rgb(255, 99, 132)',
                        backgroundColor: 'rgba(255, 99, 132, 0.2)',
                        tension: 0.1
                      }] : []),
                      ...(chartVisibility.paymentsWith ? [{
                        label: 'Общо плащания (с предсрочно)',
                        data: results.withPrepaymentChart.map(d => d.payments),
                        borderColor: 'rgb(54, 162, 235)',
                        backgroundColor: 'rgba(54, 162, 235, 0.2)',
                        tension: 0.1
                      }] : []),
                      ...(chartVisibility.interestWithout ? [{
                        label: 'Лихви (без предсрочно)',
                        data: results.withoutPrepaymentChart.map(d => d.interest),
                        borderColor: 'rgb(255, 206, 86)',
                        backgroundColor: 'rgba(255, 206, 86, 0.2)',
                        tension: 0.1
                      }] : []),
                      ...(chartVisibility.interestWith ? [{
                        label: 'Лихви (с предсрочно)',
                        data: results.withPrepaymentChart.map(d => d.interest),
                        borderColor: 'rgb(75, 192, 192)',
                        backgroundColor: 'rgba(75, 192, 192, 0.2)',
                        tension: 0.1
                      }] : []),
                      ...(chartVisibility.prepayments ? [{
                        label: 'Предсрочни плащания',
                        data: results.withPrepaymentChart.map(d => d.prepayments),
                        borderColor: 'rgb(153, 102, 255)',
                        backgroundColor: 'rgba(153, 102, 255, 0.2)',
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
                        text: 'Кумулативни разходи по време на погасяването',
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
                            return formatNumber(value) + ' лв';
                          }
                        }
                      }
                    }
                  }}
                />
              </div>
            </div>
          )}
        </div>
      )}
    </div>
  );
};

export default Calculator;
