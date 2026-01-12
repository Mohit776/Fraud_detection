import './App.css'

import Navbar from './components/Navbar'
import {Routes, Route} from 'react-router-dom'
import Home from './pages/Home'
import LoginPage from './pages/LoginPage'
import RegisterPage from './pages/RegisterPage'
import FormPage from './pages/FormPage'
import ResultPage from './pages/ResultPage'
import Loader from './pages/Loader'

function App() {

  return (
    <>
      <Loader />
      <Navbar />
      <Routes>
        <Route path='/' element={<Home />} />
        <Route path='/login' element={<LoginPage />} />
        <Route path='/register' element={<RegisterPage />} />
        <Route path='/form' element={<FormPage />} />
        <Route path='/resultpage' element={<ResultPage />} />
      </Routes>
      
      
    </>
  )
}

export default App
