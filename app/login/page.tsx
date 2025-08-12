"use client";
import { useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import { Eye, EyeOff } from "lucide-react";

export default function Login() {
  const router = useRouter();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });
  const [fieldErrors, setFieldErrors] = useState<{
    username?: string;
    password?: string;
  }>({});
  const [error, setError] = useState("");
  const [showPassword, setShowPassword] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
    setFieldErrors((prev) => ({
      ...prev,
      [e.target.name]: "",
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    setFieldErrors({});

    const errors: typeof fieldErrors = {};
    if (!formData.username.trim())
      errors.username = "Please enter your username";
    if (!formData.password.trim())
      errors.password = "Please enter your password";

    if (Object.keys(errors).length > 0) {
      setFieldErrors(errors);
      return;
    }

    try {
      const res = await axios.post(
        "https://test-fe.mysellerpintar.com/api/auth/login",
        formData
      );

      localStorage.setItem("token", res.data.token);
      localStorage.setItem("role", res.data.role);
      localStorage.setItem("username", formData.username);
      localStorage.setItem("password", formData.password);

      if (res.data.role === "Admin") {
        router.push("/admin");
      } else {
        router.push("/");
      }
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data?.message || "Username atau password salah");
      } else {
        setError("Username atau password salah");
      }
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100 px-4">
      <div className="bg-white shadow-lg rounded-xl p-8 w-full max-w-md">
        <div className="flex justify-center">
          <img
            src="/images/Frame.png"
            alt="Login Illustration"
            className="w-32 h-15 object-contain"
          />
        </div>

        {error && (
          <p className="bg-red-100 text-red-600 p-2 rounded text-sm mb-4 text-center">
            {error}
          </p>
        )}

        <form onSubmit={handleSubmit} className="space-y-4" noValidate>
          <div>
            <label className="block text-sm font-medium text-gray-700">
              Username
            </label>
            <input
              type="text"
              name="username"
              placeholder="Input username"
              value={formData.username}
              onChange={handleChange}
              className={`text-black placeholder-gray-500 mt-1 block w-full px-3 py-1 border rounded-lg shadow-sm focus:ring-[#F77D00] focus:border-[#F77D00] ${
                fieldErrors.username ? "border-red-500" : "border-gray-300"
              }`}
            />
            {fieldErrors.username && (
              <p className="text-red-600 text-sm mt-1">
                {fieldErrors.username}
              </p>
            )}
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700">
              Password
            </label>
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={formData.password}
              placeholder="Input password"
              onChange={handleChange}
              className={`text-black placeholder-gray-500 mt-1 px-3 py-1 block w-full pr-10 border rounded-lg shadow-sm focus:ring-[#F77D00] focus:border-[#F77D00] ${
                fieldErrors.password ? "border-red-500" : "border-gray-300"
              }`}
            />
            <button
              type="button"
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-3 top-10 transform -translate-y-1/2 text-gray-500 hover:text-blue"
              tabIndex={-1}
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
            {fieldErrors.password && (
              <p className="text-red-600 text-sm mt-1">
                {fieldErrors.password}
              </p>
            )}
          </div>

          <button
            type="submit"
            className="w-full bg-blue-700 text-white py-2 rounded-lg hover:bg-blue-500 transition"
          >
            Login
          </button>
        </form>

        <p className="text-center text-sm text-gray-600 mt-4">
          Belum punya akun?{" "}
          <a href="/register" className="text-blue-500 underline">
            Register
          </a>
        </p>
      </div>
    </div>
  );
}
