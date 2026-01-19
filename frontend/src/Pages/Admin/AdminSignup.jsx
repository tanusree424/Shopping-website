import React, { useState } from 'react'
import api from '../Api/Api'
import { Eye, EyeOff } from "lucide-react"
import toast from 'react-hot-toast';
import { Link ,useNavigate } from 'react-router-dom';

const AdminSignup = () => {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    password_confirmation: "",
    roles:"admin"
  })
const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setConfirmShowPassword] = useState(false)
  const [loading, setLoading] = useState(false)

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      setLoading(true)
      const response = await api.post("/api/admin/signup", form)
      console.log(response.data)
      toast("signup successful")
      navigate("/admin/login")
    } catch (error) {
      console.log(error.response?.data || error.message)
      toast.error(error.response?.data || error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex justify-center items-center min-h-screen bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-10 rounded-xl shadow-md w-[400px]"
      >
        <h2 className="text-2xl font-bold text-center mb-6">
          Admin Signup
        </h2>

        {/* Name */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Name</label>
          <input
            type="text"
            name="name"
            value={form.name}
            onChange={handleChange}
            placeholder="Enter Name"
            className="w-full border border-gray-400 p-2 rounded"
            required
          />
        </div>

        {/* Email */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Email</label>
          <input
            type="email"
            name="email"
            value={form.email}
            onChange={handleChange}
            placeholder="Enter Email"
            className="w-full border border-gray-400 p-2 rounded"
            required
          />
        </div>

        {/* Password */}
        <div className="mb-4">
          <label className="block text-sm font-semibold mb-1">Password</label>
          <div className="relative">
            <input
              type={showPassword ? "text" : "password"}
              name="password"
              value={form.password}
              onChange={handleChange}
              placeholder="Enter Password"
              className="w-full border border-gray-400 p-2 rounded pr-10"
              required
            />

            {showPassword ? (
              <EyeOff
                onClick={() => setShowPassword(false)}
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
              />
            ) : (
              <Eye
                onClick={() => setShowPassword(true)}
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
              />
            )}
          </div>
        </div>

        {/* Confirm Password */}
        <div className="mb-6">
          <label className="block text-sm font-semibold mb-1">
            Confirm Password
          </label>
          <div className="relative">
          <input
             type={showConfirmPassword ? "text" : "password"}
            name="password_confirmation"
            value={form.password_confirmation}
            onChange={handleChange}
            placeholder="Confirm Password"
            className="w-full border border-gray-400 p-2 rounded"
            required
          />
          {showConfirmPassword ? (
              <EyeOff
                onClick={() => setConfirmShowPassword(false)}
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
              />
            ) : (
              <Eye
                onClick={() => setConfirmShowPassword(true)}
                className="absolute right-3 top-3 cursor-pointer text-gray-600"
              />
            )}
          </div>
        </div>

        {/* Button */}
        <button
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-60"
        >
          {loading ? "Signing up..." : "Signup"}
        </button>
      <p> Already have an account ?<Link to={"/admin/login"} className='text-blue-400 font-bold' >Login</Link> </p> 
      </form>
    </div>
  )
}

export default AdminSignup
