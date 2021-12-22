import { Routes, Route } from 'react-router-dom'
import Home from './pages/home'
import Auth from './pages/auth'

const App = () => {
  return (
    <Routes>
      <Route path="/" element={<Home />} />
      <Route path="/auth" element={<Auth />} />
    </Routes>
  )
}

export default App
