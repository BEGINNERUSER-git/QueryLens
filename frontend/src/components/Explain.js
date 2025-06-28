import { useContext, useState } from "react";
import ExplainContext from '../context/ExplainContext.js';
import TreeView from "./TreeView.js";

export default function Explain() {
  const context = useContext(ExplainContext);
  const { Explain } = context;
  const [data, setData] = useState({ query: "" });
  const [response, setResponse] = useState(null);

  const handleOnChange = (e) => {
    setData({ ...data, [e.target.name]: e.target.value });
  };

  const handleOnSubmit = async (e) => {
    e.preventDefault();
    const res = await Explain(data.query);
    setResponse(res);
  };

  return (
    <>
      <div className="min-h-full">
        <main>
          <form onSubmit={handleOnSubmit}>
            <div className="mx-auto max-w-7xl px-4 py-6">
              <label htmlFor="query" className="block text-sm font-medium text-gray-900">
                <h3 className="text-3xl font-bold">SQL Query</h3>
              </label>
              <div className="mt-2">
                <input
                  id="query"
                  name="query"
                  type="text"
                  required
                  onChange={handleOnChange}
                  className="block w-full rounded-md px-3 py-1.5 text-base text-gray-900 border-gray-300"
                />
              </div>
              <div className="mt-10">
                <button
                  type="submit"
                  className="w-full bg-indigo-600 text-white px-4 py-2 rounded hover:bg-indigo-500"
                >
                  Analyse
                </button>
              </div>
            </div>
          </form>
        </main>
      </div>

      {response && (
        <>
          <div className="min-h-full">
            <header className="bg-white shadow-sm">
              <div className="max-w-7xl mx-auto px-4 py-6">
                <h3 className="text-3xl font-bold text-gray-900">JSON Preview</h3>
              </div>
            </header>
            <main>
              <div className="max-w-7xl mx-auto px-4 py-6">
                <pre className="bg-gray-100 p-4 rounded text-sm text-gray-800">
                  {JSON.stringify(response, null, 2)}
                </pre>
              </div>
            </main>
          </div>

          <TreeView treeData={response.result} />
        </>
      )}
    </>
  );
}
