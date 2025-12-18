import React, { useState, useEffect } from "react";
import axios from "axios";
import { useAuth } from "../../context/AuthContext";

const DriverHelp = () => {
  const { token } = useAuth();
  const [subject, setSubject] = useState("");
  const [message, setMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState("");
  const [error, setError] = useState("");
  const [myRequests, setMyRequests] = useState([]);
  const [fetchingRequests, setFetchingRequests] = useState(true);

  useEffect(() => {
    const fetchMyRequests = async () => {
      try {
        setFetchingRequests(true);
        const res = await axios.get("http://localhost:6200/api/help/my-requests", {
          headers: { Authorization: `Bearer ${token}` }
        });
        setMyRequests(res.data || []);
      } catch (err) {
        console.error("Failed to fetch help requests");
      } finally {
        setFetchingRequests(false);
      }
    };

    if (token) {
      fetchMyRequests();
    }
  }, [token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    if (!subject.trim() || !message.trim()) {
      setError("Please fill in all fields");
      return;
    }

    try {
      setLoading(true);
      await axios.post(
        "http://localhost:6200/api/help/submit",
        { subject, message },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      setSuccess("Help request submitted successfully! We'll get back to you soon.");
      setSubject("");
      setMessage("");
      // Refresh the list
      const res = await axios.get("http://localhost:6200/api/help/my-requests", {
        headers: { Authorization: `Bearer ${token}` }
      });
      setMyRequests(res.data || []);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to submit help request");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-2">Help & Support</h1>
      <p className="text-gray-600 mb-6">Need assistance? Submit your request below and our admin team will help you.</p>

      <div className="bg-white rounded-xl border border-gray-200 p-6 max-w-2xl">
        <form onSubmit={handleSubmit} className="space-y-4">
          {success && (
            <div className="bg-green-50 border border-green-200 text-green-700 p-3 rounded-lg text-sm">
              {success}
            </div>
          )}
          {error && (
            <div className="bg-red-50 border border-red-200 text-red-700 p-3 rounded-lg text-sm">
              {error}
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Subject
            </label>
            <input
              type="text"
              value={subject}
              onChange={(e) => setSubject(e.target.value)}
              placeholder="Brief description of your issue"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Message
            </label>
            <textarea
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Please describe your issue in detail..."
              rows="6"
              className="w-full px-4 py-2 rounded-lg border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 text-white font-medium hover:bg-blue-700 disabled:opacity-60 disabled:cursor-not-allowed transition"
          >
            {loading ? "Submitting..." : "Submit Help Request"}
          </button>
        </form>
      </div>

      {/* My Help Requests */}
      <div className="mt-8">
        <h2 className="text-xl font-bold text-gray-900 mb-4">My Help Requests</h2>
        {fetchingRequests ? (
          <p className="text-gray-600">Loading your requests...</p>
        ) : myRequests.length === 0 ? (
          <p className="text-gray-600">No help requests yet.</p>
        ) : (
          <div className="space-y-3">
            {myRequests.map((request) => (
              <div key={request._id} className="bg-white border border-gray-200 rounded-xl p-4">
                <div className="flex items-start justify-between mb-2">
                  <div className="flex-1">
                    <h3 className="font-semibold text-gray-900">{request.subject}</h3>
                    <p className="text-sm text-gray-600 mt-1">{request.message}</p>
                  </div>
                  <span className={`ml-4 text-xs px-3 py-1 rounded-full border whitespace-nowrap ${
                    request.status === "resolved" 
                      ? "bg-green-50 text-green-700 border-green-200" 
                      : request.status === "closed" 
                      ? "bg-gray-50 text-gray-700 border-gray-200" 
                      : "bg-yellow-50 text-yellow-700 border-yellow-200"
                  }`}>
                    {request.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-2">
                  Submitted: {new Date(request.createdAt).toLocaleString()}
                </p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default DriverHelp;
