import { NavLink } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useEffect, useRef } from "react";
import logo from "../logo/LogoSample_ByTailorBrands.jpg";


const Navbar = () => {
  
  const storedUser = localStorage.getItem("user");
  let user = null;

  try {
    if (storedUser && storedUser !== "undefined") {
      user = JSON.parse(storedUser);
    }
  } catch (error) {
    console.error("Invalid JSON in localStorage 'user':", error);
    localStorage.removeItem("user"); // nettoyage en cas de donnée invalide
  }


  const { logout } = useAuth();
  const [open, setOpen] = useState(false);
  const profileRef = useRef(null); // Référence pour le menu profil

  // Fonction pour ouvrir/fermer le menu profil
  const handleProfile = () => {
    setOpen((prev) => !prev);
  };

  // Gestion du clic en dehors du menu pour le fermer
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (profileRef.current && !profileRef.current.contains(event.target)) {
        setOpen(false);
      }
    };

    if (open) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [open]);

  return (
    <div className="navbar">
      <ul>
        <li className="logo"><img src={logo} alt="URL S. logo" height={20} width={40} /></li>
        <NavLink to="/" className="link">
          <li>Shortener</li>
        </NavLink>

        <NavLink to="/urls" className="link">
          <li>History</li>
        </NavLink>
        {/* <NavLink to="/favourite" className="link">
          <li>Saved</li>
        </NavLink> */}
        {user && (
          <div className="profile-container" ref={profileRef}>
            <div
              className="navbar-button"
              onClick={handleProfile}
              aria-expanded={open}
            >
              <span>
                Profile
              </span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                height="24px"
                viewBox="0 -960 960 960"
                width="24px"
                fill="#343a40"
                className={`icon ${open ? "rotate" : ""}`}
              >
                <path d="M480-344 240-584l56-56 184 184 184-184 56 56-240 240Z" />
              </svg>
            </div>
            <div className={`profile ${open ? "open" : ""}`}>
              <ul>
                <li>
                  <div className="photo">
                    <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="30px"
                  viewBox="0 -960 960 960"
                  width="30px"
                  fill="#343a40"
                >
                  <path d="M480-480q-66 0-113-47t-47-113q0-66 47-113t113-47q66 0 113 47t47 113q0 66-47 113t-113 47ZM160-160v-112q0-34 17.5-62.5T224-378q62-31 126-46.5T480-440q66 0 130 15.5T736-378q29 15 46.5 43.5T800-272v112H160Zm80-80h480v-32q0-11-5.5-20T700-306q-54-27-109-40.5T480-360q-56 0-111 13.5T260-306q-9 5-14.5 14t-5.5 20v32Zm240-320q33 0 56.5-23.5T560-640q0-33-23.5-56.5T480-720q-33 0-56.5 23.5T400-640q0 33 23.5 56.5T480-560Zm0-80Zm0 400Z" />
                </svg>
                  </div>
                <div className="username">
                  {user.username}
                </div>
                  
                  </li>
                <li onClick={logout} style={{ cursor: "pointer" }}>
                  Logout
                </li>
              </ul>
            </div>
          </div>
        )}
      </ul>
    </div>
  );
};

export default Navbar;
