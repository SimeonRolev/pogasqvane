import React, { useState } from 'react';
import { generateAnnuitySchedule, mothlyPrepay } from '../utils/utils.js';

const Calculator = () => {
  const [inputs, setInputs] = useState({
    principal: 111000,
    periodYears: 15,
    apr: 4.2,
    prepaymentAmount: 3000
  });

  const [results, setResults] = useState(null);

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
    
    const withoutPrepayment = mothlyPrepay(originalSchedule, 0, inputs.apr);
    const withPrepayment = mothlyPrepay(originalSchedule, inputs.prepaymentAmount, inputs.apr);

    setResults({
      withoutPrepayment,
      withPrepayment,
      monthlyPayment: originalSchedule[0]?.payment || 0,
      originalSchedule
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
    <div style={{ padding: '20px', maxWidth: '800px', margin: '0 auto', fontFamily: 'Arial, sans-serif' }}>
      <h1>Калкулатор за предсрочно погасяване на заем</h1>
      
      <div style={{ backgroundColor: '#f5f5f5', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
        <h2>Параметри на заема</h2>
        
        <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '15px' }}>
          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Размер на заема (лв):
            </label>
            <input
              type="number"
              name="principal"
              value={inputs.principal}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Срок (години):
            </label>
            <input
              type="number"
              name="periodYears"
              value={inputs.periodYears}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              ГПР (%):
            </label>
            <input
              type="number"
              step="0.1"
              name="apr"
              value={inputs.apr}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>

          <div>
            <label style={{ display: 'block', marginBottom: '5px', fontWeight: 'bold' }}>
              Месечно предсрочно погасяване (лв):
            </label>
            <input
              type="number"
              name="prepaymentAmount"
              value={inputs.prepaymentAmount}
              onChange={handleInputChange}
              style={{ width: '100%', padding: '8px', border: '1px solid #ccc', borderRadius: '4px' }}
            />
          </div>
        </div>

        <button
          onClick={calculateResults}
          style={{
            marginTop: '20px',
            padding: '12px 24px',
            backgroundColor: '#007bff',
            color: 'white',
            border: 'none',
            borderRadius: '4px',
            cursor: 'pointer',
            fontSize: '16px',
            fontWeight: 'bold'
          }}
        >
          Изчисли
        </button>
      </div>

      {results && (
        <div>
          <div style={{ backgroundColor: '#e8f5e8', padding: '20px', borderRadius: '8px', marginBottom: '20px' }}>
            <h2>Основни данни</h2>
            <p><strong>Месечна вноска:</strong> {formatCurrency(results.monthlyPayment)}</p>
            <p><strong>Общо месеци без предсрочно погасяване:</strong> {formatNumber(results.withoutPrepayment.months)}</p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '20px' }}>
            <div style={{ backgroundColor: '#fff3cd', padding: '20px', borderRadius: '8px' }}>
              <h3>Без предсрочно погасяване</h3>
              <p><strong>Общо плащания:</strong> {formatCurrency(results.withoutPrepayment.payments)}</p>
              <p><strong>Общо лихви:</strong> {formatCurrency(results.withoutPrepayment.interest)}</p>
              <p><strong>Брой месеци:</strong> {formatNumber(results.withoutPrepayment.months)}</p>
              <p><strong>Срок:</strong> {formatNumber(results.withoutPrepayment.months / 12)} години</p>
            </div>

            <div style={{ backgroundColor: '#d1ecf1', padding: '20px', borderRadius: '8px' }}>
              <h3>С предсрочно погасяване ({formatCurrency(inputs.prepaymentAmount)}/месец)</h3>
              <p><strong>Общо плащания:</strong> {formatCurrency(results.withPrepayment.payments)}</p>
              <p><strong>Общо лихви:</strong> {formatCurrency(results.withPrepayment.interest)}</p>
              <p><strong>Предсрочни плащания:</strong> {formatCurrency(results.withPrepayment.prepayments)}</p>
              <p><strong>Брой месеци:</strong> {formatNumber(results.withPrepayment.months)}</p>
              <p><strong>Срок:</strong> {formatNumber(Math.round(results.withPrepayment.months / 12 * 10) / 10)} години</p>
            </div>
          </div>

          <div style={{ backgroundColor: '#d4edda', padding: '20px', borderRadius: '8px', marginTop: '20px' }}>
            <h3>Икономии от предсрочното погасяване</h3>
            <p><strong>Спестени лихви:</strong> {formatCurrency(results.withoutPrepayment.interest - results.withPrepayment.interest)}</p>
            <p><strong>Спестено време:</strong> {formatNumber(results.withoutPrepayment.months - results.withPrepayment.months)} месеца 
               ({formatNumber(Math.round((results.withoutPrepayment.months - results.withPrepayment.months) / 12 * 10) / 10)} години)</p>
            <p><strong>Общо спестени разходи:</strong> {formatCurrency(results.withoutPrepayment.payments - results.withPrepayment.payments)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;
