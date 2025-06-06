import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { register } from "../api/auth";
import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import Logo from "../components/Logo";
import decodeToken  from "../utils/DecodeToken";



const Register = () => {

    const navigate = useNavigate();

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [ error, setError ]= useState('');
    const { setLogin } = useAuth();
    const [loading, setLoading] = useState(false)
    const [ disabled, setDisabled ] = useState(false)

    const handleSubmit = async (e) => {

      setLoading(true)
      setDisabled(true)

        e.preventDefault()

        setError('');

        try {

            const data = await register({ username: email, password });

            alert('login')
            // console.log(data)
            const data_rep = data
            console.log(data_rep)

            const userInfo = {
              username: email,
              id: decodeToken(data.access).user_id
            }
            console.log(userInfo)

            const token = data.token.access 
            console.log(token)

            setLogin(token, userInfo)

            navigate('/')
            setLoading(false)
            setDisabled(false)
        } catch (error) {
            console.error('Register error', error)
            setError(error.message || 'An error occured ');
            setLoading(false)
            setDisabled(false)
        }
    };

    return (
      <div className='form-container'>
        <Logo />
        <h2>Sign up</h2>
        <form onSubmit={handleSubmit} >

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
            <button type="submit" className="disabled" disabled>{loading ? 'Signing up...' : 'Sign up'}</button> :
            <button type="submit">{loading ? 'Signing up...' : 'Sign up'}</button>
          }
          <p>Already  have an account? <Link to='/login'>Login here</Link></p>
          

        </form>
      </div>
        
      );
};


export default Register