import { useState } from "react";
import { useNavigate } from "react-router-dom";
import Alert from "./Alert";


export default function SignUp(props) {
    let Navigate=useNavigate();
   const [form,setForm]=useState({username:"",email:"",password:""});
  const [error, setError] = useState(null);
  
   const handleOnSubmit= async (e)=>{
    const {username,email,password}=form;
    e.preventDefault();
    const res=await fetch('http://localhost:5000/auth/register',{
        method:"POST",
            headers:{
                "Content-Type":"application/json"
        },body:JSON.stringify({username,email,password})

    })
    const json=await res.json();
    console.log(json);
    if(json.success){
    sessionStorage.setItem('token: ',json.token);
     Navigate(`/home`);
    }
   else if (Array.isArray(json.errors)) {
  const messages = json.errors.map(err => `${err.path}: ${err.msg}`).join('\n');
  setError(messages);
} else {
  setError("Registration failed. Please try again.");
}
   }
 const handleOnChange=(e)=>{
 setForm({...form,[e.target.name]:e.target.value});
 }
  return (
    <>    <div className="conatiner">
      {error && (
            <div className="mt-4 max-w-xl mx-auto">
              <Alert type="error" message={error} />
            </div>
          )}
          </div>
    <form  method="POST" onSubmit={handleOnSubmit} >
        <div className="container">
      <div className="space-y-12">
        
        <div className="border-b border-gray-900/10 pb-12">
        <div className="container text-center my-2">
          <h2 className="text-base/7 font-large text-gray-900">Register</h2>
        </div>
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="username"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Username
              </label>
              <div className="mt-2">
                <div className="flex items-center rounded-md bg-white pl-3 outline-1 -outline-offset-1 outline-gray-300 focus-within:outline-2 focus-within:-outline-offset-2 focus-within:outline-indigo-600">
                  <input
                    id="username"
                    name="username"
                    type="text"
                    minLength="4"
                    required
                    onChange={handleOnChange}
                    className="block min-w-0 grow py-1.5 pr-3 pl-1 text-base text-gray-900 placeholder:text-gray-400 focus:outline-none sm:text-sm/6"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="email"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Email address
              </label>
              <div className="mt-2">
                <input
                  id="email"
                  name="email"
                  type="email"
                    required
                    onChange={handleOnChange}
                  autoComplete="email"
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
          </div>
        </div>

        <div className="border-b border-gray-900/10 pb-12">
          <div className="mt-10 grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-6">
            <div className="sm:col-span-4">
              <label
                htmlFor="password"
                className="block text-sm/6 font-medium text-gray-900"
              >
                Password
              </label>
              <div className="mt-2">
                <input
                  id="password"
                  name="password"
                  type="password"
                    minLength="5"
                    required
                    onChange={handleOnChange}
                  className="block w-full rounded-md bg-white px-3 py-1.5 text-base text-gray-900 outline-1 -outline-offset-1 outline-gray-300 placeholder:text-gray-400 focus:outline-2 focus:-outline-offset-2 focus:outline-indigo-600 sm:text-sm/6"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="mt-6 flex items-center justify-end gap-x-6">
        <button type="button" className="text-sm/6 font-semibold text-gray-900">
          Cancel
        </button>
        <button
          type="submit"
          className="rounded-md bg-indigo-600 px-3 py-2 text-sm font-semibold text-white shadow-xs hover:bg-indigo-500 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Save
        </button>
      </div>
      </div>
    </form>
    </>
  );
}
