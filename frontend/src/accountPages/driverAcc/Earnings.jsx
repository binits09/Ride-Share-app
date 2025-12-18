import React, { useEffect, useState } from 'react'
import axios from 'axios'
import { useAuth } from '../../context/AuthContext'

const Earnings = () => {
  const { token } = useAuth();
  const [summary, setSummary] = useState({ totalCompleted: 0, totalEarnings: 0, todaysEarnings: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    if (!token) return;
    const fetchSummary = async () => {
      try {
        setLoading(true);
        const res = await axios.get('http://localhost:6200/api/rides/driver/summary', {
          headers: { Authorization: `Bearer ${token}` },
        });
        setSummary(res.data || { totalCompleted: 0, totalEarnings: 0, todaysEarnings: 0 });
      } catch (err) {
        setError(err.response?.data?.message || 'Failed to load earnings');
      } finally {
        setLoading(false);
      }
    };
    fetchSummary();
  }, [token]);

  if (loading) {
    return (
      <div className="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <p className="text-gray-700">Loading earnings…</p>
      </div>
    );
  }

  if (error) {
    return (
      <div className="bg-red-50 border border-red-200 text-red-700 rounded-xl p-6 shadow-sm">
        {error}
      </div>
    );
  }

  const { totalCompleted, totalEarnings, todaysEarnings } = summary;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Earnings</h1>
        <p className="text-gray-600 mt-1">Your ride totals and earnings.</p>
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-600">Total rides completed</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">{totalCompleted}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-600">Total earnings</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">₹{totalEarnings}</p>
        </div>
        <div className="bg-white border border-gray-200 rounded-xl p-5 shadow-sm">
          <p className="text-sm text-gray-600">Today’s earnings</p>
          <p className="mt-1 text-3xl font-bold text-gray-900">₹{todaysEarnings}</p>
        </div>
      </div>
    </div>
  );
}

export default Earnings
