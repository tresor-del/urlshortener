import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import Home from "./pages/Home";
import Register from "./pages/Register";
import Login from "./pages/Login";
import PrivateRoute from "./components/PrivateRoute";
import Shortener from "./components/Shortener";
import Urls from "./pages/Urls";

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/register" element={<Register />} />
          <Route path="/login" element={<Login />} />
          <Route
            path="/"
            element={
                <Home />
            }
          >
            <Route index element={<Shortener />}></Route>
            <Route path="/urls" element={<Urls />}></Route>
          </Route>
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
