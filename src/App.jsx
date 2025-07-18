import './App.css'
import Calculator from './Components/Calculator'
import Investment from './Components/Investment'

/*
1. Нека анюитетната ми вноска е 877 лева (111000, 180 месеца, 5% ГПР)
2. На месец мога да заделям допълнително 3000 лева (общо мога да заделям по 3878 лева)
3. Нека актив има 7% годишен ръст, калибрирано по инфлация

Какво да си правя 3878-те лева всеки месец?
Стратегия 1:
Всеки месец погасявам 877 лева - една вноска + предсрочно погасявам 3000.
Изплащам заема вместо за 180 месеца, за 31 месеца.
През останалите 149 месеца инвестирам всичките 3878 лева на месец в актив.

Стратегия 2:
Всеки месец погасявам 877 лева - една вноска
Изплащам заема за 180 месеца.
През всичките 180 месеца инвестирам по 3000 лева в актив.

Коя стратегия е по-печеливша на края на 15-те години?
*/

function App() {
  return (
    <div style={{ 
      display: 'flex', 
      gap: '20px', 
      padding: '20px',
      maxWidth: '1400px',
      margin: '0 auto',
      flexWrap: 'wrap'
    }}>
      <div style={{ flex: '1', minWidth: '500px' }}>
        <Calculator />
      </div>
      <div style={{ flex: '1', minWidth: '500px' }}>
        <Investment />
        <Investment initialValues={{
          monthlyInvestment: 3878,
          investmentMonths: 149,
        }} />
      </div>
    </div>
  )
}

export default App
