// import Shortener from "../components/Shortener";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";
import { Link } from "react-router-dom";

const Home = () => {
  const user = localStorage.getItem('user');
  return (
    <div>
        
        {user? <Navbar /> :<p className="alert-info">You must <Link to='/login'>Login</Link> or <Link to='/register'>Register</Link> for better experience</p> }
      <Outlet />
    </div>
      
  );
};

export default Home;
