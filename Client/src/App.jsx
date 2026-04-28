import CustomerForm from './components/CustomerForm'
import './App.css'

function App() {
  return (
    <div className="app-page">
      {/* Decorative blurred background blobs */}
      <div className="app-blob app-blob--tl" aria-hidden="true" />
      <div className="app-blob app-blob--br" aria-hidden="true" />

      <CustomerForm />
    </div>
  )
}

export default App
