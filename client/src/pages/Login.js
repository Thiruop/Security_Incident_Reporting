import React, { useState } from "react";
import { useMutation } from '@tanstack/react-query';
import { ToastContainer, toast } from 'react-toastify';
import { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";
import LoginImg from "../assets/Login.jpg";
import 'react-toastify/dist/ReactToastify.css';

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
          localStorage.setItem("role", decoded.role);
          localStorage.setItem("email", decoded.email);
        } catch (error) {
          toast.error("Login succeeded, but role extraction failed.");
        }

        toast.success("Login successful");
        setTimeout(() => {
          navigate("/dashboard");
        }, 3000);
      } else {
        toast.error("Login failed");
      }
    },
    onError: () => {
      toast.error("Login failed. Please check your credentials.");
    }
  });

  const SubmitLogin = (e) => {
    e.preventDefault();
    loginMutation.mutate();
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center  font-sans">
        <div className="w-full max-w-5xl mx-auto flex flex-col md:flex-row shadow-lg  rounded-lg overflow-hidden">
          
        
          <div className="md:w-1/2 h-64 md:h-auto">
            <img
              src={LoginImg}
              alt="Login Visual"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="md:w-1/2 p-6 flex flex-col justify-center">
            <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-4">
              Welcome Back
            </h2>
            <form onSubmit={SubmitLogin}>
              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Email
                </label>
                <input
                  type="email"
                  className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>

              <div className="mb-4">
                <label className="block text-gray-700 text-sm font-medium mb-2">
                  Password
                </label>
                <input
                  type="password"
                  className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>

              <button
                type="submit"
                disabled={loginMutation.isLoading}
                className="w-full py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
              >
                {loginMutation.isLoading ? "Logging in..." : "Login"}
              </button>
            </form>

            <p className="mt-4 text-sm text-center text-gray-600">
              Don’t have an account?{" "}
              <span
                className="text-indigo-600 hover:underline cursor-pointer"
                onClick={() => navigate("/registration")}
              >
                Sign up
              </span>
            </p>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}

export default Login;
