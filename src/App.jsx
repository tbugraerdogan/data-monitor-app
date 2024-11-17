import { useState, useEffect } from "react";
import axios from "axios";
import "./App.css";

function App() {
  // State to hold the fetched data
  const [data, setData] = useState(null);
  // State to hold any error messages
  const [error, setError] = useState(null);
  // State to track if the connection is active
  const [isActive, setIsActive] = useState(true);

  useEffect(() => {
    // Function to fetch data from the API
    const fetchData = async () => {
      try {
        // Make a GET request to the API endpoint with the necessary headers
        const response = await axios.get("/api/data", {
          headers: {
            "X-API-KEY": import.meta.env.VITE_API_KEY,
          },
        });
        console.log("New data received:", response.data);
        // Update the state with the received data and reset the error and isActive state
        setData(response.data);
        setError(null);
        setIsActive(true);
      } catch (err) {
        console.error("Error fetching data:", err);
        // Set error message and mark the connection as inactive
        setError("Error fetching data");
        setIsActive(false);
      }
    };

    // Initial fetch when the component mounts
    fetchData();

    // Set up polling every 5 seconds to fetch new data
    const intervalId = setInterval(fetchData, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  // Function to format timestamp to GMT+1 (Europe/Paris timezone)
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
