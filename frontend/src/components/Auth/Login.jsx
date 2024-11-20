import React, { useState, useContext } from 'react';  // Add useContext
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { AuthContext } from '../../contexts/AuthContext';  // Add this import
import './login.css';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const { login } = useContext(AuthContext);  // Add this line

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const response = await axios.post(
        'http://localhost:8080/api/v1/login',
        { email, password },
        { headers: { 'Content-Type': 'application/json' } }
      );

      if (response.data && response.data.token && response.data.user_type) {
        const { token, user_type, ...userData } = response.data;

        // Store the token
        localStorage.setItem('token', token);
        axios.defaults.headers.common['Authorization'] = `Bearer ${token}`;

        // Set the user in context
        login({ ...userData, user_type });  // Add this line

        // Redirect based on user type
        switch (user_type) {
          case 'admin':
            navigate('/admin');
            break;
          case 'seller':
            navigate('/seller');
            break;
          case 'buyer':
            navigate('/buyer');
            break;
          default:
            setError('Unknown user type. Please contact support.');
        }
      } else {
        setError('Invalid response from server');
      }
    } catch (err) {
      console.error('Login error details:', {
        status: err.response?.status,
        data: err.response?.data,
        message: err.message,
      });

      const errorMessage =
        err.response?.data?.message ||
        err.response?.data?.error ||
        'Login failed. Please check your credentials.';
      setError(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="login-container">
      <form onSubmit={handleLogin} className="login-form">
        <h2>Login</h2>
        {error && <p className="error" role="alert">{error}</p>}
        <div className="form-group">
          <input
            type="email"
            placeholder="Email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
            disabled={isLoading}
            className="form-control"
          />
        </div>
        <div className="form-group">
          <input
            type="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
            disabled={isLoading}
            className="form-control"
          />
        </div>
        <button
          type="submit"
          disabled={isLoading}
          className="submit-button"
        >
          {isLoading ? 'Logging in...' : 'Login'}
        </button>
        <p>
          Don't have an account? <a href="/register">Register</a>
        </p>
      </form>
    </div>
  );
}

export default Login;



// import React, { useState } from 'react';
// import axios from 'axios';
// import { useNavigate } from 'react-router-dom';
// import './login.css'

// function Login() {
//   const [email, setEmail] = useState('');
//   const [password, setPassword] = useState('');
//   const [error, setError] = useState('');
//   const [isLoading, setIsLoading] = useState(false);
//   const navigate = useNavigate();

//   const handleLogin = async (e) => {
//     e.preventDefault();
//     setIsLoading(true);
//     setError('');

//     try {
//       const response = await axios.post('http://localhost:8080/api/v1/login', {
//         email,
//         password
//       }, {
//         headers: {
//           'Content-Type': 'application/json'
//         }
//       });

//       console.log('Login response:', response);

//       if (response.data && response.data.token) {
//         localStorage.setItem('token', response.data.token);
//         // Set the token for future requests
//         axios.defaults.headers.common['Authorization'] = `Bearer ${response.data.token}`;
//         navigate('/profile');
//       } else {
//         setError('Invalid response from server');
//       }
//     } catch (err) {
//       console.error('Login error details:', {
//         status: err.response?.status,
//         data: err.response?.data,
//         message: err.message
//       });
      
//       const errorMessage = err.response?.data?.message || 
//                           err.response?.data?.error || 
//                           'Login failed. Please check your credentials.';
//       setError(errorMessage);
//     } finally {
//       setIsLoading(false);
//     }
//   };

//   return (
//     <div className="login-container">
//       <form onSubmit={handleLogin} className="login-form">
//         <h2>Login</h2>
//         {error && <p className="error" role="alert">{error}</p>}
//         <div className="form-group">
//           <input 
//             type="email" 
//             placeholder="Email" 
//             value={email} 
//             onChange={(e) => setEmail(e.target.value)} 
//             required 
//             disabled={isLoading}
//             className="form-control"
//           />
//         </div>
//         <div className="form-group">
//           <input 
//             type="password" 
//             placeholder="Password" 
//             value={password} 
//             onChange={(e) => setPassword(e.target.value)} 
//             required 
//             disabled={isLoading}
//             className="form-control"
//           />
//         </div>
//         <button 
//           type="submit" 
//           disabled={isLoading}
//           className="submit-button"
//         >
//           {isLoading ? 'Logging in...' : 'Login'}
//         </button>
//         <p>Don't have an account? <a href="/register">Register</a></p>
//       </form>
//     </div>
//   );
// }

// export default Login;