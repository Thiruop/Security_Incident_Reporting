import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { ToastContainer, toast } from "react-toastify";
import SignUp from "../assets/SignUp.jpg";
import 'react-toastify/dist/ReactToastify.css';

function Registration() {
  const navigate = useNavigate();

  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [role, setRole] = useState("Employee");

  const registerMutation = useMutation({
    mutationFn: async () => {
      if (password !== confirmPassword) {
        throw new Error("Passwords do not match");
      }

      const response = await fetch("http://localhost:4000/api/register", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ name, email, password, role }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      return data;
    },
    onSuccess: () => {
      toast.success("Registration successful! Redirecting to login...");
      setTimeout(() => navigate("/"), 3000);
    },
    onError: (error) => {
      toast.error(error.message || "Registration failed");
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    registerMutation.mutate();
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gray-100 font-sans p-6">
        <div className="w-full max-w-5xl bg-white rounded-lg shadow-lg overflow-hidden flex flex-col md:flex-row">
          
          <div className="md:w-1/2">
            <img
              src={SignUp}
              alt="Sign Up"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="md:w-1/2 p-8">
            <h2 className="text-2xl font-semibold text-center text-indigo-600 mb-6">
              Create an Account
            </h2>
            <form onSubmit={handleSubmit}>
              <div className="grid grid-cols-2 gap-4">
                
                <div className="col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Name
                  </label>
                  <input
                    type="text"
                    className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>

                <div className="col-span-2">
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

                <div className="col-span-2">
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Role
                  </label>
                  <select
                    className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                  >
                    <option value="Employee">Employee</option>
                    <option value="Admin">Admin</option>
                  </select>
                </div>

                <div>
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

                <div>
                  <label className="block text-gray-700 text-sm font-medium mb-2">
                    Confirm Password
                  </label>
                  <input
                    type="password"
                    className="w-full px-3 py-2 border rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-indigo-400"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full mt-6 py-2 bg-indigo-600 text-white rounded-lg font-medium hover:bg-indigo-700 transition duration-200"
                disabled={registerMutation.isLoading}
              >
                {registerMutation.isLoading ? "Registering..." : "Register"}
              </button>

              <p className="mt-4 text-sm text-center text-gray-600">
                Already have an account?{" "}
                <span
                  className="text-indigo-600 hover:underline cursor-pointer"
                  onClick={() => navigate("/")}
                >
                  Login
                </span>
              </p>
            </form>
          </div>
        </div>
      </div>

      <ToastContainer />
    </>
  );
}

export default Registration;
