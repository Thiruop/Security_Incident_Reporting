import React, { useState } from "react";
import { useMutation } from '@tanstack/react-query';
import { ToastContainer, toast } from 'react-toastify';
import {jwtDecode} from "jwt-decode";  
import { useNavigate } from "react-router-dom";

function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const loginMutation = useMutation({
    mutationFn: async () => {
      const response = await fetch("http://localhost:4000/api/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json"
        },
        body: JSON.stringify({ email, password })
      });

      const data = await response.json();
      console.log("Login response:", data);

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      return data;
    },
    onSuccess: (data) => {
      if (data.token) {
        localStorage.setItem("token", data.token);
        localStorage.setItem("LoggedIn", true);

        try {
       const decoded = jwtDecode(data.token);
            console.log("Decoded token:", decoded);


          localStorage.setItem("role", decoded.role);
          localStorage.setItem("email", decoded.email);
        } catch (error) {
          console.error("Token decoding failed:", error);
          toast.error("Login succeeded, but role extraction failed.");
        }

        toast.success('Login successful', {
          position: "top-right",
          autoClose: 2000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });

        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        toast.error('Login failed', {
          position: "top-right",
          autoClose: 5000,
          hideProgressBar: false,
          closeOnClick: false,
          pauseOnHover: true,
          draggable: true,
          progress: undefined,
          theme: "light",
        });
      }
    },
    onError: (error) => {
      toast.error('Login failed', {
        position: "top-right",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: false,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "light",
      });
    }
  });

  const SubmitLogin = (e) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <>
      <div className="bg-gray-200 font-sans text-gray-700">
        <div className="container mx-auto p-8 flex">
          <div className="max-w-md w-full mx-auto">
            <h1 className="text-4xl text-center mb-12 font-thin">Company</h1>

            <div className="bg-white rounded-lg overflow-hidden shadow-2xl">
              <div className="p-8">
                <form onSubmit={SubmitLogin}>
                  <div className="mb-5">
                    <label htmlFor="email" className="block mb-2 text-sm font-medium text-gray-600">Email</label>
                    <input
                      type="text"
                      name="email"
                      className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                    />
                  </div>

                  <div className="mb-5">
                    <label htmlFor="password" className="block mb-2 text-sm font-medium text-gray-600">Password</label>
                    <input
                      type="password"
                      name="password"
                      className="block w-full p-3 rounded bg-gray-200 border border-transparent focus:outline-none"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                    />
                  </div>

                  <button
                    type="submit"
                    className="w-full p-3 mt-4 bg-indigo-600 text-white rounded shadow"
                    disabled={loginMutation.isLoading}
                  >
                    {loginMutation.isLoading ? "Logging in..." : "Login"}
                  </button>
                </form>
              </div>

              <div className="flex justify-between p-8 text-sm border-t border-gray-300 bg-gray-100">
                <a className="font-medium text-indigo-500" onClick={() => navigate("/registration")}>
                  Create account
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
      <ToastContainer
        position="top-right"
        autoClose={5000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="light"
      />
    </>
  );
}

export default Login;
