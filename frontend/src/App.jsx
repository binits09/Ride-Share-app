import React from 'react'
import Navbar from './components/Navbar'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DriverRegister from './components/DriverRegister';
import Register from './components/Register';
import Login from './components/Login';
import PrivateRoute from './utils/PrivateRoute';
import Home from './pages/Home';
import Ride from './pages/Ride';
import DriverUI from './pages/DriverUI';
import DriverHome from './pages/DriverHome';
import { AuthProvider } from './context/AuthContext';




const App = () => {
  return <>
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/driver-register" element={<DriverRegister />} />

          {/* Protected Routes */}
          <Route element={<PrivateRoute role="user" />}>
            <Route path="/ride" element={<Ride />} />

          </Route>

          <Route element={<PrivateRoute role="driver" />}>
            <Route path="/driver-home" element={<DriverHome />} />
            <Route path="/driver" element={<DriverUI />} />
          </Route>




        </Routes>
      </BrowserRouter>
    </AuthProvider>
  </>
}

export default App
