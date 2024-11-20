import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import './register.css';

function Register() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    password: '',
    phone: '',
    address: '',
    pincode: '',
    user_type: 'buyer'  // Changed to user_type to match API expectation
  });
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();

  const handleChange = (e) => {
    const { name, value } = e.target;
    // Handle the select field specially
    if (name === 'user_type') {
      setFormData(prev => ({ ...prev, user_type: value }));
    } else {
      setFormData(prev => ({ ...prev, [name]: value }));
    }
    if (error) setError('');
  };

  const validateForm = () => {
    if (!formData.name.trim()) return "Name is required";
    if (!formData.email.trim()) return "Email is required";
    if (!formData.password.trim()) return "Password is required";
    if (formData.password.length < 6) return "Password must be at least 6 characters";
    if (!formData.phone.trim()) return "Phone is required";
    if (!formData.address.trim()) return "Address is required";
    if (!formData.pincode.trim()) return "Pincode is required";
    if (!/^\d{6}$/.test(formData.pincode)) return "Pincode must be 6 digits";
    if (!/^\d{10}$/.test(formData.phone)) return "Phone must be 10 digits";
    return null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const validationError = validateForm();
    if (validationError) {
      setError(validationError);
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      console.log('Sending registration data:', formData);
      
      const response = await axios.post('http://localhost:8080/api/v1/register', formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      });

      console.log('Registration response:', response);
      navigate('/login');
    } catch (err) {
      console.error('Registration error:', err);
      const errorMessage = err.response?.data?.message || 
                          err.response?.data?.error || 
                          'Registration failed. Please try again.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <form onSubmit={handleSubmit} className="register-form">
        <h2>Create Account</h2>
        {error && <p className="error" role="alert">{error}</p>}
        
        <div className="form-group">
          <input 
            type="text" 
            name="name" 
            placeholder="Full Name" 
            value={formData.name} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <input 
            type="email" 
            name="email" 
            placeholder="Email" 
            value={formData.email} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <input 
            type="password" 
            name="password" 
            placeholder="Password" 
            value={formData.password} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <input 
            type="tel" 
            name="phone" 
            placeholder="Phone Number" 
            value={formData.phone} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
            className="form-control"
            pattern="[0-9]{10}"
          />
        </div>

        <div className="form-group">
          <input 
            type="text" 
            name="address" 
            placeholder="Address" 
            value={formData.address} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
            className="form-control"
          />
        </div>

        <div className="form-group">
          <input 
            type="text" 
            name="pincode" 
            placeholder="Pincode" 
            value={formData.pincode} 
            onChange={handleChange} 
            required 
            disabled={isLoading}
            className="form-control"
            pattern="[0-9]{6}"
          />
        </div>

        <div className="form-group">
          <select 
            name="user_type"  // Changed to user_type
            value={formData.user_type}  // Changed to user_type
            onChange={handleChange}
            disabled={isLoading}
            className="form-control"
          >
            <option value="buyer">Buyer</option>
            <option value="seller">Seller</option>
          </select>
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className="submit-button"
        >
          {isLoading ? 'Creating Account...' : 'Register'}
        </button>
        
        <p className="login-link">
          Already have an account? <a href="/login">Login here</a>
        </p>
      </form>
    </div>
  );
}

export default Register;