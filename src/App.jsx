import './App.css'
import Calculator from './Components/Calculator'
import Investment from './Components/Investment'

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
      </div>
    </div>
  )
}

export default App
