import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './App.css';
import LoginPage from './pages/LoginPage';
import SignUpPage from './pages/SignUpPage';
import HomePage from './pages/HomePage';
import MyBookingsPage from './pages/MyBookingsPage';
import AdminDashboard from './pages/AdminDashboard';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        {/* İlk açılan rota LoginPage olacak */}
        <Route path='/' element={<LoginPage />} />
        <Route path='/admin' element={<AdminDashboard />} />
        <Route path='/homepage' element={<HomePage />} />
        <Route path='/mybookings' element={<MyBookingsPage />} />
        <Route path='/signup' element={<SignUpPage />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;
