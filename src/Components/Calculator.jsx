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
              <h4 style={{ margin: '0 0 10px 0', fontSize: '15px' }}>С предсрочно погасяване ({formatCurrency(inputs.prepaymentAmount)}/месец)</h4>
              <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Общо плащания:</strong> {formatCurrency(results.withPrepayment.payments)}</p>
              <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Общо лихви:</strong> {formatCurrency(results.withPrepayment.interest)}</p>
              <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Предсрочни плащания:</strong> {formatCurrency(results.withPrepayment.prepayments)}</p>
              <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Брой месеци:</strong> {formatNumber(results.withPrepayment.months)}</p>
              <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Срок:</strong> {formatNumber(Math.round(results.withPrepayment.months / 12 * 10) / 10)} години</p>
            </div>
          </div>

          <div style={{ backgroundColor: '#d4edda', padding: '15px', borderRadius: '6px' }}>
            <h4 style={{ margin: '0 0 10px 0', fontSize: '15px' }}>Икономии от предсрочното погасяване</h4>
            <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Спестени лихви:</strong> {formatCurrency(results.withoutPrepayment.interest - results.withPrepayment.interest)}</p>
            <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Спестено време:</strong> {formatNumber(results.withoutPrepayment.months - results.withPrepayment.months)} месеца 
               ({formatNumber(Math.round((results.withoutPrepayment.months - results.withPrepayment.months) / 12 * 10) / 10)} години)</p>
            <p style={{ margin: '3px 0', fontSize: '12px' }}><strong>Общо спестени разходи:</strong> {formatCurrency(results.withoutPrepayment.payments - results.withPrepayment.payments)}</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default Calculator;
