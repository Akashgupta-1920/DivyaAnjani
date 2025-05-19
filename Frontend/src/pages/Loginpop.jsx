import React, { useState } from 'react';
import { FaTimes } from 'react-icons/fa';
import axios from 'axios';
import { toast } from 'react-toastify';
import { useNavigate } from 'react-router-dom';

const Loginpop = ({ currState, setCurrState, setShowLogin, setUser, isAdminLogin = false }) => {
  const [values, setValues] = useState({ 
    name: '', 
    email: '', 
    phone: '', 
    password: '', 
    confirm_password: '',
    adminSecret: '' 
  });
  const [errorMessage, setErrorMessage] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    setValues({ ...values, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage('');

    if (currState === 'Sign Up') {
      if (values.password !== values.confirm_password) {
        setErrorMessage("Passwords do not match!");
        setIsLoading(false);
        return;
      }

      try {
        const response = await axios.post("https://divyaanjani.onrender.com/api/auth/signup", {
          name: values.name,
          email: values.email,
          phone: values.phone,
          password: values.password
        });

        if (response.status === 201) {
          toast.success("Account created successfully!");
          setCurrState('Login');
          setValues({ ...values, name: '', phone: '', password: '', confirm_password: '' });
        }
      } catch (error) {
        if (error.response?.status === 400) {
          toast.error("User already exists");
        } else {
          setErrorMessage(error.response?.data?.message || "Something went wrong. Please try again.");
        }
      } finally {
        setIsLoading(false);
      }
    } else {
      try {
        const payload = {
          email: values.email,
          password: values.password
        };

        if (isAdminLogin) {
          payload.adminSecret = values.adminSecret;
        }

        const response = await axios.post(
          "https://divyaanjani.onrender.com/api/auth/login", 
          payload
        );

        if (response.status === 200) {
          toast.success(`${isAdminLogin ? 'Admin' : ''} Login successful!`);
          localStorage.setItem("token", response.data.token);
          localStorage.setItem("user", JSON.stringify(response.data.user));
          
          if (response.data.user.isAdmin) {
            localStorage.setItem("isAdmin", "true");
          }

          if (setUser) {
            setUser(response.data.user);
          }

          setShowLogin(false);
          navigate(isAdminLogin ? '/admin/dashboard' : '/');
        }
      } catch (error) {
        setErrorMessage(error.response?.data?.message || 
          (isAdminLogin ? "Admin login failed. Check credentials." : "Invalid email or password."));
      } finally {
        setIsLoading(false);
      }
    }
  };

  return (
    <div className="fixed inset-0 z-50 bg-black/60 flex justify-center items-center">
      <form onSubmit={handleSubmit} className="w-full max-w-md bg-white text-gray-700 flex flex-col gap-6 px-8 py-8 rounded-xl text-base animate-fadeIn shadow-lg">
        <div className="flex justify-between items-center text-black">
          <h2 className="text-2xl font-bold">
            {isAdminLogin ? 'Admin Login' : currState}
          </h2>
          <FaTimes 
            onClick={() => setShowLogin(false)} 
            className="w-5 h-5 cursor-pointer hover:text-red-500 transition" 
          />
        </div>

        <div className="flex flex-col gap-5">
          {currState === 'Sign Up' && !isAdminLogin && (
            <>
              <input
                type="text"
                name="name"
                placeholder="Your Name"
                required
                value={values.name}
                onChange={handleChange}
                className="outline-none border border-gray-300 px-4 py-3 rounded-lg focus:border-[#69974a] transition"
              />
              <input
                type="tel"
                name="phone"
                placeholder="Phone Number"
                required
                value={values.phone}
                onChange={handleChange}
                className="outline-none border border-gray-300 px-4 py-3 rounded-lg focus:border-[#69974a] transition"
              />
            </>
          )}
          
          <input
            type="email"
            name="email"
            placeholder="Email Address"
            required
            value={values.email}
            onChange={handleChange}
            className="outline-none border border-gray-300 px-4 py-3 rounded-lg focus:border-[#69974a] transition"
          />
          
          <input
            type="password"
            name="password"
            placeholder="Password"
            required
            value={values.password}
            onChange={handleChange}
            className="outline-none border border-gray-300 px-4 py-3 rounded-lg focus:border-[#69974a] transition"
          />
          
          {currState === 'Sign Up' && !isAdminLogin && (
            <input
              type="password"
              name="confirm_password"
              placeholder="Confirm Password"
              required
              value={values.confirm_password}
              onChange={handleChange}
              className="outline-none border border-gray-300 px-4 py-3 rounded-lg focus:border-[#69974a] transition"
            />
          )}
          
          {isAdminLogin && (
            <input
              type="password"
              name="adminSecret"
              placeholder="Admin Secret Key"
              required
              value={values.adminSecret}
              onChange={handleChange}
              className="outline-none border border-gray-300 px-4 py-3 rounded-lg focus:border-[#69974a] transition"
            />
          )}
        </div>

        {errorMessage && <p className="text-red-500 text-sm">{errorMessage}</p>}

        <button
          type="submit"
          className="bg-[#69974a] hover:bg-[#5a853d] transition text-white py-3 rounded-lg text-lg font-semibold cursor-pointer disabled:opacity-70 disabled:cursor-not-allowed"
          disabled={isLoading}
        >
          {isLoading ? 'Please wait...' : 
           isAdminLogin ? 'Admin Login' : 
           currState === 'Sign Up' ? 'Create an Account' : 'Login'}
        </button>

        {!isAdminLogin && (
          <div className="flex items-start gap-2 text-sm">
            <input type="checkbox" required className="mt-1" />
            <p>By continuing, I agree to the terms and conditions.</p>
          </div>
        )}

        {!isAdminLogin && (
          currState === 'Login' ? (
            <p className="text-sm text-center">
              New here?{' '}
              <span 
                className="text-[#69974a] font-semibold cursor-pointer hover:underline" 
                onClick={() => setCurrState('Sign Up')}
              >
                Create an account
              </span>
            </p>
          ) : (
            <p className="text-sm text-center">
              Already have an account?{' '}
              <span 
                className="text-[#69974a] font-semibold cursor-pointer hover:underline" 
                onClick={() => setCurrState('Login')}
              >
                Login here
              </span>
            </p>
          )
        )}
      </form>
    </div>
  );
};

export default Loginpop;