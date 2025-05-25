import { useState, useEffect } from "react";
import { useAuth } from "../context/AuthContext";
import { login } from "../api/auth";
import { Link, useNavigate } from "react-router-dom";
// import { jwtDecode } from "jwt-decode";
import Logo  from '../components/Logo';
import decodeToken from '../utils/DecodeToken'

const Login = () => {
  const navigate = useNavigate();
  const { setLogin } = useAuth(); 
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [disabled, setDisabled] = useState(false)

  useEffect(() => {
    const storedToken = sessionStorage.getItem('token');
    if (storedToken) {
      navigate('/');
    }
  }, [navigate]);

 

  const handleSubmit = async (e) => {

    e.preventDefault();  
    setLoading(true)
    setDisabled(true)

    // const decodeToken = (token) => {
    //   try {
    //       return jwtDecode(token)
    //   } catch (error) {
    //       console.error('Error decoding token:', error);
    //       return null;
    //   }
    // };

    try {
      const data = await login({ username: email, email, password });
      // console.log(data.access)
      const userInfo = {
        username: email,
        id: decodeToken(data.access).user_id
      }
      setLogin(data.access, userInfo);
      navigate('/');  
      setLoading(false)
      setDisabled(false)

    } catch (error) {
      console.error('Login error', error);
      setError(error.response?.data?.detail || 'An error occured.');
      setLoading(false)
      setDisabled(false)
    }
  };

  return (
    <div className="form-container">
      <Logo />
      <h2>Welcome back</h2>
      <form onSubmit={handleSubmit} className="form">
      {error && <p  className="alert-danger">{error}</p>} 
      <input
        type="email"
        placeholder="Email"
        value={email} 
        onChange={(e) => setEmail(e.target.value)}
        autoFocus
      />
      <input
        type="password"
        placeholder="Mot de passe"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {disabled | email==='' | password==='' ?
      <button type="submit" disabled className="disabled" >{loading ? 'Signing in...' : 'Sign In'}</button> :
      <button type="submit" >{loading ? 'Signing in...' : 'Sign In'}</button>
    }
      
      <p>Don't have an account? <Link to='/register'>Register here</Link></p>
    </form>
    </div>
    
  );
};

export default Login;
