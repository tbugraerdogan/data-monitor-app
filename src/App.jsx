import { useState, useEffect } from "react";
import axios from "axios";

function App() {
  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

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
      } catch (err) {
        console.error("Error fetching data:", err);
        setError(err.message);
      }
    };

    // Initial fetch
    fetchData();

    // Set up polling every 5 seconds
    const intervalId = setInterval(fetchData, 5000);

    // Cleanup interval on component unmount
    return () => clearInterval(intervalId);
  }, []);

  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>Loading...</div>;

  return (
    <div>
      <pre>{JSON.stringify(data, null, 2)}</pre>
    </div>
  );
}

export default App;
