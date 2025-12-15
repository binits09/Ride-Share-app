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
import UserLayout from "./accountPages/userAcc/UserLayout";
import UserH from "./accountPages/userAcc/UserH";
import UserPersonalInfo from "./accountPages/userAcc/PersonalInfo";
import UserSecurity from "./accountPages/userAcc/Security";

import DriverLayout from "./accountPages/driverAcc/DriverLayout";
import DriverH from "./accountPages/driverAcc/DriverH";
import DriverPersonalInfo from "./accountPages/driverAcc/PersonalInfo";
import Vehicle from "./accountPages/driverAcc/Vehicle";
import Earnings from "./accountPages/driverAcc/Earnings";
import DriverSecurity from "./accountPages/driverAcc/Security";




const App = () => {
  return <>
    <AuthProvider>
      <BrowserRouter>
        <Navbar />
        <Routes>
        
          {/* USER ACCOUNT */}
          <Route element={<PrivateRoute role="user" />}>
            <Route path="/account/user" element={<UserLayout />}>
              <Route index element={<UserH />} />
              <Route path="personal-info" element={<UserPersonalInfo />} />
              <Route path="security" element={<UserSecurity />} />
            </Route>
          </Route>

          {/* DRIVER ACCOUNT */}
          <Route element={<PrivateRoute role="driver" />}>
            <Route path="/account/driver" element={<DriverLayout />}>
              <Route index element={<DriverH />} />
              <Route path="personal-info" element={<DriverPersonalInfo />} />
              <Route path="vehicle" element={<Vehicle />} />
              <Route path="earnings" element={<Earnings />} />
              <Route path="security" element={<DriverSecurity />} />
            </Route>
          </Route>

          {/* Public Routes */}
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
