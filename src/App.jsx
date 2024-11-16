import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get("/api/data", {
          headers: {
            "X-API-KEY": import.meta.env.VITE_API_KEY,
          },
        });
        console.log("New data received:", response.data);
        setData(response.data);
        setError(null);
        setIsActive(true);
      } catch (err) {
        console.error("Error fetching data:", err);
        setError("Error fetching data");
        setIsActive(false);
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling every 5 seconds
    const intervalId = setInterval(fetchData, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  const formatTimestampToGMTPlus1 = (timestamp) => {
    const date = new Date(timestamp);
    const options = {
      timeZone: "Europe/Paris",
      year: "numeric",
      month: "2-digit",
      day: "2-digit",
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: false,
    };
    // Format the date to a readable string in the specified timezone
    return `${date.toLocaleString("en-GB", options)} (GMT+1)`;
  };

  return (
    <div className="container">
      <div className="monitor-card">
        <div className="card-header">
          <h1 className="title">Real-Time Data Monitor</h1>
        </div>

        {/* Display error message if an error occurred */}
        {error && (
          <div className="error-message">
            <span>{error}</span>
          </div>
        )}

        {/* Display data if available */}
        {data && (
          <div className="data-container">
            <div className="data-item timestamp">
              <span className="data-label">Timestamp</span>
              <span className="data-value">
                {formatTimestampToGMTPlus1(data.timestamp)}
              </span>
            </div>
            <div className="data-item value">
              <span className="data-label">
                {isActive ? "Value" : "Last Value"}
              </span>
              <span
                className={`data-value ${isActive ? "highlight" : "inactive"}`}
              >
                {data.value}
              </span>
            </div>
            <div className="status-indicator">
              <span
                className={`status-dot ${!isActive ? "inactive" : ""}`}
              ></span>
              <span className="status-text">
                {isActive ? "Live Monitoring" : "Connection Lost"}
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default App;
