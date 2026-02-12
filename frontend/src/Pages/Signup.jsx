import React, { useState } from 'react'
import "../assets/css/AuthForm.css"
import api from './Api/Api';
import toast from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';
const Signup = () => {
    const [form, setform] = useState({
        name: "",
        email: "",
        password: "",
        password_confirmation: ""
    });
    const handleChange = (e) => {
        const { name, value } = e.target;
        setform((prev) => ({
            ...prev,
            [name]: value
        }))
    }
    const navigate = useNavigate();

    const handleSubmit = async (e) => {
        e.preventDefault();
        console.log(form)
        try {
            const response = await api.post("/api/signup", form, {
                headers: {
                    Accept: "application/json"
                }
            });
            console.log(response.data)
            toast.success(response.data.message)
            navigate("/login")
        } catch (error) {
            console.log(error?.response?.data?.message || error?.message);
            toast.error(error?.response?.data?.message || error?.message)

        }
    }

    return (
        <div>
            <div class="signup">

                <div class="signup-classic">

                    <div className="border-2 w-[300px] p-4">
                        <h2 className='font-bold text-3xl flex justify-center items-center'>Signup</h2>
                        <form class="form" onSubmit={handleSubmit}>
                            <fieldset class="username">
                                <input type="text" name='name' value={form.name} onChange={handleChange} placeholder="username" />
                            </fieldset>
                            <fieldset class="email">
                                <input type="email" name='email' value={form.email} onChange={handleChange} placeholder="email" />
                            </fieldset>
                            <fieldset class="password">
                                <input type="password" name='password' value={form.password} onChange={handleChange} placeholder="password" />
                            </fieldset>
                            <fieldset class="password">
                                <input type="password" name='password_confirmation' value={form.password_confirmation} onChange={handleChange} placeholder="confirm password" />
                            </fieldset>
                            <button type="submit" class="btn1">sign up</button>
                        </form>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Signup
