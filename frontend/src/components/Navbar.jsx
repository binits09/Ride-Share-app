import React from 'react'
import { BrowserRouter, Routes, Route, Link } from "react-router-dom";
import Login from './Login.jsx';
import Register from './Register.jsx';
import DriverRegister from "./DriverRegister.jsx";



const Navbar = () => {
    return <>
        <BrowserRouter>
            <div className="min-h-screen bg-white">
                <header className="p-4 max-w-6xl mx-auto flex justify-end gap-1">
                    <Link to="/login" className="text-sm text-gray-950 px-3 py-1 rounded-full hover:font-bold hover:bg-gray-200 transition">Login</Link>
                    <Link to="/register" className="text-sm text-gray-950 px-3 py-1 rounded-full hover:font-bold hover:bg-gray-200 transition">Register</Link>

                </header>

                <main>
                    <Routes>
                        <Route path="/" element={<Login />} />
                        <Route path="/login" element={<Login />} />
                        <Route path="/register" element={<Register />} />
                        <Route path="/driver-register" element={<DriverRegister />} />
                    </Routes>
                </main>
            </div>


        </BrowserRouter>
    </>
}

export default Navbar
