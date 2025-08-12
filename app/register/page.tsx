"use client";
import { useState } from "react";
import Link from "next/link";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function RegisterPage() {
  const router = useRouter();
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const [errors, setErrors] = useState({
    username: "",
    password: "",
  });
  const [apiError, setApiError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors = { username: "", password: "" };
    let valid = true;


    if (!username.trim()) {
      newErrors.username = "Username field cannot be empty";
      valid = false;
    }

    if (password.length < 8) {
      newErrors.password = "Password must be least 8 character long";
      valid = false;
    }

    if (!role) {
      setApiError("Please select a role");
      valid = false;
    } else {
      setApiError("");
    }

    setErrors(newErrors);

    if (valid) {
      setLoading(true);
      try {
        const res = await axios.post(
          "https://test-fe.mysellerpintar.com/api/auth/register",
          {
            username,
            password,
            role,
          }
        );

        if (res.status === 201 || res.data.success) {
          alert("Registration successful! Please login.");
          router.push("/login");
        }
      } catch (err: unknown) {
        if (axios.isAxiosError(err)) {
          setApiError(err.response?.data?.message || "Registration failed");
        } else {
          setApiError("Registration failed");
        }
      }
       finally {
        setLoading(false);
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-50">
      <div className="bg-white p-8 rounded-lg shadow-md w-full max-w-sm">
        <div className="flex justify-center">
          <img
            src="/images/Frame.png"
            alt="Login Illustration"
            className="w-32 h-15 object-contain"
          />
        </div>
        {apiError && (
          <p className="bg-red-100 text-red-600 p-2 rounded text-sm mb-4">
            {apiError}
          </p>
        )}
        <form onSubmit={handleSubmit} className="space-y-4 ">
          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">
              Username
            </label>
            <input
              type="text"
              placeholder="Input username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              className="text-black placeholder-gray-400 w-full border rounded px-3 py-1  focus:ring-2 focus:ring-blue-500"
            />
            {errors.username && (
              <p className="text-red-500 text-sm mt-1">{errors.username}</p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium mb-1 text-gray-800">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              placeholder="Input password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="text-black placeholder-gray-400 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 pr-10"
            />

            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-11 transform -translate-y-1/2 text-gray-500 hover:text-blue-500"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {errors.password && (
              <p className="text-red-500 text-sm mt-1">{errors.password}</p>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium mb-1 text-gray-800">
              Role
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className=" text-gray-400 w-full border rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500"
            >
              <option value="" className="text-gray-500">
                Select Role
              </option>
              <option value="User" className="text-gray-500">
                User
              </option>
              <option value="Admin" className="text-gray-500">
                Admin
              </option>
            </select>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition disabled:bg-gray-400"
          >
            {loading ? "Registering..." : "Register"}
          </button>
        </form>

        <p className="text-center text-sm mt-4 text-gray-600">
          Already have an account?{" "}
          <Link href="/login" className="text-blue-600 underline">
            Login
          </Link>
        </p>
      </div>
    </div>
  );
}
