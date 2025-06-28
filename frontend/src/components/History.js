import React, { useEffect, useState, useContext } from "react";
import ExplainContext from "../context/ExplainContext";

export default function History() {
  const [history, setHistory] = useState([]);
  const [modalOpen, setModalOpen] = useState(false);
  const [nodeDetails, setNodeDetails] = useState(null);

  const { Explain } = useContext(ExplainContext);

  useEffect(() => {
    const fetchHistory = async () => {
      try {
        const res = await fetch("http://localhost:5000/query/history", {
          method: "GET",
          headers: {
            "token": sessionStorage.getItem("token: "), 
          },
        });
        const json = await res.json();
        setHistory(json.result || []);
      } catch (err) {
        console.error("Error fetching history:", err);
      }
    };
    fetchHistory();
  }, []);

  const handleQueryClick = async (query) => {
    const result = await Explain(query);
    if (result?.result) {
      setNodeDetails(result.result); // Show root node
      setModalOpen(true);
    }
  };

  return (
    <div className="p-6">
      <h2 className="text-xl font-bold mb-4">Query History</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {history.map((item) => (
          <div
            key={item._id}
            className="cursor-pointer p-4 border rounded shadow hover:bg-gray-50"
            onClick={() => handleQueryClick(item.queryText)}
          >
            <h5 className="font-semibold">{item.queryText}</h5>
            <p className="text-sm text-gray-500">
              {new Date(item.date).toLocaleString()}
            </p>
          </div>
        ))}
      </div>

      {/* Modal */}
      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-40 flex justify-center items-center z-50">
          <div className="bg-white p-6 rounded-md shadow-lg w-[90%] max-w-xl">
            <h3 className="text-lg font-bold mb-2">Node Details</h3>
            {nodeDetails ? (
              <pre className="text-sm bg-gray-100 p-3 rounded overflow-x-auto max-h-[400px]">
                {JSON.stringify(nodeDetails, null, 2)}
              </pre>
            ) : (
              <p>No details found</p>
            )}
            <div className="text-right mt-4">
              <button
                onClick={() => setModalOpen(false)}
                className="bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
