"use client";

import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";

export default function ConnectDB(props) {
  let navigate = useNavigate();
  const [Dbcred, setDbcred] = useState({
    host: "",
    user: "",
    password: "",
    database: "",
    port: "",
  });
  const [error, setError] = useState(null);
  const handleonSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    const { host, user, password, database, port } = Dbcred;
    const res = await fetch(`http://localhost:5000/query/connect`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "token": sessionStorage.getItem(`token: `),
      },
      body: JSON.stringify({ host, user, password, database, port }),
    });
    const json = await res.json();
    if (json.success) {
      console.log("Connected Db successfully");
      setDbcred({ host: "", user: "", password: "", database: "", port: "" });
      navigate("/explain");
    } else {
      setError("Connection failed: Please check your credentials.");
    }
    if (!localStorage.getItem("token: ")) {
      setDbcred({ host: "", user: "", password: "", database: "", port: "" });
    }
  };

  const handleonChange = (e) => {
    setDbcred({ ...Dbcred, [e.target.name]: e.target.value });
  };

  return (
    <div className="isolate bg-white px-6 py-24 sm:py-32 lg:px-8">
      <div
        aria-hidden="true"
        className="absolute inset-x-0 -top-40 -z-10 transform-gpu overflow-hidden blur-3xl sm:-top-80"
      >
        <div
          style={{
            clipPath:
              "polygon(74.1% 44.1%, 100% 61.6%, 97.5% 26.9%, 85.5% 0.1%, 80.7% 2%, 72.5% 32.5%, 60.2% 62.4%, 52.4% 68.1%, 47.5% 58.3%, 45.2% 34.5%, 27.5% 76.7%, 0.1% 64.9%, 17.9% 100%, 27.6% 76.8%, 76.1% 97.7%, 74.1% 44.1%)",
          }}
          className="relative left-1/2 -z-10 aspect-1155/678 w-144.5 max-w-none -translate-x-1/2 rotate-30 bg-linear-to-tr from-[#ff80b5] to-[#9089fc] opacity-30 sm:left-[calc(50%-40rem)] sm:w-288.75"
        />
      </div>
      <div className="mx-auto max-w-2xl text-center">
        <h2 className="text-4xl font-semibold tracking-tight text-balance text-gray-900 sm:text-5xl">
          Connect to your MySQL Database
        </h2>
        <p className="mt-2 text-lg/8 text-gray-600">
          Connection will be temporary. We will not store your information.
        </p>
      </div>
      {error && (
        <div className="mt-4 max-w-xl mx-auto">
          <Alert type="error" message={error} />
        </div>
      )}
      <form
        onSubmit={handleonSubmit}
        action="/explain"
        method="POST"
        className="mx-auto mt-16 max-w-xl sm:mt-20"
      >
        <div className="grid grid-cols-1 gap-x-8 gap-y-6 sm:grid-cols-2">
          <div>
            <label
              htmlFor="host"
              className="block text-sm/6 font-semibold text-gray-900"
            >
              Host Name
            </label>
            <div className="mt-2.5">
              <input
                id="host"
                name="host"
                type="text"
                required
                onChange={handleonChange}
                autoComplete="given-name"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
            </div>
          </div>
          <div>
            <label
              htmlFor="user"
              className="block text-sm/6 font-semibold text-gray-900"
            >
              Username
            </label>
            <div className="mt-2.5">
              <input
                id="user"
                name="user"
                required
                type="text"
                onChange={handleonChange}
                autoComplete="family-name"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="password"
              className="block text-sm/6 font-semibold text-gray-900"
            >
              Password
            </label>
            <div className="mt-2.5">
              <input
                id="password"
                name="password"
                required
                type="password"
                onChange={handleonChange}
                autoComplete="organization"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="database"
              className="block text-sm/6 font-semibold text-gray-900"
            >
              Database
            </label>
            <div className="mt-2.5">
              <input
                id="database"
                name="database"
                required
                type="text"
                onChange={handleonChange}
                autoComplete="database"
                className="block w-full rounded-md bg-white px-3.5 py-2 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600"
              />
            </div>
          </div>
          <div className="sm:col-span-2">
            <label
              htmlFor="port"
              className="block text-sm/6 font-semibold text-gray-900"
            >
              port
            </label>
            <div className="mt-2.5">
              <div className="flex rounded-md bg-white outline-1 -outline-offset-1 outline-gray-300 has-[input:focus-within]:outline-2 has-[input:focus-within]:-outline-offset-2 has-[input:focus-within]:outline-indigo-600">
                <input
                  id="port"
                  required
                  name="port"
                  type="number"
                  onChange={handleonChange}
                  placeholder="3306"
                  className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                />
              </div>
            </div>
          </div>
        </div>
        <div className="mt-10">
          <button
            type="submit"
            className="block w-full rounded-md bg-indigo-600 px-3.5 py-2.5 text-center text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
          >
            Connect
          </button>
        </div>
      </form>
    </div>
  );
}
