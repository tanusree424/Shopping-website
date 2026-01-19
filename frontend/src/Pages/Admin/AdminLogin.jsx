import React,{useState} from 'react'
import api from '../Api/Api'
import { Eye, EyeOff } from "lucide-react"
import toast from 'react-hot-toast';
import { Link ,useNavigate } from 'react-router-dom';

const AdminLogin = () => {
      const [form, setForm] = useState({
      
      email: "",
      password:""
      
    })
    const navigate = useNavigate();
      const [showPassword, setShowPassword] = useState(false);
        const [loading, setLoading] = useState(false);
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
      const response = await api.post("/api/login", form)
      console.log(response.data.user)
      console.log(response.data.user.roles)
      toast("Login successful")
      
      if (response.data?.user?.roles === "admin") {
        localStorage.setItem("token", response.data.token)
        localStorage.setItem("user", response.data.user);
        navigate("/admin")
      }
      
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
          Admin Login
        </h2>

     

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

   
    

        {/* Button */}
        <button
          disabled={loading}
          className="w-full bg-blue-500 text-white py-2 rounded hover:bg-blue-600 disabled:opacity-60"
        >
          {loading ? "Loging..." : "Login"}
        </button>
      <p> Don't have an account ?<Link to={"/admin/signup"} className='text-blue-400 font-bold' >signup</Link> </p> 
      </form>
    </div>
  )
}

export default AdminLogin
