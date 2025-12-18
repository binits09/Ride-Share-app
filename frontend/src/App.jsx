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
import AdminPage from './pages/AdminPage';
// AuthProvider is already applied in main.jsx; avoid double providers
import UserLayout from "./accountPages/userAcc/UserLayout";
import UserH from "./accountPages/userAcc/UserH";
import UserPersonalInfo from "./accountPages/userAcc/PersonalInfo";
import UserSecurity from "./accountPages/userAcc/Security";
import UserHistory from "./accountPages/userAcc/UserHistory";
import UserHelp from "./accountPages/userAcc/UserHelp";

import DriverLayout from "./accountPages/driverAcc/DriverLayout";
import DriverH from "./accountPages/driverAcc/DriverH";
import DriverPersonalInfo from "./accountPages/driverAcc/PersonalInfo";
import Vehicle from "./accountPages/driverAcc/Vehicle";
import Earnings from "./accountPages/driverAcc/Earnings";
import DriverSecurity from "./accountPages/driverAcc/Security";
import DriverHistory from "./accountPages/driverAcc/DriverHistory";
import DriverHelp from "./accountPages/driverAcc/DriverHelp";




const App = () => {
  return <>
    <BrowserRouter>
        <Navbar />
        <Routes>
        
          {/* USER ACCOUNT */}
          <Route element={<PrivateRoute role="user" />}>
            <Route path="/account/user" element={<UserLayout />}>
              <Route index element={<UserH />} />
              <Route path="personal-info" element={<UserPersonalInfo />} />
              <Route path="security" element={<UserSecurity />} />
              <Route path="history" element={<UserHistory />} />
              <Route path="help" element={<UserHelp />} />
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
              <Route path="history" element={<DriverHistory />} />
              <Route path="help" element={<DriverHelp />} />
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

          {/* Admin Routes */}
          <Route element={<PrivateRoute role="admin" />}>
            <Route path="/admin" element={<AdminPage />} />
          </Route>

        </Routes>
      </BrowserRouter>
  </>
}

export default App
