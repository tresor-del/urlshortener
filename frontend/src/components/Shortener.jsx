import React, { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import logo from "../logo/LogoSample_ByTailorBrands.jpg";


const Shortener = () => {
  const [longUrl, setLongUrl] = useState("");
  const [shortUrl, setShortUrl] = useState("");
  const [UrlTitle, setUrlTitle] = useState('');// Allows sending cookies
  const [loading, setLoading] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [shortUrlId, setShortUrlId] = useState("");
  const { logout } = useAuth();
  const token = localStorage.getItem('token')
  const navigate = useNavigate();
  const user = JSON.stringify(localStorage.getItem("user"));

  const getCSRFToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1];
  };

  const handleShorten = async () => {
    const csrfToken = getCSRFToken();
    setLoading(true);

    console.log(
      "Request payload:",
      JSON.stringify({
        original_url: longUrl,
        title: UrlTitle,
        author: user.id,
      })
    );
    const storedUser = localStorage.getItem('user')
    const userObj = JSON.parse(storedUser)
    console.log(userObj.id)
    try {
      const response = await fetch("http://127.0.0.1:8000/shorten/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          'Authorization': `Bearer ${token}`,
          "X-CSRFToken": csrfToken,
        },
        credentials: "include", 
        body: JSON.stringify({
          original_url: longUrl,
          title: UrlTitle
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to shorten URL");
      }

      const data = await response.json();
      console.log(data);
      setShortUrl(data.short_url);
      setUrlTitle(data.title);
      setShortUrlId(data.id);
      setShowModal(true);
    } catch (error) {
      console.error("Error Fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    logout();
    navigate("/login");
  };

  const closeModal = () => {
    setShowModal(false);
    setShortUrl("");
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shortUrl);
    alert("Copied to clipboard!");
  };

  const goToShortUrl = () => {
    window.open(shortUrl, "_blank");
  };

  const deleteUrl = async (urlId) => {
    const csrfToken = getCSRFToken();
    try {
      const response = await fetch(
        `http://127.0.0.1:8000/shorten/${urlId}`,
        {
          method: "DELETE", // Utilisation de la méthode DELETE
          method: "DELETE", // Utilisation de la méthode DELETEd
          headers: {
            "Content-Type": "application/json",
            "Authorization": `Bearer ${token}`,
            "X-CSRFToken": csrfToken, 
          },
          credentials: "include",
        }
      );

      if (!response.ok) {
        throw new Error("Failed to delete URL");
      }

      navigate('/')

    } catch (error) {
      console.error("Error Fetching data:", error);
    } finally {
      setLoading(false);
    }
  };

  function handleDelete() {
    const urlId = shortUrlId;
    deleteUrl(urlId);
  }

  return (
    <div className="shortener">
      <h1>
        Optimize your sharing <br />
        with <span className="highlight">personalized URLs</span>{" "}
      </h1>
      <div>
        Paste a long URL, provide a name and get a short one ready to use
      </div>
      <div className="s">
        <input
          type="email"
          id="email"
          value={longUrl}
          onChange={(e) => setLongUrl(e.target.value)}
          placeholder="Enter a long URL"
          autoFocus
        />{" "}
        <br /> <br />
        <input
          type="text"
          id="text"
          value={UrlTitle}
          onChange={(e) => setUrlTitle(e.target.value)}
          placeholder="Enter a title for this URL"
          
        />{" "}
        <br /> <br />
        <button onClick={handleShorten} disabled={loading}>
          {loading ? "Shortening..." : "Shorten"}
        </button>
      </div>

      {showModal && (
        <div className="shortened-url" onClick={closeModal}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <ul>
              <li onClick={copyToClipboard} title="Copy">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="currentColor"
                >
                  <path d="M360-240q-33 0-56.5-23.5T280-320v-480q0-33 23.5-56.5T360-880h360q33 0 56.5 23.5T800-800v480q0 33-23.5 56.5T720-240H360Zm0-80h360v-480H360v480ZM200-80q-33 0-56.5-23.5T120-160v-560h80v560h440v80H200Zm160-240v-480 480Z" />
                </svg>
              </li>
              <li onClick={handleDelete} title="Delete">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="20px"
                  fill="red"
                >
                  <path d="M280-120q-33 0-56.5-23.5T200-200v-520h-40v-80h200v-40h240v40h200v80h-40v520q0 33-23.5 56.5T680-120H280Zm400-600H280v520h400v-520ZM360-280h80v-360h-80v360Zm160 0h80v-360h-80v360ZM280-720v520-520Z" />
                </svg>
              </li>
              <li onClick={closeModal} className="close-btn" title="Close">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  height="24px"
                  viewBox="0 -960 960 960"
                  width="24px"
                  fill="currentColor"
                >
                  <path d="m256-200-56-56 224-224-224-224 56-56 224 224 224-224 56 56-224 224 224 224-56 56-224-224-224 224Z" />
                </svg>
              </li>
            </ul>
            <div className="div">
              <div >
                <div>
                  <div className="short-url-container">
                    Short URL:{" "}
                  <a
                    className="short-url"
                    href={shortUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    id="shortUrl"
                    data-id={shortUrlId}
                  >
                    {shortUrl}
                  </a>

                  <a onClick={goToShortUrl} title="Click to visit the site">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    height="24px"
                    viewBox="0 -960 960 960"
                    width="20px"
                    fill="currentColor"
                  >
                    <path d="M200-120q-33 0-56.5-23.5T120-200v-560q0-33 23.5-56.5T200-840h280v80H200v560h560v-280h80v280q0 33-23.5 56.5T760-120H200Zm188-212-56-56 372-372H560v-80h280v280h-80v-144L388-332Z" />
                  </svg>
                </a>{" "}
                  </div>
                  
                <div className="short-url-title">
                  <label htmlFor="title">Title: </label> <br /> 
              <input type="text" placeholder="Title (optional)" value={UrlTitle} /> <br /> <br />
                </div>
                  
                </div>
                
              </div>
              <br /> <br />
              
              <div className="ab">
                <div className="b"></div>
                <div className="text-container"><img src={logo} alt="URL S. logo" height={20} width={40} /></div>
                <div className="b"></div>
              </div>{" "}
              <br />
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Shortener;
