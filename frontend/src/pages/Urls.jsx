import  { useEffect, useState } from "react";
import { MdDelete, MdFavoriteBorder, MdFavorite, MdExpandMore, MdExpandLess } from "react-icons/md";

const Urls = () => {
  const [urls, setUrls] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [expandedUrl, setExpandedUrl] = useState(null);
  const [favorites, setFavorites] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const urlsPerPage = 10;
  const [selectedFilter, setSelectedFilter] = useState("all");
  // const user = JSON.stringify(localStorage.getItem('user'))

  const token = localStorage.getItem("token");

  const getCSRFToken = () => {
    return document.cookie
      .split("; ")
      .find((row) => row.startsWith("csrftoken="))
      ?.split("=")[1] || "";
  };

  useEffect(() => {
    const fetchUrls = async () => {
      const csrfToken = getCSRFToken();
      try {
        const response = await fetch("http://127.0.0.1:8000/urls", {
          method: "GET",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
            "X-CSRFToken": csrfToken,
          },
          credentials: "include",
        });
  
        if (!response.ok) throw new Error("Failed to get URLs list");
  
        const data = await response.json();
        console.log("Fetched URLs:", data);
        
        //  Vérifie si `user` est défini
        const storedUser = localStorage.getItem("user");
        console.log(storedUser)
        if (storedUser) {
          const userObj = JSON.parse(storedUser);  // Convertir en objet
          setUrls(data.filter(url => url.author === userObj.id));  // Filtrage par user_id
        } else {
          setUrls(data);
        }
  
      } catch (error) {
        console.error("Error Fetching data:", error);
      }
    };
  
    fetchUrls();
  },);
  

  //  Fonction pour classer les URLs par catégories temporelles
  const categorizeUrlsByDate = () => {
    const today = new Date();
    const yesterday = new Date();
    yesterday.setDate(today.getDate() - 1);
    const lastWeek = new Date();
    lastWeek.setDate(today.getDate() - 7);

    return {
      today: urls && urls.filter((url) => new Date(url.created_at).toDateString() === today.toDateString()).length > 0
        ? urls.filter((url) => new Date(url.created_at).toDateString() === today.toDateString())
        : 'empty',
    
      yesterday: urls && urls.filter((url) => new Date(url.created_at).toDateString() === yesterday.toDateString()).length > 0
        ? urls.filter((url) => new Date(url.created_at).toDateString() === yesterday.toDateString())
        : 'empty',
    
      lastWeek: urls && urls.filter((url) => new Date(url.created_at) > lastWeek && new Date(url.created_at) < yesterday).length > 0
        ? urls.filter((url) => new Date(url.created_at) > lastWeek && new Date(url.created_at) < yesterday)
        : 'empty',
    
      oldest: urls && urls.filter((url) => new Date(url.created_at) <= lastWeek).length > 0
        ? urls.filter((url) => new Date(url.created_at) <= lastWeek)
        : 'empty',
    }}

  const categorizedUrls = categorizeUrlsByDate();

  //  Sélection des URLs à afficher en fonction du filtre
  let filteredUrls = [];
  if (selectedFilter === "today") filteredUrls = categorizedUrls.today;
  else if (selectedFilter === "yesterday") filteredUrls = categorizedUrls.yesterday;
  else if (selectedFilter === "lastWeek") filteredUrls = categorizedUrls.lastWeek;
  else if (selectedFilter === "oldest") filteredUrls = categorizedUrls.oldest;
  else filteredUrls = urls; // Affiche toutes les URLs si "all"

  //  Appliquer la recherche sur les URLs filtrées
  filteredUrls = filteredUrls.filter((url) =>
    url.original_url.toLowerCase().includes(searchTerm.toLowerCase()) ||
    url.short_code.toLowerCase().includes(searchTerm.toLowerCase())
  );

  //  Gestion de la pagination
  const indexOfLastUrl = currentPage * urlsPerPage;
  const indexOfFirstUrl = indexOfLastUrl - urlsPerPage;
  const currentUrls = filteredUrls.slice(indexOfFirstUrl, indexOfLastUrl);

  const totalPages = Math.ceil(filteredUrls.length / urlsPerPage);

  //  Fonction pour supprimer une URL
  const deleteUrl = async (id) => {
    try {
      await fetch(`http://127.0.0.1:8000/urls/${id}`, {
        method: "DELETE",
        headers: { Authorization: `Bearer ${token}` },
      });
      setUrls(urls.filter((url) => url.id !== id));
    } catch (error) {
      console.error("Error deleting URL:", error);
    }
  };

  //  Fonction pour gérer les favoris
  const toggleFavorite = (id) => {
    setFavorites(favorites.includes(id) ? favorites.filter((favId) => favId !== id) : [...favorites, id]);
  };

  return (
    <div className="container">

      {/* Barre de recherche */}
      <input
        type="text"
        placeholder="Search URLs..."
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        className="search-bar"
      />

      {/* Filtre par date */}
      <select
        value={selectedFilter}
        onChange={(e) => setSelectedFilter(e.target.value)}
        className="filter-dropdown"
      >
        <option value="all">All</option>
        <option value="today">Today</option>
        <option value="yesterday">Yesterday</option>
        <option value="lastWeek">Last Week</option>
        <option value="oldest">Oldest</option>
      </select>

      {/* Liste des URLs */}
      { currentUrls ? 

      <ul className="url-list">
        {currentUrls.map((url) => (
          <li key={url.id} className="url-item">
            <div className="url-main">
              <span className="short-url">{url.title}</span>
              <button
                className="toggle-btn"
                onClick={() => setExpandedUrl(expandedUrl === url.id ? null : url.id)}
              >
                {expandedUrl === url.id ? <MdExpandLess /> : <MdExpandMore />}
              </button>
            </div>

            {expandedUrl === url.id && (
              <div className="url-details">
                <p><strong>Original:</strong> {url.original_url}</p>
                <p><small>Added on: {new Date(url.created_at).toLocaleString()}</small></p>
                <div className="url-actions">
                  <button onClick={() => toggleFavorite(url.id)}>
                    {favorites.includes(url.id) ? <MdFavorite /> : <MdFavoriteBorder />}
                  </button>
                  <button onClick={() => deleteUrl(url.id)}>
                    <MdDelete />
                  </button>
                </div>
              </div>
            )}
          </li>
        ))}
      </ul>
      : 
      <p>No URL</p>
      }
      

      {/* Pagination */}
      <div className="pagination">
        {Array.from({ length: totalPages }, (_, i) => (
          <button
            key={i + 1}
            onClick={() => setCurrentPage(i + 1)}
            className={currentPage === i + 1 ? "active" : ""}
          >
            {i + 1}
          </button>
        ))}
      </div>

    </div>
  );
};

export default Urls;
