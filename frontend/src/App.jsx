import React, { useState, useEffect}from 'react'
import Navbar from './components/Navbar'
import api from './services/api'
import { BrowserRouter, Routes, Route } from "react-router-dom";
import DriverRegister from './components/DriverRegister';
import Register from './components/Register';
import Login from './components/Login';
import PrivateRoute from './utils/PrivateRoute';
import Home from './pages/Home';
import Ride from './pages/Ride';



const App = () => {
  return <>
<BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
        <Route path="/driver-register" element={<DriverRegister />} />
        
        {/* Protected Routes */}
        <Route element={<PrivateRoute />}>
          <Route path="/ride" element={<Ride />} />

        </Route>

      </Routes>
    </BrowserRouter>
  </>
}

export default App
